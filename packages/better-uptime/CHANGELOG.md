## 0.21.2

### Patch Changes

Update pulumi-better-uptime from 0.21.2 to 0.21.3

**Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-better-uptime/compare/v0.21.2...v0.21.3

## 0.21.1

### Patch Changes

#### What's Changed

- [U-7151] Add `fallbackPolicyId` to `Policy` — escalate to another escalation policy once this policy has run all its steps and repeats without being acknowledged (also exposed on the `getPolicy` data source) by @radike in https://github.com/BetterStackHQ/terraform-provider-better-uptime/pull/208
- [U-8835] Add `matchMode` to `CatalogRelation` — control whether a record enriches incidents matching `any` (default) or `all` of its primary attribute values in https://github.com/BetterStackHQ/terraform-provider-better-uptime/pull/210

**Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-better-uptime/compare/v0.21.0...v0.21.2

## 0.21.0

### Minor Changes

- Reject changing team_name after a resource is created by @PetrHeinz in https://github.com/BetterStackHQ/terraform-provider-better-uptime/pull/207

**Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-better-uptime/compare/v0.20.20...v0.21.0

## 0.20.16

### Patch Changes

- [U-8160] Add notify_alongside_primary_responder to integration resources by @radike in https://github.com/BetterStackHQ/terraform-provider-better-uptime/pull/202

**Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-better-uptime/compare/v0.20.17...v0.20.18

## 0.20.15

### Patch Changes

Update pulumi-better-uptime from 0.20.13 to 0.20.14

**Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-better-uptime/compare/v0.20.13...v0.20.14

Update pulumi-better-uptime from 0.20.14 to 0.20.16

**Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-better-uptime/compare/v0.20.14...v0.20.16

Update pulumi-better-uptime from 0.20.16 to 0.20.17

**Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-better-uptime/compare/v0.20.16...v0.20.17

## 0.20.14

### Patch Changes

- cdab503: ## What's Changed
  - U-7286 Add white-labeling param to Status page by @gggiii in https://github.com/BetterStackHQ/terraform-provider-better-uptime/pull/187

  **Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-better-uptime/compare/v0.20.12...v0.20.13

## 0.20.13

### Patch Changes

- f8a576f: ## What's Changed
  - [U-940] add intraday widget type by @FilipBStack in https://github.com/BetterStackHQ/terraform-provider-better-uptime/pull/179
  - Do not fail on monitor validation for unknown fields by @lthms in https://github.com/BetterStackHQ/terraform-provider-better-uptime/pull/178

  ## New Contributors
  - @FilipBStack made their first contribution in https://github.com/BetterStackHQ/terraform-provider-better-uptime/pull/179
  - @lthms made their first contribution in https://github.com/BetterStackHQ/terraform-provider-better-uptime/pull/178

  **Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-better-uptime/compare/v0.20.8...v0.20.9

## 0.20.9 (2025-10-08)

## 0.20.12

### Patch Changes

- 2e53a01: ## What's Changed
  - [U-1434] Add on_incident_reopened field to outgoing webhook resource by @CharliePapworth in https://github.com/BetterStackHQ/terraform-provider-better-uptime/pull/177

  **Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-better-uptime/compare/v0.20.7...v0.20.8

## 0.20.11

### Patch Changes

- dd4326f: ## What's Changed
  - T-16031 [monitor][docs] Allow longer playwright timeouts by @PetrHeinz in https://github.com/BetterStackHQ/terraform-provider-better-uptime/pull/175

  **Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-better-uptime/compare/v0.20.5...v0.20.6

## 0.20.10

### Patch Changes

- 72aa8c6: ## What's Changed
  - U-7085 [monitor] Set strict defaults for parameters essential for monitoring by @PetrHeinz in https://github.com/BetterStackHQ/terraform-provider-better-uptime/pull/172

  **Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-better-uptime/compare/v0.20.3...v0.20.4

### 🩹 Fixes

- Add `"sideEffects": false` to the package.json to indicate the package is side-effect-free ([a5e20a3](https://github.com/hckhanh/pulumi-any-terraform/commit/a5e20a3))

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 0.20.8 (2025-09-28)

### 🩹 Fixes

- - Modernize TypeScript patterns using declare syntax for class properties across all integration resources ([#62](https://github.com/hckhanh/pulumi-any-terraform/pull/62))

  - Use optional chaining (`?.`) and modern destructuring patterns for cleaner code
  - Consolidate multi-line comments into single-line format for better readability
  - Improve TypeScript compilation with better type handling in postinstall script
  - Update target to ES2020 for better compatibility
  - Apply consistent code modernization across all 30+ resource files including AWS CloudWatch, Azure, Datadog, catalog, monitoring, and webhook integrations
  - Enhance code consistency with standardized formatting and modern JavaScript patterns

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 0.20.7 (2025-08-26)

### 🩹 Fixes

- Add build step to fix empty `bin` folder ([db7e314](https://github.com/hckhanh/pulumi-any-terraform/commit/db7e314))

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 0.20.6 (2025-08-26)

### 🩹 Fixes

- Fix missing `bin` folder ([c5df7e2](https://github.com/hckhanh/pulumi-any-terraform/commit/c5df7e2))

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 0.20.5 (2025-08-19)

### 🩹 Fixes

- **better-uptime:** add publishConfig for public package access ([b857ea4](https://github.com/hckhanh/pulumi-any-terraform/commit/b857ea4))

### ❤️ Thank You

- Khánh Hoàng @hckhanh
