---
'pulumi-buildkite': minor
---

#### Added

- Added the `buildkite_organization_membership` resource for managing users' organization membership, invitations, role and SSO mode by @dahtey-bk in https://github.com/buildkite/terraform-provider-buildkite/pull/1278
- `buildkite_team_member` can now be imported with `<team slug>/<email>` by @dattallant in https://github.com/buildkite/terraform-provider-buildkite/pull/1273

#### Fixed

- Timed-out GraphQL requests now report the last API response they were retrying, not just `context deadline exceeded` by @petetomasik in https://github.com/buildkite/terraform-provider-buildkite/pull/1284

#### Internal

- Added tests for request timeouts across resource and data source paths by @petetomasik in https://github.com/buildkite/terraform-provider-buildkite/pull/1292

#### Dependencies

- Updated Go dependencies, including `go-pipeline` v0.18.1 by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1287
- Updated the docker-compose Buildkite plugin to v5.15.0 by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1291

**Full Changelog**: https://github.com/buildkite/terraform-provider-buildkite/compare/v1.41.0...v1.42.0
