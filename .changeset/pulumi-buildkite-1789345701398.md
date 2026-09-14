---
'pulumi-buildkite': patch
---

#### Added

- Added the `provider_settings.build_issues` pipeline setting by @lox in https://github.com/buildkite/terraform-provider-buildkite/pull/1236
- Added slug-based imports for pipelines, teams, pipeline schedules, pipeline teams, and cluster queues by @dattallant in https://github.com/buildkite/terraform-provider-buildkite/pull/1235
- Added the `provider_settings.build_pull_request_edited` pipeline setting by @jasonwbarnett in https://github.com/buildkite/terraform-provider-buildkite/pull/1222 (original author @gempesaw in buildkite/terraform-provider-buildkite#1181)

#### Updated

- Updated GoReleaser to v2.18.0 by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1237
- Updated Terraform Buildkite to v1.39.0 by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1238
- Updated the Buildkite test collector plugin to v1.12.0 by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1240
- Updated Terraform Buildkite to v1.39.1 by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1241
- Updated the `golang:1.27.0` Docker digest to `0ecdc2a` by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1242
- Updated the HashiCorp Terraform Docker image to v1.16 by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1243
- Updated the OSSF Scorecard plugin by @petetomasik in https://github.com/buildkite/terraform-provider-buildkite/pull/1246
- Updated `google.golang.org/grpc` to v1.83.1 to address a security issue by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1248
- Updated the `golang:1.27.0` Docker digest to `4013ae0` by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1251
- Updated `github.com/vektah/gqlparser/v2` to v2.5.37 by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1257
- Updated the Go toolchain to v1.27.1 by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1260
- Updated the `hashicorp/terraform:1.16` Docker digest to `f4d9594` by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1261
- Updated GoReleaser to v2.18.1 by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1265
- Updated `google.golang.org/grpc` to v1.83.2 to address a security issue by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1267

#### Fixed

- Fixed the team and pipeline team import examples, added a registry import example, and clarified imported pipeline fields by @dattallant in https://github.com/buildkite/terraform-provider-buildkite/pull/1231
- Stopped recording fallback values when the API fails to return them by @petetomasik in https://github.com/buildkite/terraform-provider-buildkite/pull/1255
- Preserved applied cluster queue changes when a later operation fails by @petetomasik in https://github.com/buildkite/terraform-provider-buildkite/pull/1252

#### New Contributors

- @jasonwbarnett made their first contribution in https://github.com/buildkite/terraform-provider-buildkite/pull/1222

**Full Changelog**: https://github.com/buildkite/terraform-provider-buildkite/compare/v1.39.1...v1.39.2
