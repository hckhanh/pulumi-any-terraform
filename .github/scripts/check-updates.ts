#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import childProcess from 'node:child_process'
import os from 'node:os'

interface ProviderInfo {
  url: string
  version: string
}

interface ReleaseInfo {
  version: string | null
  changelog: string | null
}

type BumpType = 'major' | 'minor' | 'patch'

interface UpdateInfo {
  name: string
  projectName: string
  oldVersion: string
  newVersion: string
  bumpType: BumpType
  changelog: string | null
  namespace: string
  providerName: string
}

function determineBumpType(oldVersion: string, newVersion: string): BumpType {
  const parseVersion = (v: string) => {
    const parts = v.replace(/^v/, '').split('.').map(Number)
    return { major: parts[0] || 0, minor: parts[1] || 0, patch: parts[2] || 0 }
  }

  const oldV = parseVersion(oldVersion)
  const newV = parseVersion(newVersion)

  if (newV.major > oldV.major) return 'major'
  if (newV.minor > oldV.minor) return 'minor'
  return 'patch'
}

async function getGitHubRepoFromRegistry(
  namespace: string,
  name: string,
): Promise<string | null> {
  try {
    const registryUrl = `https://registry.terraform.io/v1/providers/${namespace}/${name}`
    const response = await fetch(registryUrl)

    if (!response.ok) {
      console.error(
        `Failed to fetch provider info for ${namespace}/${name}: ${response.status}`,
      )
      return null
    }

    const data = await response.json()

    if (data.source) {
      return data.source
    }

    return null
  } catch (error) {
    console.error(`Error fetching repo info for ${namespace}/${name}:`, error)
    return null
  }
}

async function getLatestGitHubRelease(
  repoUrl: string,
): Promise<ReleaseInfo | null> {
  try {
    const match = repoUrl.match(
      /github\.com\/([^\/]+\/[^\/]+?)(?:\.git|\/.*)?$/,
    )
    if (!match) {
      console.error(`Invalid GitHub URL: ${repoUrl}`)
      return null
    }

    const repoPath = match[1]
    const apiUrl = `https://api.github.com/repos/${repoPath}/releases/latest`

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'pulumi-any-terraform-updater',
    }

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    const response = await fetch(apiUrl, { headers })

    if (!response.ok) {
      console.error(
        `Failed to fetch latest release from ${repoPath}: ${response.status}`,
      )
      return null
    }

    const data = await response.json()

    let version: string | undefined = data.tag_name
    if (version && version.startsWith('v')) {
      version = version.substring(1)
    }

    return {
      version: version || null,
      changelog:
        data.body
          ?.trim()
          .replace(/#\d+/g, `${repoPath}$&`)
          .replace(/[a-f0-9]{40}/g, `${repoPath}@$&`) || null,
    }
  } catch (error) {
    console.error(`Error fetching GitHub release from ${repoUrl}:`, error)
    return null
  }
}

function copyDirectory(
  src: string,
  dest: string,
  excludeFiles: string[] = [],
): void {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  const entries = fs.readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (excludeFiles.includes(entry.name)) {
      continue
    }

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath, excludeFiles)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

function updatePackage(
  packagePath: string,
  currentProvider: ProviderInfo,
  newVersion: string,
  namespace: string,
  providerName: string,
): void {
  const packageJsonPath = path.join(packagePath, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pulumi-update-'))

  try {
    console.log(`  Creating temporary Pulumi project in ${tempDir}`)

    const initResult = childProcess.spawnSync(
      'pulumi',
      ['new', 'typescript', '--yes', '--force'],
      {
        cwd: tempDir,
        stdio: 'pipe',
        env: {
          ...process.env,
          PULUMI_CONFIG_PASSPHRASE: 'temp-passphrase-for-update',
        },
      },
    )

    if (initResult.status !== 0) {
      throw new Error(
        `Failed to initialize Pulumi project: ${initResult.stderr?.toString()}`,
      )
    }

    console.log(
      `  Running: pulumi package add terraform-provider ${namespace}/${providerName} ${newVersion}`,
    )
    const addResult = childProcess.spawnSync(
      'pulumi',
      ['package', 'add', 'terraform-provider', currentProvider.url, newVersion],
      {
        cwd: tempDir,
        stdio: 'pipe',
        env: {
          ...process.env,
          PULUMI_CONFIG_PASSPHRASE: 'temp-passphrase-for-update',
        },
      },
    )

    if (addResult.status !== 0) {
      throw new Error(`Failed to add provider: ${addResult.stderr?.toString()}`)
    }

    const sdksDir = path.join(tempDir, 'sdks')
    if (!fs.existsSync(sdksDir)) {
      throw new Error(`SDKs directory not found at ${sdksDir}`)
    }

    const sdkPackages = fs
      .readdirSync(sdksDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())

    if (sdkPackages.length === 0) {
      throw new Error(`No package directories found in ${sdksDir}`)
    }

    let sdkDir: string | null = null
    for (const pkgDir of sdkPackages) {
      const pkgPath = path.join(sdksDir, pkgDir.name)
      const pkgJsonPath = path.join(pkgPath, 'package.json')

      if (fs.existsSync(pkgJsonPath)) {
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
        if (
          pkgJson.name.includes(providerName) ||
          pkgJson.pulumi?.name === providerName
        ) {
          sdkDir = pkgPath
          console.log(`  Found matching package at ${sdkDir}`)
          break
        }
      }
    }

    if (!sdkDir) {
      sdkDir = path.join(sdksDir, sdkPackages[0].name)
      console.log(`  Using first package directory at ${sdkDir}`)
    }

    console.log(`  Copying files from generated SDK to ${packagePath}`)

    const entries = fs.readdirSync(sdkDir, { withFileTypes: true })

    for (const entry of entries) {
      const srcPath = path.join(sdkDir, entry.name)
      const destPath = path.join(packagePath, entry.name)

      if (
        entry.name === 'README.md' ||
        entry.name === 'package.json' ||
        entry.name === '.gitignore'
      ) {
        continue
      }

      if (entry.isDirectory()) {
        copyDirectory(srcPath, destPath)
      } else {
        fs.copyFileSync(srcPath, destPath)
      }
    }

    const generatedPackageJsonPath = path.join(sdkDir, 'package.json')
    if (fs.existsSync(generatedPackageJsonPath)) {
      const generatedPackageJson = JSON.parse(
        fs.readFileSync(generatedPackageJsonPath, 'utf8'),
      )

      if (generatedPackageJson.pulumi) {
        packageJson.pulumi = generatedPackageJson.pulumi
        fs.writeFileSync(
          packageJsonPath,
          JSON.stringify(packageJson, null, 2) + '\n',
        )
        console.log(`  Updated pulumi property in package.json`)
      }
    }

    console.log(`Updated ${packageJson.name} to version ${newVersion}`)
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
    console.log(`  Cleaned up temporary directory`)
  }
}

async function main(): Promise<void> {
  const packagesDir = path.join(process.cwd(), 'packages')
  const packages = fs.readdirSync(packagesDir).filter((f) => {
    const stat = fs.statSync(path.join(packagesDir, f))
    return stat.isDirectory()
  })

  const updates: UpdateInfo[] = []
  let updateSummary = ''

  for (const pkg of packages) {
    const packagePath = path.join(packagesDir, pkg)
    const packageJsonPath = path.join(packagePath, 'package.json')

    if (!fs.existsSync(packageJsonPath)) {
      continue
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

    if (!packageJson.pulumi?.parameterization?.value) {
      console.log(`Skipping ${pkg}: no parameterization found`)
      continue
    }

    const decodedParam = Buffer.from(
      packageJson.pulumi.parameterization.value,
      'base64',
    ).toString('utf8')

    let currentProvider: ProviderInfo
    try {
      const parsed = JSON.parse(decodedParam)
      if (!parsed.remote || typeof parsed.remote !== 'object') {
        console.log(`  Invalid parameterization structure`)
        continue
      }
      currentProvider = parsed.remote
    } catch (error) {
      console.log(
        `  Failed to parse parameterization: ${(error as Error).message}`,
      )
      continue
    }

    if (!currentProvider.url || typeof currentProvider.url !== 'string') {
      console.log(`  Invalid provider URL`)
      continue
    }

    const urlParts = currentProvider.url.split('/')
    if (urlParts.length < 2) {
      console.log(`  Invalid provider URL format`)
      continue
    }

    const namespace = urlParts[urlParts.length - 2]
    const name = urlParts[urlParts.length - 1]

    console.log(`Checking ${pkg} (${namespace}/${name})...`)
    console.log(`  Current version: ${currentProvider.version}`)

    const githubRepoUrl = await getGitHubRepoFromRegistry(namespace, name)

    if (!githubRepoUrl) {
      console.log(`  Could not find GitHub repository for ${namespace}/${name}`)
      continue
    }

    console.log(`  GitHub repository: ${githubRepoUrl}`)

    const releaseInfo = await getLatestGitHubRelease(githubRepoUrl)

    if (!releaseInfo || !releaseInfo.version) {
      console.log(`  Could not fetch latest release from GitHub`)
      continue
    }

    const latestVersion = releaseInfo.version
    const changelog = releaseInfo.changelog

    console.log(`  Latest version: ${latestVersion}`)

    if (latestVersion === currentProvider.version) {
      console.log(`  Already up to date`)
      continue
    }

    updatePackage(packagePath, currentProvider, latestVersion, namespace, name)

    const bumpType = determineBumpType(currentProvider.version, latestVersion)

    updates.push({
      name: packageJson.name,
      projectName: pkg,
      oldVersion: currentProvider.version,
      newVersion: latestVersion,
      bumpType,
      changelog,
      namespace,
      providerName: name,
    })

    updateSummary += `- **${packageJson.name}**: ${currentProvider.version} → ${latestVersion}\n`
  }

  if (updates.length > 0) {
    console.log(`\nUpdated ${updates.length} package(s)`)

    try {
      const changesetsDir = path.join(process.cwd(), '.changeset')

      for (const update of updates) {
        console.log('changelog', `"${update.changelog}"`)

        const changesetMessage = update.changelog
          ? update.changelog
          : `Update ${update.name} from ${update.oldVersion} to ${update.newVersion}`

        console.log(
          `\nCreating changeset for ${update.name} (${update.bumpType})...`,
        )

        const timestamp = Date.now()
        const sanitizedName = update.name.replace(/[^a-z0-9]/gi, '-')
        const changesetFilename = `${sanitizedName}-${timestamp}.md`
        const changesetPath = path.join(changesetsDir, changesetFilename)

        const changesetContent = `---
'${update.name}': ${update.bumpType}
---

${changesetMessage}
`

        fs.writeFileSync(changesetPath, changesetContent)
        console.log(`  Created changeset: ${changesetFilename}`)
      }

      const gitResult = childProcess.spawnSync('git', ['add', '.'], {
        stdio: 'inherit',
        cwd: process.cwd(),
      })

      if (gitResult.status !== 0) {
        throw new Error(`git add failed with status ${gitResult.status}`)
      }

      console.log('\nChanges staged successfully')
    } catch (error) {
      console.error('Error creating changesets:', error)
      process.exit(1)
    }

    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `has_updates=true\n`)
    }
  } else {
    console.log('\nNo updates available')
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `has_updates=false\n`)
    }
  }
}

if (import.meta.filename === process.argv[1]) {
  main().catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
}

export {
  determineBumpType,
  getGitHubRepoFromRegistry,
  getLatestGitHubRelease,
  copyDirectory,
  updatePackage,
  main,
}
