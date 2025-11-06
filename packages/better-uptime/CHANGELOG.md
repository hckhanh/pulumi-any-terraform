## 0.20.9 (2025-10-08)

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
