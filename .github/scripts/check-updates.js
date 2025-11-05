#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')
const { execSync } = require('node:child_process')

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
 * Updates a package's provider version
 * @param {string} packagePath - Path to the package
 * @param {object} currentProvider - Current provider information
 * @param {string} newVersion - New version to update to
 * @param {string|null} changelog - Changelog content
 */
function updatePackage(packagePath, currentProvider, newVersion, changelog) {
  const packageJsonPath = path.join(packagePath, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

  // Update parameterization
  const newParamValue = {
    remote: {
      url: currentProvider.url,
      version: newVersion,
    },
  }

  const encodedParam = Buffer.from(JSON.stringify(newParamValue)).toString(
    'base64',
  )
  packageJson.pulumi.parameterization.value = encodedParam
  packageJson.pulumi.parameterization.version = newVersion

  // Write updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')

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
    updatePackage(packagePath, currentProvider, latestVersion, changelog)

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
      execSync(`pnpm nx release plan --message="${releaseMessage}"`, {
        stdio: 'inherit',
        cwd: process.cwd(),
      })

      // Stage all changes
      execSync('git add .', { stdio: 'inherit', cwd: process.cwd() })

      console.log('\nChanges staged successfully')
    } catch (error) {
      console.error('Error creating release plan:', error)
      process.exit(1)
    }

    // Set outputs for GitHub Actions
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `has_updates=true\n`)
      fs.appendFileSync(
        process.env.GITHUB_OUTPUT,
        `update_summary=${updateSummary}\n`,
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
