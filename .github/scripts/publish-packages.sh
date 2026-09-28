#!/usr/bin/env bash
set -euo pipefail

# changesets/action reads this NDJSON file after the script exits and creates
# GitHub releases and git tags from each {"type":"git-tag"} event. The file
# has to exist even when every package is already on npm, or the action warns
# and skips releases.
if [ -n "${CHANGESETS_OUTPUT:-}" ]; then
  mkdir -p "$(dirname "$CHANGESETS_OUTPUT")"
  : > "$CHANGESETS_OUTPUT"
fi

echo "building packages"
pnpm exec nx run-many -t build

echo "publishing packages"
# A stored NPM_TOKEN skips GitHub OIDC. This repository's token is rejected.
unset NPM_TOKEN NODE_AUTH_TOKEN

echo "npm $(npm --version)"
if [ -z "${ACTIONS_ID_TOKEN_REQUEST_URL:-}" ] || [ -z "${ACTIONS_ID_TOKEN_REQUEST_TOKEN:-}" ]; then
  echo "github oidc credentials are missing"
  exit 1
fi
echo "github oidc credentials are present"

# Exchange the GitHub OIDC token for a short-lived npm token. npm's own
# exchange fails quietly and then reports ENEEDAUTH, so do it here and
# print only the registry's error text.
exchange_token() {
  local package_name="$1"
  node --input-type=module -e '
    const packageName = process.argv[1]
    const requestUrl = new URL(process.env.ACTIONS_ID_TOKEN_REQUEST_URL)
    requestUrl.searchParams.append("audience", "npm:registry.npmjs.org")
    const idResponse = await fetch(requestUrl, {
      headers: {
        Accept: "application/json",
        Authorization: `bearer ${process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN}`,
      },
    })
    const idBody = await idResponse.json()
    if (!idResponse.ok || !idBody.value) {
      console.error(`github oidc token request failed with HTTP ${idResponse.status}`)
      process.exit(1)
    }
    const exchangeUrl = `https://registry.npmjs.org/-/npm/v1/oidc/token/exchange/package/${encodeURIComponent(packageName)}`
    const exchangeResponse = await fetch(exchangeUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${idBody.value}`,
      },
    })
    const exchangeText = await exchangeResponse.text()
    let exchangeBody = {}
    try {
      exchangeBody = JSON.parse(exchangeText)
    } catch {
      exchangeBody = { message: exchangeText.slice(0, 500) }
    }
    if (!exchangeResponse.ok || !exchangeBody.token) {
      const message = exchangeBody.message || exchangeBody.error || exchangeText.slice(0, 500)
      console.error(`oidc exchange for ${packageName} failed with HTTP ${exchangeResponse.status}: ${message}`)
      process.exit(1)
    }
    process.stdout.write(exchangeBody.token)
  ' "$package_name"
}

# Tag format matches @changesets/cli for a pnpm workspace: <name>@<version>.
record_published_package() {
  local package_name="$1"
  local version="$2"
  if [ -z "${CHANGESETS_OUTPUT:-}" ]; then
    return 0
  fi
  node --input-type=module -e '
    import { appendFileSync } from "node:fs"
    const [packageName, version, outputPath] = process.argv.slice(1)
    appendFileSync(
      outputPath,
      JSON.stringify({
        type: "git-tag",
        tag: `${packageName}@${version}`,
        packageName,
      }) + "\n",
    )
  ' "$package_name" "$version" "$CHANGESETS_OUTPUT"
}

for dir in packages/*; do
  name="$(node -p "require('./${dir}/package.json').name")"
  version="$(node -p "require('./${dir}/package.json').version")"
  published="$(npm view "${name}@${version}" version 2>/dev/null || true)"
  if [ "$published" = "$version" ]; then
    echo "skip ${name}@${version}"
    continue
  fi
  echo "publish ${name}@${version}"
  token="$(exchange_token "$name")"
  echo "::add-mask::${token}"
  (
    cd "$dir"
    npm publish --ignore-scripts --access public --"//registry.npmjs.org/:_authToken=${token}"
  )
  record_published_package "$name" "$version"
done
