#!/usr/bin/env bash
set -euo pipefail

echo "building packages"
pnpm exec nx run-many -t build

echo "publishing packages"
# Trusted publishing exchanges the GitHub OIDC token. NPM_TOKEN skips that
# exchange, and this repository's token is rejected with a registry 404.
unset NPM_TOKEN NODE_AUTH_TOKEN

for dir in packages/*; do
  name="$(node -p "require('./${dir}/package.json').name")"
  version="$(node -p "require('./${dir}/package.json').version")"
  published="$(npm view "${name}@${version}" version 2>/dev/null || true)"
  if [ "$published" = "$version" ]; then
    echo "skip ${name}@${version}"
    continue
  fi
  echo "publish ${name}@${version}"
  (cd "$dir" && npm publish --ignore-scripts --access public)
done
