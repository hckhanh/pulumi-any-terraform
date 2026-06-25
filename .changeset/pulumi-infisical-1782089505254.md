---
'pulumi-infisical': minor
---

#### New resources

- **`Webhook`**: manage Infisical project webhooks. Fires on secret events (`secrets.modified`, `secrets.rotation-failed`) for a given environment/secret path and delivers the payload to a configured URL. Supports `general`, `slack`, and `microsoft-teams` types, an optional signing secret (`webhookSecretKey`, write-only), and an `isDisabled` toggle.

#### Bug fixes

- chore: allow optional location id when scope is set to region by @Thiago-AS in https://github.com/Infisical/terraform-provider-infisical/pull/301

**Full Changelog**: https://github.com/Infisical/terraform-provider-infisical/compare/v0.16.31...v0.16.32
