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

# Safe Chain's npm shim is first on PATH and resolves to the runner image's
# npm 10, which publishes a trusted-publisher token with no Sigstore bundle.
# pnpm's node shim also has no npm beside it. Follow process.execPath to the
# real toolchain binary; the workflow upgrades that npm to 12.
node_exec="$(node -p 'process.execPath')"
node_bindir="$(dirname "$node_exec")"
npm_bin="${node_bindir}/npm"
if [[ ! -x "$npm_bin" ]]; then
  echo "node toolchain npm is missing at ${npm_bin}"
  exit 1
fi

echo "building packages"
pnpm exec nx run-many -t build

echo "publishing packages"
# A stored NPM_TOKEN skips GitHub OIDC. This repository's token is rejected.
unset NPM_TOKEN NODE_AUTH_TOKEN

echo "npm $("$npm_bin" --version) (${npm_bin})"
npm_major="$("$npm_bin" --version | cut -d. -f1)"
if [ "$npm_major" -lt 11 ]; then
  echo "npm ${npm_major} cannot attach a provenance attestation from GitHub Actions"
  exit 1
fi
if [ -z "${ACTIONS_ID_TOKEN_REQUEST_URL:-}" ] || [ -z "${ACTIONS_ID_TOKEN_REQUEST_TOKEN:-}" ]; then
  echo "github oidc credentials are missing"
  exit 1
fi
echo "github oidc credentials are present"

# Exchange the GitHub OIDC token for a short-lived npm token. npm's own
# exchange fails quietly and then reports ENEEDAUTH, so do it here and
# print only the registry's error text. The registry token does not sign
# provenance; --provenance does that with the Actions OIDC token.
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
  published="$("$npm_bin" view "${name}@${version}" version 2>/dev/null || true)"
  if [ "$published" = "$version" ]; then
    echo "skip ${name}@${version}"
    continue
  fi
  echo "publish ${name}@${version}"
  token="$(exchange_token "$name")"
  echo "::add-mask::${token}"
  log="$(mktemp)"
  set +e
  (
    cd "$dir"
    "$npm_bin" publish --ignore-scripts --access public --provenance --"//registry.npmjs.org/:_authToken=${token}"
  ) >"$log" 2>&1
  status=$?
  set -e
  cat "$log"
  if [ "$status" -ne 0 ]; then
    rm -f "$log"
    exit "$status"
  fi
  if ! grep -Eq "Signed provenance statement|Provenance transparency log|Provenance statement published" "$log"; then
    rm -f "$log"
    echo "npm published ${name}@${version} without a provenance statement"
    exit 1
  fi
  rm -f "$log"
  record_published_package "$name" "$version"
done
