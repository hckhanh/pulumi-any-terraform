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
