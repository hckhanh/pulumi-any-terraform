## 2.2.0

### Minor Changes

- Remove the chart/section overlap in the example dashboard layout by @PetrHeinz in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/109
- Look up dashboards by ID directly instead of scanning the paginated list by @PetrHeinz in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/108
- File existing example resources under the empty secondary groups by @PetrHeinz in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/107

**Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-logtail/compare/v10.15.3...v10.15.4

### Patch Changes

- [T-17777] Add gitlab_repository_name field to logtail_errors_application by @SaltySkyPie in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/99

#### New Contributors

- @SaltySkyPie made their first contribution in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/99

**Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-logtail/compare/v10.14.3...v10.14.4

- T-8648 Handle custom_bucket without apply loops by @PetrHeinz in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/112

**Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-logtail/compare/v10.15.7...v10.15.8

Update pulumi-logtail from 10.15.8 to 10.15.10

**Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-logtail/compare/v10.15.8...v10.15.10

## 2.1.2

### Patch Changes

- Make logtail_metric.aggregations optional and align valid values with the API by @PetrHeinz in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/95

**Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-logtail/compare/v10.14.2...v10.14.3

## 2.1.1

### Patch Changes

- Add CLAUDE.md with guidance for repository usage by @PetrHeinz in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/93
- Add pgbouncer kind to logtail_collector_target by @paweljw in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/92
- Add merge logs and buffering settings to logtail_collector by @paweljw in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/91

**Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-logtail/compare/v10.14.1...v10.14.2

## 2.1.0

### Minor Changes

- T-18525 Add logtail_source_aws_account resource for AWS account linkage by @curusarn in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/88
- T-18501 Add github_repository_name to errors_application by @PetrHeinz in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/89

**Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-logtail/compare/v10.13.0...v10.14.0

## 2.0.0

### Major Changes

- T-17482: Expose correlate_with_source_id on errors_application by @PetrHeinz in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/83

#### Breaking Changes

- Removed the Warehouse resources and data sources (`WarehouseSource`, `WarehouseSourceGroup`, `WarehouseEmbedding`, `WarehouseTimeSeries`, `getWarehouseSource`, `getWarehouseSourceGroup`, `getWarehouseEmbedding`). These were dropped from the upstream Terraform provider and are no longer available.

**Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-logtail/compare/v10.12.1...v10.12.2

## 1.3.0

### Minor Changes

Update logtail provider from 10.11.2 to 10.11.3.

#### What's Changed

- Collect metrics support by @paweljw in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/77 — adds the new `logtail.CollectorTarget` resource for configuring collector scrape targets (postgres, mysql, redis, mongodb, memcached, elasticsearch, nginx, apache, kafka, prometheus). The `databases` field on `logtail.Collector` is now deprecated in favor of this resource.
- Cover `log_line_length_limit_kb` by @paweljw in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/78

#### New Contributors

- @paweljw made their first contribution in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/77

**Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-logtail/compare/v10.11.2...v10.11.3

## 1.2.1

### Patch Changes

Update pulumi-logtail from 10.11.0 to 10.11.1

**Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-logtail/compare/v10.11.0...v10.11.1

Update pulumi-logtail from 10.11.1 to 10.11.2

**Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-logtail/compare/v10.11.1...v10.11.2

## 1.2.0

### Minor Changes

- T-17335 Create Linear issue on E2E workflow failure by @PetrHeinz in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/72
- T-17540 Pre-install terraform in unit-test CI job by @Naerriel in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/73
- [T-8726] Update metric in place via PATCH by @Naerriel in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/69

#### New Contributors

- @Naerriel made their first contribution in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/73

**Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-logtail/compare/v10.10.3...v10.11.0

## 1.1.0

### Minor Changes

## What's Changed

- T-17203 Add multi_select_with_sql to variable types with sql_definition by @PetrHeinz in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/68

**Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-logtail/compare/v10.10.1...v10.10.2

## 1.0.0

### Major Changes

- b0cf75b: Update pulumi-logtail from 0.9.2 to 10.9.3

### Patch Changes

- cdab503: ## What's Changed
  - T-16530 examples/advanced: update alerts to check both sources in multi_query_alerts by @PetrHeinz in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/59
  - T-16259 add support for code mapping by @tmladek in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/58

  **Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-logtail/compare/v0.9.1...v0.9.2

## 0.8.0

### Minor Changes

- f8a576f: Update pulumi-logtail from 0.7.7 to 0.8.1
- 365e6c3: ## What's Changed
  - T-16530 Add Exploration and Alert resources by @PetrHeinz in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/57
    - Also fixes behavior of groups when un-assigning from explorations, sources, and other resources.

  **Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-logtail/compare/v0.9.0...v0.9.1

## 0.6.8 (2025-10-08)

## 0.7.4

### Patch Changes

- 2e53a01: ## What's Changed
  - T-8046 Add resources for dashboards (JSON import/export) by @PetrHeinz in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/51

  **Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-logtail/compare/v0.7.6...v0.7.7

## 0.7.3

### Patch Changes

- 775bdd1: ## What's Changed
  - T-9946 Add Winlogbeat telemetry source platform by @PetrHeinz in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/49

  **Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-logtail/compare/v0.7.4...v0.7.5

## 0.7.2

### Patch Changes

- 7116631: ## What's Changed
  - T-16004 Update platforms in source and errors_application resources by @PetrHeinz in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/48

  **Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-logtail/compare/v0.7.3...v0.7.4

## 0.7.1

### Patch Changes

- 3671817: ## What's Changed
  - Add missing team_id to source output by @nathansamson in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/47

  ## New Contributors
  - @nathansamson made their first contribution in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/47

  **Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-logtail/compare/v0.7.2...v0.7.3

## 0.7.0

### Minor Changes

- 4a3c735: ## What's Changed
  - T-9774 Add Connection resource by @PetrHeinz in https://github.com/BetterStackHQ/terraform-provider-logtail/pull/44

  **Full Changelog**: https://github.com/BetterStackHQ/terraform-provider-logtail/compare/v0.7.0...v0.7.1

### 🩹 Fixes

- Add `"sideEffects": false` to the package.json to indicate the package is side-effect-free ([a5e20a3](https://github.com/hckhanh/pulumi-any-terraform/commit/a5e20a3))

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 0.6.7 (2025-09-28)

### 🩹 Fixes

- This patch release upgrades the Logtail Pulumi provider with code quality improvements and TypeScript modernization: ([37329e1](https://github.com/hckhanh/pulumi-any-terraform/commit/37329e1))
  1. **TypeScript Upgrade**: Updated TypeScript target from ES2016 to ES2020 for better language feature support
  2. **Code Style Improvements**: Refactored resource properties to use `declare` modifier for enhanced type safety
  3. **Optional Chaining Optimization**: Simplified conditional expressions with modern syntax
  4. **Build Enhancement**: Improved postinstall script with automatic `@types` package detection and better error handling

  #### Technical Changes

  ##### TypeScript & Build Improvements
  - **Target Upgrade**: Updated TypeScript compilation target from ES2016 to ES2020 in `tsconfig.json`
  - **Enhanced Build Script**:
    - Automatic detection of `@types` packages for TypeScript compilation
    - Improved error handling and logging in postinstall script
    - Better formatting and code organization

  ##### Code Quality Enhancements
  - **Property Declarations**: All resource properties now use `declare` modifier (e.g., `declare public readonly name: pulumi.Output<string>`)
  - **Optional Chaining**: Replaced verbose ternary expressions (`state ? state.property : undefined`) with concise optional chaining (`state?.property`)
  - **Constructor Validation**: Streamlined argument validation using optional chaining syntax

  ##### API Updates
  - **Provider Version**: Updated from Logtail provider v0.6.3 to v0.6.4
  - **Platform Support**: Added `azure_logs` platform support to Source resource
  - **Type Safety**: Enhanced with strict TypeScript configurations

  #### Files Modified
  - **`metric.ts`**: Updated property declarations and constructor logic
  - **`provider.ts`**: Enhanced with `declare` modifiers and optional chaining
  - **`source.ts`**: Added Azure Logs platform, updated properties and documentation
  - **`sourceGroup.ts`**: Refactored with modern TypeScript syntax
  - **`package.json`**: Updated provider version and parameterization
  - **`scripts/postinstall.js`**: Complete rewrite with automatic type detection and better error handling
  - **`tsconfig.json`**: Upgraded TypeScript target to ES2020
  - **`utilities.ts`**: Updated provider version references

  #### Impact
  - **Improved Developer Experience**: Modern TypeScript features and better error handling
  - **Enhanced Type Safety**: `declare` modifiers provide clearer property definitions
  - **Better Maintainability**: Simplified code with optional chaining reduces complexity
  - **Extended Platform Support**: Added Azure Logs integration capabilities
    This release maintains full backward compatibility while modernizing the codebase for better development and maintenance experience.

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 0.6.6 (2025-08-26)

### 🩹 Fixes

- Add build step to fix empty `bin` folder ([db7e314](https://github.com/hckhanh/pulumi-any-terraform/commit/db7e314))

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 0.6.5 (2025-08-19)

### 🩹 Fixes

- **logtail:** add publishConfig for public package access ([9adfa58](https://github.com/hckhanh/pulumi-any-terraform/commit/9adfa58))

### ❤️ Thank You

- Khánh Hoàng @hckhanh
