# pulumi-posthog

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
