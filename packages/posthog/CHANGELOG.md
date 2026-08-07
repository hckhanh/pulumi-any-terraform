# pulumi-posthog

## 1.0.8

### Patch Changes

#### New Features

- PostHog/terraform-provider-posthog@a771afa: feat: add posthog_project_settings resource (PostHog/terraform-provider-posthog#94) (PostHog/terraform-provider-posthog#101) (@vdekrijger)
- PostHog/terraform-provider-posthog@0ef1bb0: feat: resolve organization_id from slug or @current (PostHog/terraform-provider-posthog#99) (PostHog/terraform-provider-posthog#100) (@vdekrijger)

#### Bug Fixes

- PostHog/terraform-provider-posthog@7cf4be8: fix(hog_function): keep trailing whitespace in hog to avoid inconsistent-apply (PostHog/terraform-provider-posthog#91) (PostHog/terraform-provider-posthog#103) (@vdekrijger)

#### Other Changes

- PostHog/terraform-provider-posthog@90d2d48: test(hog_function): add required series_index to alert webhook config (PostHog/terraform-provider-posthog#102) (@vdekrijger)

#### New Features

- PostHog/terraform-provider-posthog@4ed8a53: feat(feature_flag): add ignore_filter_fields to control filter drift tracking (PostHog/terraform-provider-posthog#115) (@vdekrijger)

## 1.0.7

### Patch Changes

#### New Features

- PostHog/terraform-provider-posthog@ef08a5e: feat(alert): require condition_type and series_index at provider level (@vdekrijger)
- PostHog/terraform-provider-posthog@d9aefa0: feat: add organization-scoped proxy record resource (@JulienJBO)
- PostHog/terraform-provider-posthog@57e8c5a: feat: add posthog_external_data_source resource (@cramt)
- PostHog/terraform-provider-posthog@0801106: feat: add project-scoped survey resource (@JulienJBO)
- PostHog/terraform-provider-posthog@2fb3896: feat: expose dashboard layout show_description (@JulienJBO)

#### Bug Fixes

- PostHog/terraform-provider-posthog@561efc9: fix(external_data_source): correct API request shapes and immutability (@vdekrijger)
- PostHog/terraform-provider-posthog@d1bda51: fix(proxy_record): symmetric domain normalisation, util test helpers (@vdekrijger)
- PostHog/terraform-provider-posthog@454b26a: fix(survey): centralise helpers, allow nullable clears, expose iteration state (@vdekrijger)
- PostHog/terraform-provider-posthog@2ef6778: fix(survey): make linked\_\*\_id and targeting_flag_id clearable; trim acc test (@vdekrijger)
- PostHog/terraform-provider-posthog@a648ee9: fix(survey): use PATCH for updates to dodge upstream dotted-source assertion (@vdekrijger)
- PostHog/terraform-provider-posthog@cf4195b: fix: normalize feature flag filters state (@JulienJBO)
- PostHog/terraform-provider-posthog@3033af5: fix: normalize imported insight queries (@JulienJBO)

#### Other Changes

- PostHog/terraform-provider-posthog@c0cdd71: Apply suggestion from @vdekrijger (@vdekrijger)
- PostHog/terraform-provider-posthog@5961866: Update internal/resource/feature_flag.go (@vdekrijger)
- PostHog/terraform-provider-posthog@6e61adf: Update internal/resource/feature_flag.go (@vdekrijger)
- PostHog/terraform-provider-posthog@c7122e8: chore(deps): bump github.com/hashicorp/copywrite in /tools (@dependabot[bot])
- PostHog/terraform-provider-posthog@d02b424: chore(deps): bump github.com/hashicorp/terraform-plugin-docs in /tools (@dependabot[bot])
- PostHog/terraform-provider-posthog@b1c99bf: chore(deps): bump github.com/hashicorp/terraform-plugin-testing (@dependabot[bot])
- PostHog/terraform-provider-posthog@4f4c354: chore(deps): bump the github-actions group across 1 directory with 3 updates (@dependabot[bot])
- PostHog/terraform-provider-posthog@79f4a65: chore(deps): bump the github-actions group with 2 updates (@dependabot[bot])
- PostHog/terraform-provider-posthog@fc4697d: chore(proxy_record): use errors.New for static dns harness error (@vdekrijger)
- PostHog/terraform-provider-posthog@ca87187: chore(survey): tidy follow-up per review (@vdekrijger)
- PostHog/terraform-provider-posthog@e9392eb: docs(proxy_record): replace docs/notes with code-adjacent comments (@vdekrijger)
- PostHog/terraform-provider-posthog@2a28456: refactor(external_data_source): apply review feedback (@vdekrijger)
- PostHog/terraform-provider-posthog@3fe81d6: refactor: extract shared JSON-strip helper to internal/util (@vdekrijger)
- PostHog/terraform-provider-posthog@2631510: revert(survey): drop the three iteration-tracking computed fields (@vdekrijger)
- PostHog/terraform-provider-posthog@0fa0535: test(alert): align acceptance helpers with current PostHog spec (@vdekrijger)
- PostHog/terraform-provider-posthog@77b685a: test(external_data_source): cover API contract and CRUD shapes (@vdekrijger)
- PostHog/terraform-provider-posthog@957119a: test(external_data_source): exercise PATCH path with API-side verification (@vdekrijger)
- PostHog/terraform-provider-posthog@bde2b38: test(external_data_source): fix prefix gen, add prefix-replace acctest (@vdekrijger)
- PostHog/terraform-provider-posthog@7a9c22a: test(survey): cover unset flow in acceptance tests (@vdekrijger)

#### New Contributors

- @JulienJBO made their first contribution in https://github.com/PostHog/terraform-provider-posthog/pull/68
- @cramt made their first contribution in https://github.com/PostHog/terraform-provider-posthog/pull/76

**Full Changelog**: https://github.com/PostHog/terraform-provider-posthog/compare/v1.0.10...v1.0.11

## 1.0.6

### Patch Changes

## Changelog

### New Features

- PostHog/terraform-provider-posthog@b8c865d5d2652433840c8fd4e3900c6881a93d27: feat: add sensitive_inputs_json for secret inputs (PostHog/terraform-provider-posthog#55) (@AlexaDeWit)

### Bug Fixes

- PostHog/terraform-provider-posthog@7981ae7fea929c5a459b2b0f3137c06792922ba2: fix: preserve import behavior when both input fields are null (@vdekrijger)
- PostHog/terraform-provider-posthog@521b16fd4c2928e65fa51132fa01ab86c4a8fa71: fix: prevent sensitive inputs leaking into inputs_json state (@vdekrijger)

### Other Changes

- PostHog/terraform-provider-posthog@b80afaebcf8bfea3aab871ed1609a65b81f46a3e: chore(deps): bump securego/gosec in the github-actions group (@dependabot[bot])

## Changelog

### New Features

- PostHog/terraform-provider-posthog@3621a32eff6b7e76dfb62b0c93ad0880abc8c7c5: feat: add inputs_schema_json to posthog_hog_function resource (@iliyanyotov)

### Bug Fixes

- PostHog/terraform-provider-posthog@12ff2a2ad1a323f5d0841229c9e71b3b3de6c29d: fix: preserve sensitive_inputs_json state across API round-trips (@AlexaDeWit)

### Other Changes

- PostHog/terraform-provider-posthog@85a3962fe12adb0d2214f26a45fb8128cb5b71e4: chore(deps): bump github.com/hashicorp/copywrite in /tools (@dependabot[bot])
- PostHog/terraform-provider-posthog@d51df0dabbe2aae3e5f9616b3eb2f99467495c90: chore(deps): bump the github-actions group with 2 updates (@dependabot[bot])

## 1.0.5

### Patch Changes

- cdab503: ## Changelog

  ### Bug Fixes
  - PostHog/terraform-provider-posthog@ed8d8975a423034d81647c62e37e8fcc9e77d9ff: fix(insight): handle null name in insight update to avoid inconsistent result error (@vdekrijger)

  ### Other Changes
  - PostHog/terraform-provider-posthog@fbff930002f951dd0ad4f3e6f626091910adfe59: chore(deps): bump github.com/hashicorp/copywrite in /tools (@dependabot[bot])
  - PostHog/terraform-provider-posthog@201cc6b9680901c4cc8f5331dd07ef90929e1399: chore(deps): bump github.com/hashicorp/terraform-plugin-framework (@dependabot[bot])
  - PostHog/terraform-provider-posthog@e9072e539ec12db0e2cddb2d2c41cf9af8eab579: chore(deps): bump github.com/hashicorp/terraform-plugin-go (@dependabot[bot])
  - PostHog/terraform-provider-posthog@891ffc838a17fb1e2ab55d123b5c11c2824f2682: chore(deps): bump the github-actions group with 3 updates (@dependabot[bot])

- b0cf75b: ## Changelog

  ### New Features
  - PostHog/terraform-provider-posthog@e1454d01fa86df4cbb9d1aba33cf9a29cb53cfab: feat: Add role data source (@vdekrijger)

  ### Bug Fixes
  - PostHog/terraform-provider-posthog@7ab239ad35e97111ae25b03c6c27959f2d39c92f: fix: Add example (@vdekrijger)

  ### Other Changes
  - PostHog/terraform-provider-posthog@fc502cf0a6ae447e545b62c55d53b597e1bca8e4: chore(deps): bump the github-actions group with 2 updates (@dependabot[bot])
  - PostHog/terraform-provider-posthog@7669683becdd0c2d16ecd7141395e23f4c6f99d3: chore(deps): bump the terraform-plugin group with 3 updates (@dependabot[bot])

## 1.0.4

### Patch Changes

- f8a576f: ## Changelog

  ### New Features
  - PostHog/terraform-provider-posthog@93b81d344ccca4b9a0b0ff4475826bf2c052477e: feat: add support for actions (@adrianlyjak)

  ### Other Changes
  - PostHog/terraform-provider-posthog@bb31eba7b8ace3d34451b49f7332e37cae3ecea2: chore(deps): bump github.com/hashicorp/copywrite in /tools (@dependabot[bot])
  - PostHog/terraform-provider-posthog@103f157ad9463537f2d7fb8c684ad4e93080722b: chore(deps): bump securego/gosec in the github-actions group (@dependabot[bot])

- 365e6c3: ## Changelog

  ### Other Changes
  - PostHog/terraform-provider-posthog@eb8ea7cdcb8446767284e26386585c055eb52ebe: chore(deps): bump the github-actions group with 2 updates (@dependabot[bot])

## 1.0.3

### Patch Changes

- 2e53a01: ## Changelog

  ### New Features
  - PostHog/terraform-provider-posthog@81772f3d64212bf3d0be996dc0fe6abfee18a54a: feat(rbac): Initial setup for new rbac oriented resources (roles / user_role_membership and organization memberships) (@vdekrijger)

  ### Bug Fixes
  - PostHog/terraform-provider-posthog@98e2791c0b780e1126ee1b8d37c836d40bae3af1: fix: Centralize ptr functions (@vdekrijger)

  ### Other Changes
  - PostHog/terraform-provider-posthog@505cc89b57053d505c739e187865461733f4ea36: chore(deps): bump github.com/hashicorp/copywrite in /tools (@dependabot[bot])
  - PostHog/terraform-provider-posthog@306c6396057a34c7cee8dfb5551c5103d2bd5a01: chore(deps): bump github.com/hashicorp/copywrite in /tools (@dependabot[bot])

## 1.0.2

### Patch Changes

- 775bdd1: ## Changelog

  ### Other Changes
  - PostHog/terraform-provider-posthog@67c5e7e8d0efc332b39ffd1eae34ea976e707304: Merge remote-tracking branch 'origin/vdekrijger-make-project-id-otional' into vdekrijger-make-project-id-otional (@vdekrijger)
  - PostHog/terraform-provider-posthog@55c327f8911c7569aabb12b62fb67c99f749ea34: doc: Update to include the new env var for the acceptance tests (@vdekrijger)

## 1.0.1

### Patch Changes

- 7116631: ## Changelog

  ### New Features
  - 8ce4f993275463efa292eadd20b47bc8cd5ca1be: feat(resource): Add project resource (@vdekrijger)
