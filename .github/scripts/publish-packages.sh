#!/usr/bin/env bash
set -euo pipefail

echo "building packages"
pnpm exec nx run-many -t build

echo "publishing packages"
npm config set registry https://registry.npmjs.org/
npm config set "//registry.npmjs.org/:_authToken" "$NPM_TOKEN"

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
