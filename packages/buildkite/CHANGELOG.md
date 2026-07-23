# pulumi-buildkite

## 1.35.0

### Minor Changes

- Add missing changelog entries by @scadu in https://github.com/buildkite/terraform-provider-buildkite/pull/1164
- chore(deps): update terraform buildkite to v1.34.2 by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1165
- chore(deps): update golang docker tag to v1.26.4 by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1160
- chore(deps): update terraform monorepo by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1150
- chore(deps): update goreleaser/goreleaser docker tag to v2.16.0 by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1154
- fix(deps): update module github.com/vektah/gqlparser/v2 to v2.5.34 by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1147
- chore(deps): update golang:1.26.4 docker digest to 792443b by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1166
- chore(deps): update renovate config by @mcncl in https://github.com/buildkite/terraform-provider-buildkite/pull/1167
- fix(renovate): fixes the renovate config by @mcncl in https://github.com/buildkite/terraform-provider-buildkite/pull/1169
- SUP-2308: Read pipeline provider_settings via GraphQL by @tomowatt in https://github.com/buildkite/terraform-provider-buildkite/pull/1156
- fix(deps): update module github.com/vektah/gqlparser/v2 to v2.5.35 by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1170
- fix: retry transient backend errors and stabilize parallel acceptance tests by @petetomasik in https://github.com/buildkite/terraform-provider-buildkite/pull/1173
- fix(deps): update go-minor-patch by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1174
- chore(deps): update hashicorp/terraform:1.15 docker digest to 40e61a8 by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1172
- SUP-7447: Fix buildkite_organization data source silently returning empty on unresolved org slug by @Megh03 in https://github.com/buildkite/terraform-provider-buildkite/pull/1175

#### New Contributors

- @Megh03 made their first contribution in https://github.com/buildkite/terraform-provider-buildkite/pull/1175

**Full Changelog**: https://github.com/buildkite/terraform-provider-buildkite/compare/v1.34.2...v1.35.0

## 1.34.1

### Patch Changes

- chore(deps): update terraform buildkite to v1.34.1 by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1161
- fix(config): misleading error when cluster name changed by @mcncl in https://github.com/buildkite/terraform-provider-buildkite/pull/1163

**Full Changelog**: https://github.com/buildkite/terraform-provider-buildkite/compare/v1.34.1...v1.34.2

## 1.34.0

### Minor Changes

#### Fixes

- fix: archive pipeline after REST updates in Create and Update by @inez in https://github.com/buildkite/terraform-provider-buildkite/pull/1162

#### New Contributors

- @inez made their first contribution in https://github.com/buildkite/terraform-provider-buildkite/pull/1162

**Full Changelog**: https://github.com/buildkite/terraform-provider-buildkite/compare/v1.34.0...v1.34.1

## 1.33.0

### Minor Changes

- Reduce build targets from 15 to 6 by @mcncl in https://github.com/buildkite/terraform-provider-buildkite/pull/1111
- Fix unknown attributes with provider_settings by @petetomasik in https://github.com/buildkite/terraform-provider-buildkite/pull/1117
- Add reserved prefix validation to cluster secret key by @stephanieatte in https://github.com/buildkite/terraform-provider-buildkite/pull/1133
- Add support for build triggering on issue comments. by @omehegan in https://github.com/buildkite/terraform-provider-buildkite/pull/1139

**Full Changelog**: https://github.com/buildkite/terraform-provider-buildkite/compare/v1.32.0...v1.33.0

## 1.32.1

### Patch Changes

Add README and documentation for the Buildkite provider

## 1.32.0

### Minor Changes

#### Added

- feat: add archived attribute to pipeline resource by @peerkleio in https://github.com/buildkite/terraform-provider-buildkite/pull/1108
- SUP-6661: add build_pull_request_merge_commits Repository Provider Setting by @tomowatt in https://github.com/buildkite/terraform-provider-buildkite/pull/1103

#### Dependencies

- chore(deps): update goreleaser/goreleaser docker tag to v2.15.1 by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1107
- chore(deps): update terraform buildkite to v1.31.4 by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1105
- chore(deps): update hashicorp/terraform:1.14 docker digest to 42ecfb2 by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1106
- chore(deps): update goreleaser/goreleaser docker tag to v2.15.2 by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1109

#### New Contributors

- @peerkleio made their first contribution in https://github.com/buildkite/terraform-provider-buildkite/pull/1108

**Full Changelog**: https://github.com/buildkite/terraform-provider-buildkite/compare/v1.31.4...v1.32.0
