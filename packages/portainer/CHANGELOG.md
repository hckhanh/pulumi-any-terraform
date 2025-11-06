## 1.15.0 (2025-10-29)

## 1.16.0

### Minor Changes

- 72aa8c6: ## v1.16.0 – Add write-only (\_wo) ephemeral secret support

  ### Features
  - Added `_wo` (write-only) attributes for ephemeral secrets across multiple resources.
  - Introduced `_wo_version` flag for rotation and re-creation of ephemeral-sensitive data.

  ### Updated Resources
  - `portainer_stack`
  - `portainer_docker_secret`

  ### Documentation
  - Extended examples for ephemeral secret usage.
  - Updated resource docs with `_wo` attribute descriptions and usage notes.

### 🚀 Features

- ### New Features ([3929fef](https://github.com/hckhanh/pulumi-any-terraform/commit/3929fef))
  - Added new resource `portainer_deploy`
  - Automates image updates and environment variable synchronization for stacks in Portainer (Swarm & Standalone).
  - Added new resource `portainer_check`
  - Enables validation of running containers or services after deployment with retries and state checks.
  - Enhanced documentation
  - Updated README and added detailed examples for CI/CD automation using new resources.

  ### Improvements
  - Added comprehensive Terraform examples for end-to-end automation (pull → deploy → exec → check).
  - Fixed and unified documentation structure across all resources.

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 1.14.0 (2025-10-28)

### 🚀 Features

- Bump portainer to [v1.14.1](https://github.com/portainer/terraform-provider-portainer/releases/tag/v1.14.1) adjust parameters and attributes include registry and settings modifications ([030c36d](https://github.com/hckhanh/pulumi-any-terraform/commit/030c36d))

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 1.13.4 (2025-10-15)

### 🩹 Fixes

- - Resolved issue with `portainer_docker_config` resource causing "invalid config version" errors when updating data. ([0cfb194](https://github.com/hckhanh/pulumi-any-terraform/commit/0cfb194))

  - Fixed prune option not working on stack create for repository-based stacks (now performs automatic redeploy with prune=true).

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 1.13.3 (2025-10-10)

### 🩹 Fixes

- Recommended update for all users on v1.13.0. ([ae88a48](https://github.com/hckhanh/pulumi-any-terraform/commit/ae88a48))
  - Fixed false in-place updates for stacks deployed via method=file
  - Fixed random recreate plans for docker networks due to missing EnableIPv4/EnableIPv6 fieldsNo breaking changes.

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 1.13.2 (2025-10-08)

### 🩹 Fixes

- Add `"sideEffects": false` to the package.json to indicate the package is side-effect-free ([a5e20a3](https://github.com/hckhanh/pulumi-any-terraform/commit/a5e20a3))

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 1.13.1 (2025-09-30)

### 🩹 Fixes

- Initialize support for `portainer/terraform-provider-portainer` ([91cca07](https://github.com/hckhanh/pulumi-any-terraform/commit/91cca07))

### ❤️ Thank You

- Khánh Hoàng @hckhanh
