## 0.8.8 (2025-08-26)

### 🩹 Fixes

- Add build step to fix empty `bin` folder ([db7e314](https://github.com/hckhanh/pulumi-any-terraform/commit/db7e314))

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 0.8.7 (2025-08-26)

### 🩹 Fixes

- This patch release addresses a critical bug in the bunnynet provider and improves the development workflow configuration. ([#35](https://github.com/hckhanh/pulumi-any-terraform/pull/35))

  **Primary Fix: Pullzone Cache Expiration Time Bug**
  - Fixed an issue where the `cache_expiration_time` property in the pullzone resource was generating invalid new values during resource updates
  - This bug was causing Terraform operations to fail when attempting to modify pullzone configurations
  - The fix involved correcting the value handling logic to ensure proper validation and serialization of cache expiration time values
  - This resolves potential runtime errors and ensures smooth resource lifecycle management for pullzone resources
  **Development Workflow Enhancement**
  - Enabled version plans in the Nx release configuration to improve the release management process
  - This change allows for better tracking and planning of version bumps across the monorepo
  - Enhances the automated release workflow by providing more granular control over versioning decisions
  - Supports better collaboration by making version planning more transparent and predictable
  **Additional Improvements**
  - Updated multiple TypeScript resource definitions to ensure consistency and improve type safety
  - Standardized formatting and code structure across all bunnynet provider resources
  - Enhanced resource property definitions for better documentation and IntelliSense support
  - Improved the overall developer experience when working with the bunnynet provider
  This release ensures that existing pullzone resources continue to work correctly while providing a more robust foundation for future development and releases.

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 0.8.6 (2025-08-19)

### 🩹 Fixes

- **bunnynet:** add publishConfig for public package access ([0a54684](https://github.com/hckhanh/pulumi-any-terraform/commit/0a54684))

### ❤️ Thank You

- Khánh Hoàng @hckhanh