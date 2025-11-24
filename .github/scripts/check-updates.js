#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const os = require('node:os')

/**
 * Determines the semver bump type based on version comparison
 * @param {string} oldVersion - Current version (e.g., "1.2.3")
 * @param {string} newVersion - New version (e.g., "2.0.0")
 * @returns {string} Bump type: "major", "minor", or "patch"
 */
function determineBumpType(oldVersion, newVersion) {
  const parseVersion = (v) => {
    const parts = v.replace(/^v/, '').split('.').map(Number)
    return { major: parts[0] || 0, minor: parts[1] || 0, patch: parts[2] || 0 }
  }

  const oldV = parseVersion(oldVersion)
  const newV = parseVersion(newVersion)

  if (newV.major > oldV.major) return 'major'
  if (newV.minor > oldV.minor) return 'minor'
  return 'patch'
}

/**
 * Fetches the GitHub repository URL from Terraform registry
 * @param {string} namespace - Provider namespace
 * @param {string} name - Provider name
 * @returns {Promise<string|null>} GitHub repository URL or null
 */
async function getGitHubRepoFromRegistry(namespace, name) {
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

    // The source field contains the GitHub repository URL
    if (data.source) {
      return data.source
    }

    return null
  } catch (error) {
    console.error(`Error fetching repo info for ${namespace}/${name}:`, error)
    return null
  }
}

/**
 * Fetches the latest release from GitHub repository
 * @param {string} repoUrl - GitHub repository URL (e.g., "https://github.com/BunnyWay/terraform-provider-bunnynet")
 * @returns {Promise<{version: string, changelog: string|null}|null>} Latest release info or null
 */
async function getLatestGitHubRelease(repoUrl) {
  try {
    // Extract owner/repo from URL (handle .git suffix and trailing paths)
    const match = repoUrl.match(
      /github\.com\/([^\/]+\/[^\/]+?)(?:\.git|\/.*)?$/,
    )
    if (!match) {
      console.error(`Invalid GitHub URL: ${repoUrl}`)
      return null
    }

    const repoPath = match[1]
    const apiUrl = `https://api.github.com/repos/${repoPath}/releases/latest`

    const headers = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'pulumi-any-terraform-updater',
    }

    // Add authentication if GITHUB_TOKEN is available
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

    // Extract version (remove 'v' prefix if present)
    let version = data.tag_name
    if (version && version.startsWith('v')) {
      version = version.substring(1)
    }

    return {
      version: version || null,
      changelog: data.body?.trim().replace(/#\d+/g, `${repoPath}$&`) || null,
    }
  } catch (error) {
    console.error(`Error fetching GitHub release from ${repoUrl}:`, error)
    return null
  }
}

/**
 * Recursively copy directory contents
 * @param {string} src - Source directory
 * @param {string} dest - Destination directory
 * @param {string[]} excludeFiles - Files to exclude (e.g., ['README.md'])
 */
function copyDirectory(src, dest, excludeFiles = []) {
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

/**
 * Updates a package's provider version using pulumi package add
 * @param {string} packagePath - Path to the package
 * @param {object} currentProvider - Current provider information
 * @param {string} newVersion - New version to update to
 * @param {string} namespace - Provider namespace
 * @param {string} providerName - Provider name
 */
function updatePackage(
  packagePath,
  currentProvider,
  newVersion,
  namespace,
  providerName,
) {
  const packageJsonPath = path.join(packagePath, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

  // Create a temporary directory for the Pulumi project
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pulumi-update-'))

  try {
    console.log(`  Creating temporary Pulumi project in ${tempDir}`)

    // Initialize Pulumi project with TypeScript template
    // Set a passphrase for the temporary project (not used for secrets)
    const initResult = spawnSync(
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

    // Run pulumi package add command
    console.log(
      `  Running: pulumi package add terraform-provider ${namespace}/${providerName} ${newVersion}`,
    )
    const addResult = spawnSync(
      'pulumi',
      [
        'package',
        'add',
        'terraform-provider',
        `${namespace}/${providerName}`,
        newVersion,
      ],
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

    // Find the generated SDK directory
    const sdksDir = path.join(tempDir, 'sdks')
    if (!fs.existsSync(sdksDir)) {
      throw new Error(`SDKs directory not found at ${sdksDir}`)
    }

    // Find the generated package directory that matches the provider name
    // The sdks folder contains multiple packages (package1, package2, etc.)
    const sdkPackages = fs
      .readdirSync(sdksDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())

    if (sdkPackages.length === 0) {
      throw new Error(`No package directories found in ${sdksDir}`)
    }

    // Try to find the package by checking package.json name or use the first one
    let sdkDir = null
    for (const pkgDir of sdkPackages) {
      const pkgPath = path.join(sdksDir, pkgDir.name)
      const pkgJsonPath = path.join(pkgPath, 'package.json')

      if (fs.existsSync(pkgJsonPath)) {
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
        // Check if this package matches the provider name
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

    // If no match found, use the first package directory
    if (!sdkDir) {
      sdkDir = path.join(sdksDir, sdkPackages[0].name)
      console.log(`  Using first package directory at ${sdkDir}`)
    }

    console.log(`  Copying files from generated SDK to ${packagePath}`)

    // Copy all TypeScript files and other files (excluding README.md and package.json)
    const entries = fs.readdirSync(sdkDir, { withFileTypes: true })

    for (const entry of entries) {
      const srcPath = path.join(sdkDir, entry.name)
      const destPath = path.join(packagePath, entry.name)

      // Skip README.md, package.json, and .gitignore (we'll handle package.json separately)
      if (
        entry.name === 'README.md' ||
        entry.name === 'package.json' ||
        entry.name === '.gitignore'
      ) {
        continue
      }

      if (entry.isDirectory()) {
        // Copy entire directory
        copyDirectory(srcPath, destPath)
      } else {
        // Copy file
        fs.copyFileSync(srcPath, destPath)
      }
    }

    // Update package.json: only copy the pulumi property
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
    // Clean up temporary directory
    fs.rmSync(tempDir, { recursive: true, force: true })
    console.log(`  Cleaned up temporary directory`)
  }
}

/**
 * Main function to check and update packages
 */
async function main() {
  const packagesDir = path.join(process.cwd(), 'packages')
  const packages = fs.readdirSync(packagesDir).filter((f) => {
    const stat = fs.statSync(path.join(packagesDir, f))
    return stat.isDirectory()
  })

  const updates = []
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

    // Decode current provider info
    const decodedParam = Buffer.from(
      packageJson.pulumi.parameterization.value,
      'base64',
    ).toString('utf8')

    let currentProvider
    try {
      const parsed = JSON.parse(decodedParam)
      if (!parsed.remote || typeof parsed.remote !== 'object') {
        console.log(`  Invalid parameterization structure`)
        continue
      }
      currentProvider = parsed.remote
    } catch (error) {
      console.log(`  Failed to parse parameterization: ${error.message}`)
      continue
    }

    // Parse namespace and name from URL
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

    // Get GitHub repository URL from registry
    const githubRepoUrl = await getGitHubRepoFromRegistry(namespace, name)

    if (!githubRepoUrl) {
      console.log(`  Could not find GitHub repository for ${namespace}/${name}`)
      continue
    }

    console.log(`  GitHub repository: ${githubRepoUrl}`)

    // Fetch latest release from GitHub
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

    // Update package
    updatePackage(packagePath, currentProvider, latestVersion, namespace, name)

    const bumpType = determineBumpType(currentProvider.version, latestVersion)

    updates.push({
      name: packageJson.name,
      projectName: pkg, // The directory name which is the nx project name
      oldVersion: currentProvider.version,
      newVersion: latestVersion,
      bumpType,
      changelog, // Include changelog for potential use in release message
      namespace,
      providerName: name,
    })

    updateSummary += `- **${packageJson.name}**: ${currentProvider.version} → ${latestVersion}\n`
  }

  if (updates.length > 0) {
    console.log(`\nUpdated ${updates.length} package(s)`)

    // Create changeset files for each project
    try {
      const changesetsDir = path.join(process.cwd(), '.changeset')

      for (const update of updates) {
        console.log('changelog', `"${update.changelog}"`)

        // Create changeset message
        let changesetMessage = update.changelog
          ? update.changelog
          : `Update ${update.name} from ${update.oldVersion} to ${update.newVersion}`

        console.log(
          `\nCreating changeset for ${update.name} (${update.bumpType})...`,
        )

        // Generate a unique filename using timestamp and package name
        const timestamp = Date.now()
        const sanitizedName = update.name.replace(/[^a-z0-9]/gi, '-')
        const changesetFilename = `${sanitizedName}-${timestamp}.md`
        const changesetPath = path.join(changesetsDir, changesetFilename)

        // Create changeset content
        const changesetContent = `---
'${update.name}': ${update.bumpType}
---

${changesetMessage}
`

        fs.writeFileSync(changesetPath, changesetContent)
        console.log(`  Created changeset: ${changesetFilename}`)
      }

      // Stage all changes
      const gitResult = spawnSync('git', ['add', '.'], {
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

    // Set outputs for GitHub Actions
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

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
