## 0.6.8 (2025-10-08)

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
