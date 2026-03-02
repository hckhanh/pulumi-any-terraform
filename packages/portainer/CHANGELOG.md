## 1.15.0 (2025-10-29)

## 1.21.0

### Minor Changes

- f8a576f: # Release v1.25.0

  ## Features
  - **User Import:** You can now easily import existing `portainer_user` resources into Terraform state using either their numeric ID or Username. portainer/terraform-provider-portainer#96
  - **Custom Headers:** Added support for passing custom headers to the Provider configuration, which is especially useful when placing Portainer behind service-to-service authentication proxies (like Cloudflare Access). portainer/terraform-provider-portainer#90
  - **New Data Sources:** Introduced three new data sources (`portainer_team_membership, portainer_endpoint_group_access, portainer_registry_access`) that allow you to easily query and read existing access rights (roles) and team memberships for existing entities.

  ## Bug Fixes
  - **Access Policy Destruction:** Fixed an issue where destroying `portainer_registry_access` or `portainer_endpoint_group_access` resources would fail with a `404 Not Found` error if the parent registry or endpoint was already deleted. The provider now handles out-of-order deletions gracefully.
  - **Stack GitOps Polling (`update_interval`):** Fixed an issue in `portainer_stack` and `portainer_edge_stack` where the `update_interval` parameter for Git auto-updates was being ignored if the webhook was not enabled. GitOps polling now works correctly and independently of the `stack_webhook` setting. portainer/terraform-provider-portainer#97

### Patch Changes

- 365e6c3: ## Release v1.25.2

  ### Fixes
  - `portainer_licenses` - exposes key as resource ID (portainer/terraform-provider-portainer#100)
  - `portainer_stack` - import loses git config fields (portainer/terraform-provider-portainer#101)

## 1.20.0

### Minor Changes

- 2e53a01: # Release v1.24.0

  ## New Features
  - `custom_headers` - add new arguments reference of Portainer Terraform/OpenTofu provider portainer/terraform-provider-portainer#90

  ## Patch
  - `portainer_resource_control` - fix for deleted even if type or id does not change portainer/terraform-provider-portainer#92
  - `portainer_environment` - fix for resource does not expose edge_id and environment type drifts from 4 to 7 for Kubernetes Edge Agent portainer/terraform-provider-portainer#93

  ## SDK Migration
  - `portainer_environment`
  - `portainer_endpoint_group`
  - `portainer_registry`
  - `portainer_registry_access`
  - `portainer_custom_template`
  - `portainer_webhook`
  - `portainer_ssl`

## 1.19.0

### Minor Changes

- 775bdd1: # Release v1.22.0

  ## 🚀 Key Features

  ### New resource
  - `portainer_registry_access` - resource allows you to manage access control for a Portainer registry on a specific environment (endpoint) - portainer/terraform-provider-portainer#86

  ### SDK Migration
  - Tags: portainer_tag (Resource & Data Source)
  - Teams: portainer_team (Resource & Data Source)
  - Team Memberships: portainer_team_membership (Resource)
  - Users: portainer_user (Resource & Data Source)
  - User Admin: portainer_user_admin (Resource)

## 1.18.0

### Minor Changes

- 7116631: # Release v1.21.0

  This release introduces major improvements, including comprehensive Data Source support and several new resources to enhance Portainer infrastructure management via Terraform.

  ## 🚀 Key Features
  - **20 New Data Sources**: Support for importing existing Portainer resources like Users, Teams, Environments, Stacks, and Docker objects into your configuration. portainer/terraform-provider-portainer#84
  - **Enhanced `portainer_stack`**: Now supports private registries, multiple Git YAML files. portainer/terraform-provider-portainer#83 + Slack

  ## 🛠️ Maintenance
  - Updated to the latest Go version.

## 1.17.1

### Patch Changes

- 3671817: ### Release v1.20.1

  #### Fix/Patch/Update
  - Fixes terraform destroy failures when a stack's ResourceControl is deleted
    automatically by Portainer.
  - portainer_resource_control now gracefully handles 403/404 responses on delete,
    e.g. when the parent stack has already removed the ResourceControl.
  - This improves compatibility for Environment Admins and GitOps/stack workflows.

## 1.17.0

### Minor Changes

- 5823858: ## **Release v1.17.0**

  ## 🚀**Highlights**

  This release introduces two major new features:
  - **Full ResourceControl support for Docker Secrets** (discussion portainer/terraform-provider-portainer#71)
  - **Extension of `portainer_environment` with TLS configuration parameters**
    (`TLSCACertFile`, `TLSCertFile`, `TLSKeyFile`) – (discussion portainer/terraform-provider-portainer#70)

  It also includes several fixes and stability improvements + added portainer_resource_control also to daily e2e tests.

- 4a3c735: ## Release v1.20.0 – `resource_control_id` support & admin bootstrap without credentials

  ### Update
  - Added `resource_control_id` as a computed attribute for:
    - `portainer_docker_secret`
    - `portainer_docker_config`
    - `portainer_docker_network`
    - `portainer_docker_volume`
    - `portainer_stack`
  - Provider can now be configured **without credentials** for use cases that rely only on public endpoints (e.g. `portainer_user_admin` for initial admin bootstrap).
  - Keeps backward compatibility with existing `api_key` / `api_user` + `api_password` authentication flow.

## 1.16.1

### Patch Changes

- e3d71bf: ## Release v1.16.1

  ### Bug fixes
  - **portainer_docker_network**: Fixed an issue where Docker networks
    (especially overlay networks in Docker Swarm environments) were
    intermittently planned for creation even though they already existed.

    This makes repeated `terraform apply` runs idempotent for
    `portainer_docker_network` resources and resolves issue #57.

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
