#!/usr/bin/env bash
set -euo pipefail

: "${GITHUB_RUN_ID:?Run this test through the Publish workflow}"
: "${GITHUB_RUN_ATTEMPT:?Run this test through the Publish workflow}"
: "${ACTIONS_ID_TOKEN_REQUEST_URL:?GitHub OIDC is unavailable}"
: "${ACTIONS_ID_TOKEN_REQUEST_TOKEN:?GitHub OIDC is unavailable}"
unset NPM_TOKEN NODE_AUTH_TOKEN

export PNPM_TEST_VERSION
PNPM_TEST_VERSION="$(pnpm --version)"
export PNPM_TEST_LATEST
PNPM_TEST_LATEST="$(node --input-type=module -e '
  const response = await fetch("https://registry.npmjs.org/pulumi-time/latest")
  if (!response.ok) throw new Error(`Registry returned ${response.status}`)
  console.log((await response.json()).version)
')"

# Keep the package identity and repository metadata that npm trusts. Only the
# prerelease version changes, in this disposable Actions checkout.
node --input-type=module <<'NODE'
import { readFileSync, writeFileSync } from 'node:fs'
const path = 'packages/time/package.json'
const manifest = JSON.parse(readFileSync(path, 'utf8'))
if (manifest.name !== 'pulumi-time') throw new Error('Unexpected test package')
const prefix = `${manifest.version}-pnpm.${process.env.PNPM_TEST_VERSION}.`
const existingVersion = process.env.PNPM_TEST_VERIFY_VERSION
if (existingVersion) {
  if (!existingVersion.startsWith(prefix) || !/^\d+\.\d+$/.test(existingVersion.slice(prefix.length))) {
    throw new Error('Expected a test prerelease for this package and pnpm version')
  }
  manifest.version = existingVersion
} else {
  manifest.version = `${prefix}${process.env.GITHUB_RUN_ID}.${process.env.GITHUB_RUN_ATTEMPT}`
}
writeFileSync(path, JSON.stringify(manifest, null, 2) + '\n')
console.log(`Testing pnpm ${process.env.PNPM_TEST_VERSION} with ${manifest.name}@${manifest.version}`)
NODE

if [ -z "${PNPM_TEST_VERIFY_VERSION:-}" ]; then
  (
    cd packages/time
    node scripts/postinstall.js
    pnpm publish --access public --tag pnpm-oidc-test --provenance --no-git-checks --ignore-scripts
  )
fi

# Verify registry evidence, not just the publisher's exit status. npm metadata
# may take a short time to become visible after a successful publish.
node --input-type=module <<'NODE'
import { appendFileSync, readFileSync } from 'node:fs'
import { setTimeout } from 'node:timers/promises'
const { name, version } = JSON.parse(readFileSync('packages/time/package.json', 'utf8'))
const url = `https://registry.npmjs.org/${name}/${version}`
let metadata
for (let attempt = 0; attempt < 24; attempt++) {
  const response = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } })
  if (response.ok) {
    metadata = await response.json()
    if (metadata._npmUser?.trustedPublisher?.id === 'github' && metadata.dist?.attestations?.provenance) break
  } else if (response.status !== 404) {
    throw new Error(`Registry verification returned ${response.status}`)
  }
  await setTimeout(5000)
}
if (metadata?._npmUser?.trustedPublisher?.id !== 'github') throw new Error('GitHub trusted-publisher identity is missing')
if (!metadata.dist?.attestations?.provenance) throw new Error('Provenance attestation is missing')
const response = await fetch(`https://registry.npmjs.org/${name}/latest`, { headers: { 'Cache-Control': 'no-cache' } })
if (!response.ok) throw new Error(`Latest-tag verification returned ${response.status}`)
const latest = (await response.json()).version
if (latest !== process.env.PNPM_TEST_LATEST) throw new Error(`The latest tag changed from ${process.env.PNPM_TEST_LATEST} to ${latest}`)
const summary = `Verified ${name}@${version} from the pnpm ${process.env.PNPM_TEST_VERSION} publishing test. GitHub OIDC identity and provenance are present; latest remains ${latest}.\n`
console.log(summary)
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary)
NODE
