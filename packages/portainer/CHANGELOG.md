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