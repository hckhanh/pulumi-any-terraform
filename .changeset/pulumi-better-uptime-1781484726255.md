---
'pulumi-better-uptime': patch
---

#### What's Changed

- [U-7151] Add `fallbackPolicyId` to `Policy` — escalate to another escalation policy once this policy has run all its steps and repeats without being acknowledged (also exposed on the `getPolicy` data source) by @radike in https://github.com/BetterStackHQ/terraform-provider-better-uptime/pull/208
- [U-8835] Add `matchMode` to `CatalogRelation` — control whether a record enriches incidents matching `any` (default) or `all` of its primary attribute values in https://github.com/BetterStackHQ/terraform-provider-better-uptime/pull/210

**Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-better-uptime/compare/v0.21.0...v0.21.2
