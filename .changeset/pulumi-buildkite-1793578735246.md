---
'pulumi-buildkite': minor
---

#### Added

- Add `test_state_management` and `allowed_test_states` to `buildkite_test_suite`. Disabling state management permanently resets muted/skipped tests to enabled. By @meghan-kradolfer in https://github.com/buildkite/terraform-provider-buildkite/pull/1322
- Add `buildkite_pipeline_webhook_trigger` for incoming pipeline webhooks (public preview). By @mtibben in https://github.com/buildkite/terraform-provider-buildkite/pull/1314

#### Fixed

- Add write-only webhook notification URLs to keep credentials out of plans and state. Requires Terraform 1.11.1+. By @mtibben in https://github.com/buildkite/terraform-provider-buildkite/pull/1313

#### Dependencies

- Update Go dependencies by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1319
- Update Buildkite plugins and the acceptance-test provider version by @renovate[bot] in https://github.com/buildkite/terraform-provider-buildkite/pull/1318

#### New Contributors

- @mtibben made their first contribution in https://github.com/buildkite/terraform-provider-buildkite/pull/1313

**Full Changelog**: https://github.com/buildkite/terraform-provider-buildkite/compare/v1.44.0...v1.45.0

Update the Pulumi Terraform bridge from 1.5.0 to 1.5.1.
