## 0.2.1

### Patch Changes

Update pulumi-teamcity from 0.0.91 to 0.0.92

**Full Changelog**: https://github.com/JetBrains/terraform-provider-teamcity/compare/v0.0.91...v0.0.92

## 0.2.0

### Minor Changes

Update teamcity provider from 0.0.89 to 0.0.91.

#### What's Changed

This release adds a complete set of build-configuration resources, letting you manage TeamCity build configurations and their composition from Pulumi:

- `teamcity.BuildConfiguration` — the build configuration itself
- `teamcity.BuildConfigurationSettings` — general settings (build number format, artifact rules, etc.)
- `teamcity.BuildConfigurationParameter` — build configuration parameters
- `teamcity.BuildConfigurationStep` — build steps
- `teamcity.BuildConfigurationFeature` — build features
- `teamcity.BuildConfigurationTrigger` — build triggers
- `teamcity.BuildConfigurationVcsRoot` — VCS root attachments with checkout rules
- `teamcity.BuildConfigurationAgentRequirement` — agent requirements
- `teamcity.BuildConfigurationSnapshotDependency` — snapshot dependencies
- `teamcity.BuildConfigurationArtifactDependency` — artifact dependencies

#### Bug fixes

- fix(build-configs): fix empty `properties = {}` drift on feature/step/trigger
- fix(deps): update `hc-install` to v0.9.0 and tidied the module files
- fix(deps): update go to 1.25.0

**Full Changelog**: https://github.com/JetBrains/terraform-provider-teamcity/compare/v0.0.89...v0.0.91

## 0.1.7

### Patch Changes

Update pulumi-teamcity from 0.0.87 to 0.0.89

#### Bug Fixes

- **Fix: `teamcity_project` compatibility with versions <0.0.72** — Restored backward compatibility for the project resource when targeting TeamCity servers running provider versions earlier than 0.0.72 (TW-97921)
- **Fix: `teamcity_group` description attribute** — Added the ability to specify a `description` field on the group resource, plus a regression fix and expanded acceptance test coverage across all group scenarios (TW-97580)

#### Improvements

- Added unit test ensuring the `teamcity_project` resource stays compatible with older server versions (TW-97921)

**Full Changelog**: https://github.com/JetBrains/terraform-provider-teamcity/compare/v0.0.87...v0.0.89

## 0.1.3 (2025-10-08)

## 0.1.6

### Patch Changes

- bc65a98: Update pulumi-teamcity from 0.0.86 to 0.0.87

## 0.1.5

### Patch Changes

- 4a3c735: Update pulumi-teamcity from 0.0.85 to 0.0.86

## 0.1.4

### Patch Changes

- 72aa8c6: Update pulumi-teamcity from 0.0.83 to 0.0.85

### 🩹 Fixes

- Add `"sideEffects": false` to the package.json to indicate the package is side-effect-free ([a5e20a3](https://github.com/hckhanh/pulumi-any-terraform/commit/a5e20a3))

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 0.1.2 (2025-08-26)

### 🩹 Fixes

- Add build step to fix empty `bin` folder ([db7e314](https://github.com/hckhanh/pulumi-any-terraform/commit/db7e314))

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 0.1.1 (2025-08-19)

### 🩹 Fixes

- **teamcity:** add publishConfig to package.json for public access ([04385b2](https://github.com/hckhanh/pulumi-any-terraform/commit/04385b2))

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 0.1.0 (2025-08-19)

### 🚀 Features

- **teamcity:** add initial Pulumi resources and configurations ([fc379df](https://github.com/hckhanh/pulumi-any-terraform/commit/fc379df))

### ❤️ Thank You

- Khánh Hoàng @hckhanh
