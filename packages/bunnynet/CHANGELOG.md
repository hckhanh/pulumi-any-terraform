## 0.10.0 (2025-10-03)

### 🚀 Features

- Update bunnynet provider to v0.10.2 with new pullzone features for WebSocket connections and HTML prerendering optimization. ([64fce1f](https://github.com/hckhanh/pulumi-any-terraform/commit/64fce1f))

  - **pullzone**: Add WebSocket support with `websocketsEnabled` and `websocketsMaxConnections` properties
  - **pullzone**: Add HTML prerendering support with `optimizerHtmlPrerender` property
  - **pullzone**: Fix typos in JSDoc comments (minifcation → minification)

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 0.9.2 (2025-09-29)

### 🩹 Fixes

- - Resource dns_record: `weight` automatically set to `null` for non-`A`/`AAAA`/`SRV` records ([dd2f87c](https://github.com/hckhanh/pulumi-any-terraform/commit/dd2f87c))

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 0.9.1 (2025-09-28)

### 🩹 Fixes

- - Consolidate multi-line comments into single-line format for better readability across all resource files ([#65](https://github.com/hckhanh/pulumi-any-terraform/pull/65))

  - Modernize TypeScript patterns using declare syntax for class properties
  - Add terraformConfig method to Provider class for enhanced configuration
  - Update package version from 0.8.0 to 0.14.0 with improved parameterization
  - Improve export patterns in index.ts with cleaner provider imports
  - Apply consistent code modernization across all 10 resource files including DNS records, pull zones, edge rules, hostnames, storage files, and stream libraries
  - Enhance JSDoc comment formatting and accessibility
  - Update utilities with version information for better package management

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 0.9.0 (2025-09-28)

### 🚀 Features

- This minor release adds new DNS script functionality and enhances existing DNS record capabilities in the Bunny.net Pulumi provider by: ([#53](https://github.com/hckhanh/pulumi-any-terraform/pull/53))

  1. **New DNS Script Resources**: Added support for DNS scripts and their environment variables for advanced DNS management
  2. **Enhanced DNS Record Management**: Improved DNS record properties with pullzone linking and API alignment
  3. **Provider Updates**: Updated to Bunny.net provider version 0.10.0 with improved build tooling
  #### New Features
  ##### DNS Script Management
  - **`DnsScript` Resource**: Create and manage DNS scripts with content and automatic release tracking
    - Properties: `content` (script code), `name`, `dnsScriptId` (output), `release` (output)
    - Enables programmable DNS behavior and custom routing logic
  - **`DnsScriptVariable` Resource**: Manage environment variables for DNS scripts
    - Properties: `name`, `value`, `script` (DNS script ID), `dnsScriptVariableId` (output)
    - Supports dynamic configuration of DNS script behavior
  ##### DNS Record Enhancements
  - **API Alignment**: Updated DNS record properties to match latest Bunny.net API
    - `linkName` changed from input to computed output property
    - Added `pullzoneId` input property for explicit pullzone linking
    - Enhanced cache vary options with new `state` option alongside existing `avif`, `cookie`, `country`, `hostname`, `mobile`, `querystring`, `webp`
  #### Technical Improvements
  ##### Provider Updates
  - **Version Upgrade**: Updated from Bunny.net provider v0.8.1 to v0.10.0
  - **Build Enhancement**: Improved TypeScript compilation in postinstall script with automatic `@types` package detection
  - **Type Safety**: Enhanced TypeScript configuration with proper type declarations
  ##### Code Quality
  - **Export Management**: Added proper exports for new DNS script resources in index.ts
  - **Resource Registration**: Updated Pulumi runtime registration for new resource types
  - **Documentation**: Added comprehensive JSDoc comments for all new properties and methods
  #### Files Modified
  ##### New Files
  - `dnsScript.ts` - DNS script resource implementation
  - `dnsScriptVariable.ts` - DNS script variable resource implementation
  ##### Updated Files
  - `dnsRecord.ts` - Enhanced with pullzone linking and updated property model
  - `pullzone.ts` - Added new cache vary option (`state`)
  - `index.ts` - Added exports for new DNS script resources
  - `package.json` - Updated provider version and parameterization
  - `scripts/postinstall.js` - Enhanced build script with automatic type detection
  - `tsconfig.json` - Added new files to compilation
  - `utilities.ts` - Updated provider version references
  #### Breaking Changes
  None — all changes are additive or enhance existing functionality.
  #### Impact
  This release significantly expands DNS management capabilities, enabling users to implement custom DNS logic through scripts while maintaining full compatibility with existing configurations. The enhanced DNS record management provides better integration with Bunny.net's pullzone features.

### ❤️ Thank You

- Khánh Hoàng @hckhanh

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