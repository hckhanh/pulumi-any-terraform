---
'pulumi-teamcity': minor
---

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
