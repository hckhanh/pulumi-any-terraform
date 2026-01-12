## 0.16.0-0 (2025-10-28)

## 0.16.6

### Patch Changes

- ec7ad1e: Update pulumi-infisical from 0.15.56 to 0.15.57

## 0.16.5

### Patch Changes

- 85e377a: Update pulumi-infisical from 0.15.54 to 0.15.56

## 0.16.4

### Patch Changes

- bc65a98: Update pulumi-infisical from 0.15.53 to 0.15.54

## 0.16.3

### Patch Changes

- 3671817: ## What's Changed
  - Chore: Update the subcategory for "Integration" resources to "Native Integrations" by @victorvhs017 in https://github.com/Infisical/terraform-provider-infisical/pull/220

  **Full Changelog**: https://github.com/Infisical/terraform-provider-infisical/compare/v0.15.52...v0.15.53

## 0.16.2

### Patch Changes

- 5823858: Update pulumi-infisical from 0.15.46 to 0.15.47
- 4a3c735: Update pulumi-infisical from 0.15.47 to 0.15.50

## 0.16.1

### Patch Changes

- e3d71bf:

## 0.16.0

### Patch Changes

- 72aa8c6:

### 🚀 Features

- Bump infisical to [v0.15.41](https://github.com/Infisical/terraform-provider-infisical/releases/tag/v0.15.41) ([8e90ee5](https://github.com/hckhanh/pulumi-any-terraform/commit/8e90ee5))

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 0.15.43 (2025-10-08)

### 🩹 Fixes

- Add `"sideEffects": false` to the package.json to indicate the package is side-effect-free ([a5e20a3](https://github.com/hckhanh/pulumi-any-terraform/commit/a5e20a3))

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 0.15.42 (2025-10-01)

### 🩹 Fixes

- Downgrade [Infisical/infisical](https://registry.terraform.io/providers/Infisical/infisical) provider from `0.15.37` to `0.15.34` due to error with creating `infisical_secret` (Infisical/terraform-provider-infisical#200) ([18ca5ae](https://github.com/hckhanh/pulumi-any-terraform/commit/18ca5ae))

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 0.15.41 (2025-09-28)

### 🩹 Fixes

- - Consolidate multi-line comments into single-line format for better readability across all resource files ([1dfd316](https://github.com/hckhanh/pulumi-any-terraform/commit/1dfd316))

  - Modernize TypeScript patterns using declare syntax for class properties
  - Apply consistent code modernization across all 18 resource files including identity authentication methods (AWS, Azure, GCP, Kubernetes, OIDC, Universal), integrations (AWS Parameter Store, AWS Secrets Manager), and project management resources
  - Improve documentation formatting and accessibility in JSDoc comments
  - Enhance code consistency with standardized comment patterns
  - Update configuration variables with cleaner comment structure

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 0.15.40 (2025-09-28)

### 🩹 Fixes

- Add bun installation example and bump npm version in mise.toml ([162c743](https://github.com/hckhanh/pulumi-any-terraform/commit/162c743))

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 0.15.39 (2025-09-28)

### 🩹 Fixes

- This patch refactors the Infisical Pulumi provider resources to improve code quality and consistency by: ([#52](https://github.com/hckhanh/pulumi-any-terraform/pull/52))
  1. **Resource Property Refactoring**: Updated all resource classes to use `declare` modifier for public readonly properties, improving TypeScript strictness and clarity
  2. **Optional Chaining Optimization**: Replaced verbose ternary conditional expressions with concise optional chaining syntax (`?.`) throughout all resource constructors
  3. **New Resource Support**: Added support for additional Infisical resources and integrations

  #### Code Style Improvements
  - **Property Declarations**: All `public readonly` properties now use `declare` modifier (e.g., `declare public readonly name: pulumi.Output<string>`)
  - **Optional Chaining**: Simplified resource input handling from `state ? state.property : undefined` to `state?.property`
  - **Constructor Validation**: Streamlined argument validation using optional chaining in constructor logic

  #### New Resources Added
  - **App Connections**:
    - `appConnectionGitlab.ts` - GitLab integration support
    - `appConnectionLdap.ts` - LDAP directory integration
  - **Dynamic Secrets**:
    - `dynamicSecretMongoAtlas.ts` - MongoDB Atlas dynamic secrets
    - `dynamicSecretMongoDb.ts` - MongoDB dynamic secrets
  - **Secret Rotation**:
    - `secretRotationLdapPassword.ts` - LDAP password rotation
  - **Secret Sync**:
    - `secretSyncGitlab.ts` - GitLab secret synchronization

  #### Files Modified
  - Updated **60+ resource files** in the `packages/infisical/` directory
  - Enhanced type definitions in `types/input.ts` and `types/output.ts`
  - Updated package exports in `index.ts`

  #### Technical Impact
  - **Type Safety**: Enhanced with `declare` modifiers ensuring better compile-time checks
  - **Code Readability**: Simplified conditional expressions improve maintainability
  - **Consistency**: Unified code style across all resource definitions
  - **New Functionality**: Extended provider coverage for GitLab, LDAP, and MongoDB integrations
    This is a maintenance release focusing on code quality, consistency, and expanding integration capabilities without breaking existing functionality.

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 0.15.38 (2025-08-26)

### 🩹 Fixes

- Add build step to fix empty `bin` folder ([db7e314](https://github.com/hckhanh/pulumi-any-terraform/commit/db7e314))

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 0.15.37 (2025-08-19)

### 🩹 Fixes

- **infisical:** add publishConfig for public package access ([06d758d](https://github.com/hckhanh/pulumi-any-terraform/commit/06d758d))

### ❤️ Thank You

- Khánh Hoàng @hckhanh
