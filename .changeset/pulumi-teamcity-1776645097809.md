---
'pulumi-teamcity': patch
---

Update pulumi-teamcity from 0.0.87 to 0.0.89

#### Bug Fixes

- **Fix: `teamcity_project` compatibility with versions <0.0.72** — Restored backward compatibility for the project resource when targeting TeamCity servers running provider versions earlier than 0.0.72 (TW-97921)
- **Fix: `teamcity_group` description attribute** — Added the ability to specify a `description` field on the group resource, plus a regression fix and expanded acceptance test coverage across all group scenarios (TW-97580)

#### Improvements

- Added unit test ensuring the `teamcity_project` resource stays compatible with older server versions (TW-97921)

**Full Changelog**: https://github.com/JetBrains/terraform-provider-teamcity/compare/v0.0.87...v0.0.89
