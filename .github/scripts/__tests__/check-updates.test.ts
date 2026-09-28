import assert from 'node:assert/strict'
import childProcess from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import type { MockFunctionContext } from 'node:test'
import { afterEach, beforeEach, describe, it, mock } from 'node:test'
import {
  copyDirectory,
  determineBumpType,
  getGitHubRepoFromRegistry,
  getLatestGitHubRelease,
  main,
  normalizeChangelog,
  updatePackage,
} from '../check-updates.ts'

// ---------------------------------------------------------------------------
// Test helpers: centralize type-unsafe mocking of global/module properties
// ---------------------------------------------------------------------------

interface MockedFetch {
  mock: MockFunctionContext<typeof fetch>

  (...args: Parameters<typeof fetch>): ReturnType<typeof fetch>
}

/**
 * Replace globalThis.fetch with a mock. Returns the mock for call assertions.
 * The mock doesn't implement the full Response interface -- only the properties
 * actually used by the functions under test (ok, status, json, body).
 */
function mockFetch(impl: (...args: any[]) => Promise<unknown>): MockedFetch {
  const fn = mock.fn(impl)
  // @ts-expect-error -- partial Response mock; only tested properties are used
  globalThis.fetch = fn
  return globalThis.fetch as unknown as MockedFetch
}

/**
 * Replace childProcess.spawnSync on the ESM module namespace.
 * Node 24 allows mutation of built-in module namespace properties at runtime.
 */
function setSpawnSync(fn: unknown): void {
  // @ts-expect-error -- mutating ESM namespace property for test mocking
  childProcess.spawnSync = fn
}

function commandFrom(
  cmd: string,
  args: string[] = [],
): { command: string; args: string[] } {
  if (cmd === '/usr/bin/env') {
    return { command: args[0] ?? '', args: args.slice(1) }
  }
  return { command: cmd, args }
}

// ---------------------------------------------------------------------------
// determineBumpType
// ---------------------------------------------------------------------------

describe('determineBumpType', () => {
  const cases: Array<[string, string, 'major' | 'minor' | 'patch']> = [
    ['1.2.3', '2.0.0', 'major'],
    ['1.2.3', '1.3.0', 'minor'],
    ['1.2.3', '1.2.4', 'patch'],
    ['v1.2.3', '2.0.0', 'major'],
    ['1.2.3', 'v2.0.0', 'major'],
    ['v1.2.3', 'v1.3.0', 'minor'],
    ['1.2.3', '1.2.3', 'patch'],
    ['0.0.0', '0.0.1', 'patch'],
    ['1.99.99', '2.0.0', 'major'],
    ['1.2', '1.3', 'minor'],
    ['1', '2', 'major'],
    ['1.2.3', '2.1.0', 'major'],
  ]

  for (const [from, to, expected] of cases) {
    it(`maps ${from} to ${to} as ${expected}`, () => {
      assert.equal(determineBumpType(from, to), expected)
    })
  }
})

// ---------------------------------------------------------------------------
// normalizeChangelog
// ---------------------------------------------------------------------------

describe('normalizeChangelog', () => {
  it('strips "## Changelog" title heading', async () => {
    const input = '## Changelog\n\n### Bug Fixes\n- fix something'
    const result = await normalizeChangelog(input)
    assert.equal(result, '#### Bug Fixes\n\n- fix something')
  })

  it('strips "## What\'s Changed" title heading', async () => {
    const input = "## What's Changed\n\n- feat: add feature by @user"
    const result = await normalizeChangelog(input)
    assert.equal(result, '- feat: add feature by @user')
  })

  it('strips "# Release vX.Y.Z" title heading', async () => {
    const input = '# Release v1.27.0\n\n### Resource Timeouts\n- Added timeouts'
    const result = await normalizeChangelog(input)
    assert.equal(result, '#### Resource Timeouts\n\n- Added timeouts')
  })

  it('demotes ### headings to ####', async () => {
    const input =
      '### Bug Fixes\n- fix something\n### Features\n- add something'
    const result = await normalizeChangelog(input)
    assert.ok(result.includes('#### Bug Fixes'))
    assert.ok(result.includes('#### Features'))
  })

  it('demotes #### headings to #####', async () => {
    const input = '#### Sub-section\n- detail'
    const result = await normalizeChangelog(input)
    assert.ok(result.startsWith('##### Sub-section'))
  })

  it('caps heading demotion at level 6', async () => {
    const input = '###### Deep heading\n- detail'
    const result = await normalizeChangelog(input)
    assert.ok(result.startsWith('###### Deep heading'))
  })

  it('shortens 40-char SHAs to 7-char in repo@sha format', async () => {
    const sha = 'abcdef1234567890abcdef1234567890abcdef12'
    const input = `- Owner/repo@${sha}: fix something`
    const result = await normalizeChangelog(input)
    assert.equal(result, `- Owner/repo@${sha.slice(0, 7)}: fix something`)
  })

  it('ensures blank lines around headings', async () => {
    const input =
      '### Bug Fixes\n- fix something\n### Features\n- add something'
    const result = await normalizeChangelog(input)
    assert.equal(
      result,
      '#### Bug Fixes\n\n- fix something\n\n#### Features\n\n- add something',
    )
  })

  it('passes through content with no headings', async () => {
    const input = '- fix something\n- add something'
    const result = await normalizeChangelog(input)
    assert.equal(result, '- fix something\n- add something')
  })

  it('handles empty content', async () => {
    const result = await normalizeChangelog('')
    assert.equal(result, '')
  })

  it('skips leading blank lines', async () => {
    const input = '\n\n### Bug Fixes\n- fix something'
    const result = await normalizeChangelog(input)
    assert.equal(result, '#### Bug Fixes\n\n- fix something')
  })

  it('does not modify headings inside fenced code blocks', async () => {
    const input =
      '### Bug Fixes\n\n```yaml\n### comment in code\nkey: value\n```\n\n### Features\n- new feature'
    const result = await normalizeChangelog(input)
    assert.ok(result.includes('#### Bug Fixes'))
    assert.ok(result.includes('### comment in code'))
    assert.ok(result.includes('#### Features'))
  })

  it('does not insert blank lines inside fenced code blocks', async () => {
    const input = '```\n### heading\ncontent\n```'
    const result = await normalizeChangelog(input)
    assert.ok(!result.includes('### heading\n\ncontent'))
    assert.ok(result.includes('### heading\ncontent'))
  })
})

// ---------------------------------------------------------------------------
// getGitHubRepoFromRegistry
// ---------------------------------------------------------------------------

describe('getGitHubRepoFromRegistry', () => {
  let originalFetch: typeof globalThis.fetch

  beforeEach(() => {
    originalFetch = globalThis.fetch
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('returns source URL on success', async () => {
    const fn = mockFetch(async () => ({
      ok: true,
      json: async () => ({
        source: 'https://github.com/BunnyWay/terraform-provider-bunnynet',
      }),
    }))

    const result = await getGitHubRepoFromRegistry('bunnyway', 'bunnynet')
    assert.equal(
      result,
      'https://github.com/BunnyWay/terraform-provider-bunnynet',
    )

    const [url] = fn.mock.calls[0].arguments
    assert.equal(
      url,
      'https://registry.terraform.io/v1/providers/bunnyway/bunnynet',
    )
  })

  it('returns null when source field is missing', async () => {
    mockFetch(async () => ({
      ok: true,
      json: async () => ({}),
    }))

    const result = await getGitHubRepoFromRegistry('ns', 'name')
    assert.equal(result, null)
  })

  it('returns null on HTTP 404', async () => {
    mockFetch(async () => ({
      ok: false,
      status: 404,
    }))

    const result = await getGitHubRepoFromRegistry('ns', 'name')
    assert.equal(result, null)
  })

  it('returns null on HTTP 500', async () => {
    mockFetch(async () => ({
      ok: false,
      status: 500,
    }))

    const result = await getGitHubRepoFromRegistry('ns', 'name')
    assert.equal(result, null)
  })

  it('returns null on network error', async () => {
    mockFetch(async () => {
      throw new Error('Network error')
    })

    const result = await getGitHubRepoFromRegistry('ns', 'name')
    assert.equal(result, null)
  })

  it('returns null on JSON parse error', async () => {
    mockFetch(async () => ({
      ok: true,
      json: async () => {
        throw new SyntaxError('Unexpected token')
      },
    }))

    const result = await getGitHubRepoFromRegistry('ns', 'name')
    assert.equal(result, null)
  })
})

// ---------------------------------------------------------------------------
// getLatestGitHubRelease
// ---------------------------------------------------------------------------

describe('getLatestGitHubRelease', () => {
  let originalFetch: typeof globalThis.fetch
  let originalToken: string | undefined

  beforeEach(() => {
    originalFetch = globalThis.fetch
    originalToken = process.env.GITHUB_TOKEN
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
    if (originalToken !== undefined) {
      process.env.GITHUB_TOKEN = originalToken
    } else {
      delete process.env.GITHUB_TOKEN
    }
  })

  // --- URL parsing ---

  const releaseUrls = [
    'https://github.com/owner/repo',
    'https://github.com/owner/repo.git',
    'https://github.com/owner/repo/tree/main',
  ]

  for (const sourceUrl of releaseUrls) {
    it(`requests the latest release for ${sourceUrl}`, async () => {
      const fn = mockFetch(async () => ({
        ok: true,
        json: async () => ({ tag_name: 'v1.0.0', body: null }),
      }))

      await getLatestGitHubRelease(sourceUrl)
      const [url] = fn.mock.calls[0].arguments
      assert.equal(
        url,
        'https://api.github.com/repos/owner/repo/releases/latest',
      )
    })
  }

  it('returns null for non-GitHub URL', async () => {
    const result = await getLatestGitHubRelease('https://gitlab.com/owner/repo')
    assert.equal(result, null)
  })

  it('returns null for empty string', async () => {
    const result = await getLatestGitHubRelease('')
    assert.equal(result, null)
  })

  it('returns null for malformed URL', async () => {
    const result = await getLatestGitHubRelease('not-a-url')
    assert.equal(result, null)
  })

  // --- Response handling ---

  it('strips v-prefix from tag_name', async () => {
    mockFetch(async () => ({
      ok: true,
      json: async () => ({ tag_name: 'v1.2.3', body: 'changes' }),
    }))

    const result = await getLatestGitHubRelease('https://github.com/owner/repo')
    assert.equal(result!.version, '1.2.3')
  })

  it('preserves tag_name without v-prefix', async () => {
    mockFetch(async () => ({
      ok: true,
      json: async () => ({ tag_name: '1.2.3', body: 'changes' }),
    }))

    const result = await getLatestGitHubRelease('https://github.com/owner/repo')
    assert.equal(result!.version, '1.2.3')
  })

  it('returns null changelog for null body', async () => {
    mockFetch(async () => ({
      ok: true,
      json: async () => ({ tag_name: 'v1.0.0', body: null }),
    }))

    const result = await getLatestGitHubRelease('https://github.com/owner/repo')
    assert.equal(result!.changelog, null)
  })

  it('returns null changelog for whitespace-only body', async () => {
    mockFetch(async () => ({
      ok: true,
      json: async () => ({ tag_name: 'v1.0.0', body: '   ' }),
    }))

    const result = await getLatestGitHubRelease('https://github.com/owner/repo')
    assert.equal(result!.changelog, null)
  })

  it('rewrites issue references with repo path', async () => {
    mockFetch(async () => ({
      ok: true,
      json: async () => ({
        tag_name: 'v1.0.0',
        body: 'Fixed #123 and #456',
      }),
    }))

    const result = await getLatestGitHubRelease('https://github.com/owner/repo')
    assert.equal(result!.changelog, 'Fixed owner/repo#123 and owner/repo#456')
  })

  it('rewrites 40-char commit hashes with repo path', async () => {
    const hash = 'a'.repeat(40)
    mockFetch(async () => ({
      ok: true,
      json: async () => ({
        tag_name: 'v1.0.0',
        body: `See ${hash}`,
      }),
    }))

    const result = await getLatestGitHubRelease('https://github.com/owner/repo')
    assert.equal(result!.changelog, `See owner/repo@${hash}`)
  })

  // --- Auth and errors ---

  it('sends Authorization header when GITHUB_TOKEN is set', async () => {
    process.env.GITHUB_TOKEN = 'test-token-123'
    const fn = mockFetch(async () => ({
      ok: true,
      json: async () => ({ tag_name: 'v1.0.0', body: null }),
    }))

    await getLatestGitHubRelease('https://github.com/owner/repo')
    const [, options] = fn.mock.calls[0].arguments
    const headers = options!.headers as Record<string, string>
    assert.equal(headers.Authorization, 'Bearer test-token-123')
  })

  it('omits Authorization header when GITHUB_TOKEN is not set', async () => {
    delete process.env.GITHUB_TOKEN
    const fn = mockFetch(async () => ({
      ok: true,
      json: async () => ({ tag_name: 'v1.0.0', body: null }),
    }))

    await getLatestGitHubRelease('https://github.com/owner/repo')
    const [, options] = fn.mock.calls[0].arguments
    const headers = options!.headers as Record<string, string>
    assert.equal(headers.Authorization, undefined)
  })

  it('returns null on HTTP error', async () => {
    mockFetch(async () => ({
      ok: false,
      status: 404,
    }))

    const result = await getLatestGitHubRelease('https://github.com/owner/repo')
    assert.equal(result, null)
  })

  it('returns null on network error', async () => {
    mockFetch(async () => {
      throw new Error('Network error')
    })

    const result = await getLatestGitHubRelease('https://github.com/owner/repo')
    assert.equal(result, null)
  })
})

// ---------------------------------------------------------------------------
// copyDirectory
// ---------------------------------------------------------------------------

describe('copyDirectory', () => {
  let tempBase: string
  let srcDir: string
  let destDir: string

  beforeEach(() => {
    tempBase = fs.mkdtempSync(path.join(os.tmpdir(), 'copy-test-'))
    srcDir = path.join(tempBase, 'src')
    destDir = path.join(tempBase, 'dest')
    fs.mkdirSync(srcDir, { recursive: true })
  })

  afterEach(() => {
    fs.rmSync(tempBase, { recursive: true, force: true })
  })

  it('copies flat directory', () => {
    fs.writeFileSync(path.join(srcDir, 'a.txt'), 'a')
    fs.writeFileSync(path.join(srcDir, 'b.txt'), 'b')
    fs.writeFileSync(path.join(srcDir, 'c.txt'), 'c')

    copyDirectory(srcDir, destDir)

    assert.equal(fs.readFileSync(path.join(destDir, 'a.txt'), 'utf8'), 'a')
    assert.equal(fs.readFileSync(path.join(destDir, 'b.txt'), 'utf8'), 'b')
    assert.equal(fs.readFileSync(path.join(destDir, 'c.txt'), 'utf8'), 'c')
  })

  it('copies nested directories recursively', () => {
    fs.mkdirSync(path.join(srcDir, 'sub'), { recursive: true })
    fs.writeFileSync(path.join(srcDir, 'sub', 'file.txt'), 'nested')

    copyDirectory(srcDir, destDir)

    assert.equal(
      fs.readFileSync(path.join(destDir, 'sub', 'file.txt'), 'utf8'),
      'nested',
    )
  })

  it('creates destination directory if it does not exist', () => {
    fs.writeFileSync(path.join(srcDir, 'file.txt'), 'data')

    const newDest = path.join(tempBase, 'nonexistent', 'deep')
    copyDirectory(srcDir, newDest)

    assert.equal(
      fs.readFileSync(path.join(newDest, 'file.txt'), 'utf8'),
      'data',
    )
  })

  it('excludes specified files', () => {
    fs.writeFileSync(path.join(srcDir, 'keep.txt'), 'keep')
    fs.writeFileSync(path.join(srcDir, 'README.md'), 'readme')

    copyDirectory(srcDir, destDir, ['README.md'])

    assert.ok(fs.existsSync(path.join(destDir, 'keep.txt')))
    assert.ok(!fs.existsSync(path.join(destDir, 'README.md')))
  })

  it('excludes multiple files', () => {
    fs.writeFileSync(path.join(srcDir, 'a.txt'), 'a')
    fs.writeFileSync(path.join(srcDir, 'b.txt'), 'b')
    fs.writeFileSync(path.join(srcDir, 'c.txt'), 'c')

    copyDirectory(srcDir, destDir, ['a.txt', 'b.txt'])

    assert.ok(!fs.existsSync(path.join(destDir, 'a.txt')))
    assert.ok(!fs.existsSync(path.join(destDir, 'b.txt')))
    assert.ok(fs.existsSync(path.join(destDir, 'c.txt')))
  })

  it('handles empty source directory', () => {
    copyDirectory(srcDir, destDir)

    assert.ok(fs.existsSync(destDir))
    assert.equal(fs.readdirSync(destDir).length, 0)
  })

  it('copies deeply nested structures (3+ levels)', () => {
    const deepDir = path.join(srcDir, 'l1', 'l2', 'l3')
    fs.mkdirSync(deepDir, { recursive: true })
    fs.writeFileSync(path.join(deepDir, 'deep.txt'), 'deep')

    copyDirectory(srcDir, destDir)

    assert.equal(
      fs.readFileSync(path.join(destDir, 'l1', 'l2', 'l3', 'deep.txt'), 'utf8'),
      'deep',
    )
  })
})

// ---------------------------------------------------------------------------
// updatePackage
// ---------------------------------------------------------------------------

describe('updatePackage', () => {
  let tempBase: string
  let packagePath: string
  let originalSpawnSync: typeof childProcess.spawnSync

  beforeEach(() => {
    tempBase = fs.mkdtempSync(path.join(os.tmpdir(), 'update-pkg-test-'))
    packagePath = path.join(tempBase, 'test-package')
    fs.mkdirSync(packagePath, { recursive: true })

    fs.writeFileSync(
      path.join(packagePath, 'package.json'),
      JSON.stringify({
        name: 'pulumi-testprovider',
        version: '1.0.0',
        pulumi: {
          resource: true,
          name: 'terraform-provider',
          parameterization: { name: 'testprovider', version: '1.0.0' },
        },
      }),
    )

    originalSpawnSync = childProcess.spawnSync
  })

  afterEach(() => {
    setSpawnSync(originalSpawnSync)
    fs.rmSync(tempBase, { recursive: true, force: true })
  })

  function mockSpawnSyncWithSDK(
    opts: {
      matchingName?: string
      pulumiProperty?: any
      dependencies?: Record<string, string> | null
    } = {},
  ) {
    const { matchingName = 'testprovider', pulumiProperty = null } = opts

    setSpawnSync(
      mock.fn((cmd: string, args: string[], options: any) => {
        if (
          commandFrom(cmd, args).command === 'pulumi' &&
          commandFrom(cmd, args).args[0] === 'new'
        ) {
          return { status: 0 }
        }

        if (
          commandFrom(cmd, args).command === 'pulumi' &&
          commandFrom(cmd, args).args[0] === 'package'
        ) {
          const sdksDir = path.join(options.cwd, 'sdks')
          const pkgDir = path.join(sdksDir, 'nodejs')
          fs.mkdirSync(pkgDir, { recursive: true })

          fs.writeFileSync(path.join(pkgDir, 'index.ts'), '// generated')
          fs.writeFileSync(path.join(pkgDir, 'README.md'), '# Generated')
          fs.writeFileSync(path.join(pkgDir, '.gitignore'), 'node_modules')

          const pkgJson: Record<string, unknown> = {
            name: `@pulumi/${matchingName}`,
            pulumi: pulumiProperty || {
              name: matchingName,
              version: '2.0.0',
            },
          }
          if (opts.dependencies) {
            pkgJson.dependencies = opts.dependencies
          }
          fs.writeFileSync(
            path.join(pkgDir, 'package.json'),
            JSON.stringify(pkgJson),
          )

          return { status: 0 }
        }

        return { status: 0 }
      }),
    )
  }

  it('copies generated SDK files to package directory', () => {
    mockSpawnSyncWithSDK()

    const provider = {
      url: 'registry.opentofu.org/ns/testprovider',
      version: '1.0.0',
    }
    updatePackage(packagePath, provider, '2.0.0', 'ns', 'testprovider')

    assert.ok(fs.existsSync(path.join(packagePath, 'index.ts')))
  })

  it('excludes README.md from copied files', () => {
    mockSpawnSyncWithSDK()

    const provider = {
      url: 'registry.opentofu.org/ns/testprovider',
      version: '1.0.0',
    }
    updatePackage(packagePath, provider, '2.0.0', 'ns', 'testprovider')

    assert.ok(!fs.existsSync(path.join(packagePath, 'README.md')))
  })

  it('excludes .gitignore from copied files', () => {
    mockSpawnSyncWithSDK()

    const provider = {
      url: 'registry.opentofu.org/ns/testprovider',
      version: '1.0.0',
    }
    updatePackage(packagePath, provider, '2.0.0', 'ns', 'testprovider')

    assert.ok(!fs.existsSync(path.join(packagePath, '.gitignore')))
  })

  it('merges only pulumi property from generated package.json', () => {
    mockSpawnSyncWithSDK({
      pulumiProperty: { name: 'testprovider', version: '2.0.0' },
    })

    const provider = {
      url: 'registry.opentofu.org/ns/testprovider',
      version: '1.0.0',
    }
    updatePackage(packagePath, provider, '2.0.0', 'ns', 'testprovider')

    const updatedPkg = JSON.parse(
      fs.readFileSync(path.join(packagePath, 'package.json'), 'utf8'),
    )
    assert.equal(updatedPkg.name, 'pulumi-testprovider')
    assert.equal(updatedPkg.pulumi.version, '2.0.0')
  })

  it('replaces dependencies with the generated package.json', () => {
    const pkgJsonPath = path.join(packagePath, 'package.json')
    const current = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
    current.dependencies = { 'async-mutex': '0.5.0' }
    fs.writeFileSync(pkgJsonPath, JSON.stringify(current))

    mockSpawnSyncWithSDK({ dependencies: { 'schema-utils': '1.2.3' } })

    updatePackage(
      packagePath,
      {
        url: 'registry.opentofu.org/ns/testprovider',
        version: '1.0.0',
      },
      '2.0.0',
      'ns',
      'testprovider',
    )

    const updatedPkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
    assert.deepEqual(updatedPkg.dependencies, { 'schema-utils': '1.2.3' })
  })

  it('removes dependencies the generator no longer emits', () => {
    const pkgJsonPath = path.join(packagePath, 'package.json')
    const current = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
    current.dependencies = { 'async-mutex': '0.5.0' }
    current.description = 'kept'
    fs.writeFileSync(pkgJsonPath, JSON.stringify(current))

    mockSpawnSyncWithSDK()

    updatePackage(
      packagePath,
      {
        url: 'registry.opentofu.org/ns/testprovider',
        version: '1.0.0',
      },
      '2.0.0',
      'ns',
      'testprovider',
    )

    const updatedPkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
    assert.equal(updatedPkg.dependencies, undefined)
    assert.equal(updatedPkg.description, 'kept')
  })

  it('throws when pulumi init fails', () => {
    setSpawnSync(
      mock.fn(() => ({
        status: 1,
        stderr: Buffer.from('init failed'),
      })),
    )

    const provider = {
      url: 'registry.opentofu.org/ns/testprovider',
      version: '1.0.0',
    }
    assert.throws(
      () => updatePackage(packagePath, provider, '2.0.0', 'ns', 'testprovider'),
      /Failed to initialize Pulumi project/,
    )
  })

  it('throws when pulumi package add fails', () => {
    let callCount = 0
    setSpawnSync(
      mock.fn(() => {
        callCount++
        if (callCount === 1) return { status: 0 }
        return { status: 1, stderr: Buffer.from('add failed') }
      }),
    )

    const provider = {
      url: 'registry.opentofu.org/ns/testprovider',
      version: '1.0.0',
    }
    assert.throws(
      () => updatePackage(packagePath, provider, '2.0.0', 'ns', 'testprovider'),
      /Failed to add provider/,
    )
  })

  it('retries on the Terraform registry when OpenTofu does not have the version', () => {
    const urls: string[] = []
    setSpawnSync(
      mock.fn((cmd: string, args: string[], options: any) => {
        const invoked = commandFrom(cmd, args)
        if (invoked.command === 'pulumi' && invoked.args[0] === 'new') {
          return { status: 0 }
        }
        if (invoked.command === 'pulumi' && invoked.args[0] === 'package') {
          const providerUrl = invoked.args[3]
          urls.push(providerUrl)
          if (providerUrl.includes('registry.opentofu.org')) {
            return {
              status: 1,
              stderr: Buffer.from(
                'Could not resolve a version from registry.opentofu.org/ns/testprovider: [{2.0.0 OpEqual}]',
              ),
            }
          }
          const pkgDir = path.join(options.cwd, 'sdks', 'nodejs')
          fs.mkdirSync(pkgDir, { recursive: true })
          fs.writeFileSync(path.join(pkgDir, 'index.ts'), '// generated')
          fs.writeFileSync(
            path.join(pkgDir, 'package.json'),
            JSON.stringify({
              name: 'pulumi-testprovider',
              pulumi: { name: 'testprovider', version: '2.0.0' },
            }),
          )
          return { status: 0 }
        }
        return { status: 0 }
      }),
    )

    updatePackage(
      packagePath,
      {
        url: 'registry.opentofu.org/ns/testprovider',
        version: '1.0.0',
      },
      '2.0.0',
      'ns',
      'testprovider',
    )

    assert.deepEqual(urls, [
      'registry.opentofu.org/ns/testprovider',
      'registry.terraform.io/ns/testprovider',
    ])
  })

  it('throws when SDKs directory is missing', () => {
    setSpawnSync(mock.fn(() => ({ status: 0 })))

    const provider = {
      url: 'registry.opentofu.org/ns/testprovider',
      version: '1.0.0',
    }
    assert.throws(
      () => updatePackage(packagePath, provider, '2.0.0', 'ns', 'testprovider'),
      /SDKs directory not found/,
    )
  })

  it('throws when SDKs directory has no subdirectories', () => {
    setSpawnSync(
      mock.fn((cmd: string, args: string[], options: any) => {
        if (
          commandFrom(cmd, args).command === 'pulumi' &&
          commandFrom(cmd, args).args[0] === 'package'
        ) {
          fs.mkdirSync(path.join(options.cwd, 'sdks'), { recursive: true })
        }
        return { status: 0 }
      }),
    )

    const provider = {
      url: 'registry.opentofu.org/ns/testprovider',
      version: '1.0.0',
    }
    assert.throws(
      () => updatePackage(packagePath, provider, '2.0.0', 'ns', 'testprovider'),
      /No package directories found/,
    )
  })

  it('uses first directory when no package name matches', () => {
    setSpawnSync(
      mock.fn((cmd: string, args: string[], options: any) => {
        if (
          commandFrom(cmd, args).command === 'pulumi' &&
          commandFrom(cmd, args).args[0] === 'package'
        ) {
          const sdksDir = path.join(options.cwd, 'sdks')
          const pkgDir = path.join(sdksDir, 'first-pkg')
          fs.mkdirSync(pkgDir, { recursive: true })
          fs.writeFileSync(path.join(pkgDir, 'index.ts'), '// fallback')
          fs.writeFileSync(
            path.join(pkgDir, 'package.json'),
            JSON.stringify({ name: 'unrelated-name' }),
          )
        }
        return { status: 0 }
      }),
    )

    const provider = {
      url: 'registry.opentofu.org/ns/testprovider',
      version: '1.0.0',
    }
    updatePackage(packagePath, provider, '2.0.0', 'ns', 'testprovider')

    assert.ok(fs.existsSync(path.join(packagePath, 'index.ts')))
  })

  it('selects matching package among multiple directories', () => {
    setSpawnSync(
      mock.fn((cmd: string, args: string[], options: any) => {
        if (
          commandFrom(cmd, args).command === 'pulumi' &&
          commandFrom(cmd, args).args[0] === 'package'
        ) {
          const sdksDir = path.join(options.cwd, 'sdks')

          const wrongDir = path.join(sdksDir, 'aaa-wrong')
          fs.mkdirSync(wrongDir, { recursive: true })
          fs.writeFileSync(path.join(wrongDir, 'index.ts'), '// wrong')
          fs.writeFileSync(
            path.join(wrongDir, 'package.json'),
            JSON.stringify({ name: 'wrong-name' }),
          )

          const rightDir = path.join(sdksDir, 'zzz-right')
          fs.mkdirSync(rightDir, { recursive: true })
          fs.writeFileSync(path.join(rightDir, 'index.ts'), '// correct')
          fs.writeFileSync(
            path.join(rightDir, 'package.json'),
            JSON.stringify({
              name: 'pulumi-testprovider',
              pulumi: { name: 'testprovider' },
            }),
          )
        }
        return { status: 0 }
      }),
    )

    const provider = {
      url: 'registry.opentofu.org/ns/testprovider',
      version: '1.0.0',
    }
    updatePackage(packagePath, provider, '2.0.0', 'ns', 'testprovider')

    assert.equal(
      fs.readFileSync(path.join(packagePath, 'index.ts'), 'utf8'),
      '// correct',
    )
  })

  it('cleans up temp directory even when an error occurs', () => {
    const tempDirs: string[] = []
    const origMkdtemp = fs.mkdtempSync
    // @ts-expect-error -- wrapping fs.mkdtempSync to track created dirs
    fs.mkdtempSync = function (...args: Parameters<typeof fs.mkdtempSync>) {
      const dir = origMkdtemp.apply(this, args) as string
      tempDirs.push(dir)
      return dir
    }
    setSpawnSync(
      mock.fn(() => ({
        status: 1,
        stderr: Buffer.from('fail'),
      })),
    )

    const provider = {
      url: 'registry.opentofu.org/ns/testprovider',
      version: '1.0.0',
    }

    try {
      updatePackage(packagePath, provider, '2.0.0', 'ns', 'testprovider')
    } catch {
      // expected
    }

    fs.mkdtempSync = origMkdtemp

    for (const dir of tempDirs) {
      assert.ok(!fs.existsSync(dir), `Temp dir ${dir} should be cleaned up`)
    }
  })
})

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

describe('main', () => {
  let tempBase: string
  let originalCwd: typeof process.cwd
  let originalFetch: typeof globalThis.fetch
  let originalSpawnSync: typeof childProcess.spawnSync
  let originalExit: typeof process.exit
  let originalGithubOutput: string | undefined

  beforeEach(() => {
    tempBase = fs.mkdtempSync(path.join(os.tmpdir(), 'main-test-'))

    fs.mkdirSync(path.join(tempBase, 'packages'), { recursive: true })
    fs.mkdirSync(path.join(tempBase, '.changeset'), { recursive: true })

    originalCwd = process.cwd
    process.cwd = () => tempBase

    originalFetch = globalThis.fetch
    originalSpawnSync = childProcess.spawnSync
    originalExit = process.exit
    originalGithubOutput = process.env.GITHUB_OUTPUT
    delete process.env.GITHUB_OUTPUT
  })

  afterEach(() => {
    process.cwd = originalCwd
    globalThis.fetch = originalFetch
    setSpawnSync(originalSpawnSync)
    process.exit = originalExit
    if (originalGithubOutput !== undefined) {
      process.env.GITHUB_OUTPUT = originalGithubOutput
    } else {
      delete process.env.GITHUB_OUTPUT
    }
    fs.rmSync(tempBase, { recursive: true, force: true })
  })

  function createPackage(
    name: string,
    { version = '1.0.0', namespace = 'ns' } = {},
  ): string {
    const pkgDir = path.join(tempBase, 'packages', name)
    fs.mkdirSync(pkgDir, { recursive: true })

    const paramValue = Buffer.from(
      JSON.stringify({
        remote: {
          url: `registry.opentofu.org/${namespace}/${name}`,
          version,
        },
      }),
    ).toString('base64')

    fs.writeFileSync(
      path.join(pkgDir, 'package.json'),
      JSON.stringify({
        name: `pulumi-${name}`,
        version: '0.1.0',
        pulumi: {
          resource: true,
          name: 'terraform-provider',
          parameterization: { name, version, value: paramValue },
        },
      }),
    )

    return pkgDir
  }

  function captureOutput(): string {
    const outputFile = path.join(tempBase, 'github-output')
    fs.writeFileSync(outputFile, '')
    process.env.GITHUB_OUTPUT = outputFile
    return outputFile
  }

  async function expectNoUpdates(): Promise<void> {
    const outputFile = captureOutput()
    await main()
    assert.ok(fs.readFileSync(outputFile, 'utf8').includes('has_updates=false'))
  }

  function mockRegistry(
    source: string | null,
    release: { tag_name: string; body: string | null } | { status: number },
  ) {
    mockFetch(async (url: string) => {
      if (String(url).includes('registry.terraform.io')) {
        return {
          ok: true,
          json: async () => (source === null ? {} : { source }),
        }
      }
      if ('status' in release) {
        return { ok: false, status: release.status }
      }
      return { ok: true, json: async () => release }
    })
  }

  function writeGeneratedPackage(
    cwd: string,
    packageName: string,
    pulumiFields: Record<string, string>,
  ) {
    const pkgDir = path.join(cwd, 'sdks', 'nodejs')
    fs.mkdirSync(pkgDir, { recursive: true })
    fs.writeFileSync(path.join(pkgDir, 'index.ts'), '// gen')
    fs.writeFileSync(
      path.join(pkgDir, 'package.json'),
      JSON.stringify({
        name: packageName,
        pulumi: pulumiFields,
      }),
    )
  }

  function mockPublish(
    packageName: string,
    pulumiFields: Record<string, string>,
    gitStatus = 0,
  ) {
    setSpawnSync(
      mock.fn((cmd: string, args: string[], options: any) => {
        const invoked = commandFrom(cmd, args)
        if (invoked.command === 'pulumi' && invoked.args[0] === 'new') {
          return { status: 0 }
        }
        if (invoked.command === 'pulumi' && invoked.args[0] === 'package') {
          writeGeneratedPackage(options.cwd, packageName, pulumiFields)
          return { status: 0 }
        }
        if (invoked.command === 'git') {
          return { status: gitStatus }
        }
        return { status: 0 }
      }),
    )
  }

  it('reports no updates when packages directory is empty', async () => {
    await expectNoUpdates()
  })

  it('skips packages without package.json', async () => {
    fs.mkdirSync(path.join(tempBase, 'packages', 'empty-pkg'), {
      recursive: true,
    })
    await expectNoUpdates()
  })

  it('skips packages without parameterization', async () => {
    const pkgDir = path.join(tempBase, 'packages', 'no-param')
    fs.mkdirSync(pkgDir, { recursive: true })
    fs.writeFileSync(
      path.join(pkgDir, 'package.json'),
      JSON.stringify({ name: 'some-package', version: '1.0.0' }),
    )
    await expectNoUpdates()
  })

  it('skips packages with invalid base64 parameterization', async () => {
    const pkgDir = path.join(tempBase, 'packages', 'bad-b64')
    fs.mkdirSync(pkgDir, { recursive: true })
    fs.writeFileSync(
      path.join(pkgDir, 'package.json'),
      JSON.stringify({
        name: 'bad-pkg',
        version: '1.0.0',
        pulumi: { parameterization: { value: 'not-valid-base64!!!' } },
      }),
    )
    await expectNoUpdates()
  })

  it('skips packages with missing remote field in parameterization', async () => {
    const pkgDir = path.join(tempBase, 'packages', 'no-remote')
    fs.mkdirSync(pkgDir, { recursive: true })
    const paramValue = Buffer.from(JSON.stringify({ local: true })).toString(
      'base64',
    )
    fs.writeFileSync(
      path.join(pkgDir, 'package.json'),
      JSON.stringify({
        name: 'no-remote-pkg',
        version: '1.0.0',
        pulumi: { parameterization: { value: paramValue } },
      }),
    )
    await expectNoUpdates()
  })

  it('regenerates when the Terraform provider is current but the bridge is newer', async () => {
    createPackage('bridged', { version: '1.0.0' })
    const pkgJsonPath = path.join(
      tempBase,
      'packages',
      'bridged',
      'package.json',
    )
    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
    pkgJson.pulumi.version = '1.1.1'
    pkgJson.dependencies = { 'async-mutex': '0.5.0' }
    fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson))

    mockFetch(async (url: string) => {
      const href = String(url)
      if (href.includes('registry.terraform.io')) {
        return {
          ok: true,
          json: async () => ({
            source: 'https://github.com/ns/terraform-provider-bridged',
          }),
        }
      }
      if (href.includes('pulumi/pulumi-terraform-provider')) {
        return {
          ok: true,
          json: async () => ({ tag_name: 'v1.4.0', body: 'bridge' }),
        }
      }
      return {
        ok: true,
        json: async () => ({ tag_name: 'v1.0.0', body: null }),
      }
    })
    mockPublish('pulumi-bridged', { name: 'bridged', version: '1.4.0' })
    captureOutput()
    await main()

    const changesetDir = path.join(tempBase, '.changeset')
    const changesetFiles = fs
      .readdirSync(changesetDir)
      .filter((file) => file.endsWith('.md') && file.includes('bridged'))
    assert.equal(changesetFiles.length, 1)
    const content = fs.readFileSync(
      path.join(changesetDir, changesetFiles[0]),
      'utf8',
    )
    assert.ok(content.includes("'pulumi-bridged': patch"))
    assert.ok(content.includes('from 1.1.1 to 1.4.0'))
  })

  it('skips a provider release that neither registry has published', async () => {
    createPackage('unpublished', { version: '1.0.0' })
    mockFetch(async (url: string) => {
      const href = String(url)
      if (href.includes('registry.terraform.io')) {
        return {
          ok: true,
          json: async () => ({
            source: 'https://github.com/ns/terraform-provider-unpublished',
          }),
        }
      }
      if (href.includes('pulumi/pulumi-terraform-provider')) {
        return {
          ok: true,
          json: async () => ({ tag_name: 'v1.4.0', body: null }),
        }
      }
      return {
        ok: true,
        json: async () => ({ tag_name: 'v9.9.9', body: 'not on a registry' }),
      }
    })
    setSpawnSync(
      mock.fn((cmd: string, args: string[]) => {
        const invoked = commandFrom(cmd, args)
        if (invoked.command === 'pulumi' && invoked.args[0] === 'package') {
          return {
            status: 1,
            stderr: Buffer.from(
              'Could not resolve a version from registry.opentofu.org/ns/unpublished: [{9.9.9 OpEqual}]',
            ),
          }
        }
        return { status: 0 }
      }),
    )

    await expectNoUpdates()
  })

  it('skips when version is already up to date', async () => {
    createPackage('myprovider', { version: '1.0.0' })
    mockRegistry('https://github.com/ns/terraform-provider-myprovider', {
      tag_name: 'v1.0.0',
      body: null,
    })
    await expectNoUpdates()
  })

  it('skips when registry returns no GitHub repo', async () => {
    createPackage('noreg', { version: '1.0.0' })
    mockRegistry(null, { tag_name: 'v1.0.0', body: null })
    await expectNoUpdates()
  })

  it('skips when GitHub returns no release', async () => {
    createPackage('norel', { version: '1.0.0' })
    mockRegistry('https://github.com/ns/terraform-provider-norel', {
      status: 404,
    })
    await expectNoUpdates()
  })

  it('creates changeset and sets has_updates=true when update found', async () => {
    createPackage('updatable', { version: '1.0.0' })
    mockRegistry('https://github.com/ns/terraform-provider-updatable', {
      tag_name: 'v2.0.0',
      body: 'Fixed #42 and #99',
    })
    mockPublish('pulumi-updatable', { name: 'updatable', version: '2.0.0' })

    const outputFile = captureOutput()
    await main()
    assert.ok(fs.readFileSync(outputFile, 'utf8').includes('has_updates=true'))

    const changesetDir = path.join(tempBase, '.changeset')
    const changesetFiles = fs
      .readdirSync(changesetDir)
      .filter((f) => f.endsWith('.md'))
    assert.ok(changesetFiles.length > 0, 'Should have created a changeset file')
    const changesetContent = fs.readFileSync(
      path.join(changesetDir, changesetFiles[0]),
      'utf8',
    )
    assert.ok(changesetContent.includes("'pulumi-updatable': major"))
    assert.ok(
      changesetContent.includes('ns/terraform-provider-updatable#42'),
      'Changelog issue refs should be rewritten',
    )
  })

  it('uses default message when changelog is null', async () => {
    createPackage('nolog', { version: '1.0.0' })
    mockRegistry('https://github.com/ns/terraform-provider-nolog', {
      tag_name: 'v1.0.1',
      body: null,
    })
    mockPublish('pulumi-nolog', { name: 'nolog' })
    captureOutput()
    await main()

    const changesetDir = path.join(tempBase, '.changeset')
    const changesetFiles = fs
      .readdirSync(changesetDir)
      .filter((f) => f.endsWith('.md'))
    const content = fs.readFileSync(
      path.join(changesetDir, changesetFiles[0]),
      'utf8',
    )
    assert.ok(content.includes('Update pulumi-nolog from 1.0.0 to 1.0.1'))
    assert.ok(
      content.includes('**Full Changelog**:'),
      'Should include Full Changelog link',
    )
    assert.ok(
      content.includes('/compare/v1.0.0...v1.0.1'),
      'Compare link should use correct tag format',
    )
  })

  it('does not throw when GITHUB_OUTPUT is not set', async () => {
    delete process.env.GITHUB_OUTPUT
    await assert.doesNotReject(() => main())
  })

  it('calls process.exit(1) when git add fails', async () => {
    createPackage('gitfail', { version: '1.0.0' })
    mockRegistry('https://github.com/ns/terraform-provider-gitfail', {
      tag_name: 'v2.0.0',
      body: null,
    })
    mockPublish('pulumi-gitfail', { name: 'gitfail' }, 1)

    let exitCode: number | null = null
    process.exit = mock.fn((code: number) => {
      exitCode = code
      throw new Error('process.exit called')
    })

    await assert.rejects(() => main(), /process\.exit called/)
    assert.equal(exitCode, 1)
  })
})
