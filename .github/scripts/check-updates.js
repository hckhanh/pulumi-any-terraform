#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')
const { execSync, spawnSync } = require('node:child_process')
const os = require('node:os')

/**
 * Fetches the latest version of a Terraform provider from the OpenTofu registry
 * @param {string} namespace - Provider namespace
 * @param {string} name - Provider name
 * @returns {Promise<string|null>} Latest version or null if not found
 */
async function getLatestProviderVersion(namespace, name) {
  try {
    const registryUrl = `https://registry.opentofu.org/v1/providers/${namespace}/${name}/versions`
    const response = await fetch(registryUrl)

    if (!response.ok) {
      console.error(
        `Failed to fetch versions for ${namespace}/${name}: ${response.status}`,
      )
      return null
    }

    const data = await response.json()

    if (!data.versions || data.versions.length === 0) {
      console.error(`No versions found for ${namespace}/${name}`)
      return null
    }

    // Return the latest version (versions are sorted by the API)
    return data.versions[0].version
  } catch (error) {
    console.error(`Error fetching version for ${namespace}/${name}:`, error)
    return null
  }
}

/**
 * Fetches changelog for a specific version of a provider
 * @param {string} namespace - Provider namespace
 * @param {string} name - Provider name
 * @param {string} version - Version to fetch changelog for
 * @returns {Promise<string|null>} Changelog content or null
 */
async function getProviderChangelog(namespace, name, version) {
  try {
    // Try to fetch from GitHub releases
    const githubUrl = `https://api.github.com/repos/${namespace}/terraform-provider-${name}/releases/tags/v${version}`
    const response = await fetch(githubUrl, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'pulumi-any-terraform-updater',
      },
    })

    if (response.ok) {
      const data = await response.json()
      return data.body || null
    }

    return null
  } catch (error) {
    console.error(
      `Error fetching changelog for ${namespace}/${name}@${version}:`,
      error,
    )
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
 * @param {string|null} changelog - Changelog content
 */
function updatePackage(
  packagePath,
  currentProvider,
  newVersion,
  namespace,
  providerName,
  changelog,
) {
  const packageJsonPath = path.join(packagePath, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

  // Create a temporary directory for the Pulumi project
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pulumi-update-'))

  try {
    console.log(`  Creating temporary Pulumi project in ${tempDir}`)

    // Initialize Pulumi project with TypeScript template
    const initResult = spawnSync(
      'pulumi',
      ['new', 'typescript', '--yes', '--force'],
      {
        cwd: tempDir,
        stdio: 'pipe',
      },
    )

    if (initResult.status !== 0) {
      throw new Error(
        `Failed to initialize Pulumi project: ${initResult.stderr?.toString()}`,
      )
    }

    // Run pulumi package add command
    console.log(
      `  Running: pulumi package add terraform-provider ${namespace}/${providerName}@v${newVersion}`,
    )
    const addResult = spawnSync(
      'pulumi',
      [
        'package',
        'add',
        'terraform-provider',
        `${namespace}/${providerName}@v${newVersion}`,
      ],
      {
        cwd: tempDir,
        stdio: 'pipe',
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

      // Skip README.md and package.json (we'll handle package.json separately)
      if (entry.name === 'README.md' || entry.name === 'package.json') {
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

    // Update CHANGELOG.md
    const changelogPath = path.join(packagePath, 'CHANGELOG.md')
    let changelogContent = ''

    if (fs.existsSync(changelogPath)) {
      changelogContent = fs.readFileSync(changelogPath, 'utf8')
    }

    const date = new Date().toISOString().split('T')[0]
    const changelogEntry = changelog
      ? `## ${newVersion} (${date})\n\n${changelog}\n\n`
      : `## ${newVersion} (${date})\n\nUpdate to version ${newVersion}\n\n`

    // Prepend new entry at the beginning (before the first ## entry)
    const versionMatch = changelogContent.match(/^##\s/m)
    if (versionMatch) {
      const insertPos = versionMatch.index
      changelogContent =
        changelogContent.slice(0, insertPos) +
        changelogEntry +
        changelogContent.slice(insertPos)
    } else {
      // No version entries yet, just append to the end
      changelogContent = changelogContent + '\n' + changelogEntry
    }

    fs.writeFileSync(changelogPath, changelogContent)

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
    const currentProvider = JSON.parse(decodedParam).remote

    // Parse namespace and name from URL
    const urlParts = currentProvider.url.split('/')
    const namespace = urlParts[urlParts.length - 2]
    const name = urlParts[urlParts.length - 1]

    console.log(`Checking ${pkg} (${namespace}/${name})...`)
    console.log(`  Current version: ${currentProvider.version}`)

    // Fetch latest version
    const latestVersion = await getLatestProviderVersion(namespace, name)

    if (!latestVersion) {
      console.log(`  Could not fetch latest version`)
      continue
    }

    console.log(`  Latest version: ${latestVersion}`)

    if (latestVersion === currentProvider.version) {
      console.log(`  Already up to date`)
      continue
    }

    // Fetch changelog
    const changelog = await getProviderChangelog(namespace, name, latestVersion)

    // Update package
    updatePackage(
      packagePath,
      currentProvider,
      latestVersion,
      namespace,
      name,
      changelog,
    )

    updates.push({
      name: packageJson.name,
      oldVersion: currentProvider.version,
      newVersion: latestVersion,
      namespace,
      providerName: name,
    })

    updateSummary += `- **${packageJson.name}**: ${currentProvider.version} → ${latestVersion}\n`
  }

  if (updates.length > 0) {
    console.log(`\nUpdated ${updates.length} package(s)`)

    // Create release plan
    const releaseMessage = updates
      .map((u) => `Update ${u.name} from ${u.oldVersion} to ${u.newVersion}`)
      .join('\n\n')

    try {
      // Use spawnSync to avoid command injection
      const result = spawnSync(
        'pnpm',
        ['nx', 'release', 'plan', `--message=${releaseMessage}`],
        {
          stdio: 'inherit',
          cwd: process.cwd(),
        },
      )

      if (result.status !== 0) {
        throw new Error(`nx release plan failed with status ${result.status}`)
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
      console.error('Error creating release plan:', error)
      process.exit(1)
    }

    // Set outputs for GitHub Actions
    if (process.env.GITHUB_OUTPUT) {
      // Escape newlines and backslashes for multiline output
      const escapedSummary = updateSummary
        .replace(/\\/g, '\\\\')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')

      fs.appendFileSync(process.env.GITHUB_OUTPUT, `has_updates=true\n`)
      fs.appendFileSync(
        process.env.GITHUB_OUTPUT,
        `update_summary=${escapedSummary}\n`,
      )
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
