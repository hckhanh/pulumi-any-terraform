## 1.28.0

### Minor Changes

#### Highlights

- **Kubernetes brownfield adoption** - `terraform import` and drift/deletion
  detection are now available for all 17 Kubernetes resources.
- **Fix:** `portainer_stack` Kubernetes deployments no longer fail with
  `Object not found (key=0)` after a successful create (portainer/terraform-provider-portainer#130).

#### Added

- Read + `Importer` implemented for all 17 Kubernetes resources: `application`,
  `clusterrole`, `clusterrolebinding`, `configmap`, `cronjob`, `helm`, `ingress`,
  `job`, `namespace`, `namespace_system`, `role`, `rolebinding`, `secret`,
  `service`, `serviceaccount`, `storage`, `volume`. This enables importing
  existing infrastructure and detects out-of-band deletion (404 → resource is
  recreated on the next plan). A shared `k8sConfirmExistsByGET` helper backs the
  13 manifest-based resources.

#### Fixed

- `portainer_stack` with `deployment_type = "kubernetes"` failed during the
  finalize step with `404 Object not found (key=0)` when Portainer's create
  response did not include a usable stack `Id` (observed on Portainer 2.21.x).
  The provider now resolves the real stack ID by name + endpoint before
  finalizing.

#### Changed

- Bump `go.mongodb.org/mongo-driver` 1.17.6 -> 1.17.7.

#### Upgrade notes

- `Read` for the Kubernetes resources intentionally does **not** refresh the
  authored `manifest` / `values` / spec fields (the K8s API returns
  server-expanded objects that would cause permanent diffs and, since Update is
  delete+recreate, churn workloads). After `terraform import`, set those fields
  in config to match the live object, otherwise the next apply will recreate it.
  Per-resource import IDs and the fields you must set are documented in each
  resource's docs page.

## 1.27.0

### Minor Changes

#### Bug fixes

- **edge_stack: non-destructive brownfield import.** `Read` now populates the full state from `GET /edge_stacks/{id}` (git config, edge groups, deployment metadata, AutoUpdate/webhook fields) instead of only ~6 of ~20 returned fields, so `terraform import` no longer forces a **destroy + recreate**. `repository_reference_name` is no longer `ForceNew` (the git endpoint updates it in place); other git fields keep `ForceNew`. Verified live: import now yields `No changes`, and a ref-name change plans as `~ update in-place`.
- **docker_secret: stable `driver`/`templating` on refresh.** `Read` now flattens the API's `{Name, Options}` shape back into the flat map schema, fixing a refresh-time type error and state drift.

#### Internal modernization & quality (no breaking config changes)

- Migrated **all resources and data sources** to context-aware CRUD (`CreateContext`/`ReadContext`/`UpdateContext`/`DeleteContext` returning `diag.Diagnostics`).
- HTTP requests now honor Terraform's context (cancellation / timeouts) via `http.NewRequestWithContext`.
- `Importer.State` → `StateContext` (dropped deprecated `ImportStatePassthrough`) and removed the `-SA1019` staticcheck suppression.
- Re-enabled `errcheck` on `d.Set` so schema-mapping bugs surface instead of being silently ignored.
- Enabled 9 additional golangci-lint linters and fixed the fallout.
- Raised unit-test coverage **~66% → ~78%** (+~350 tests).
- Bumped Go toolchain to **1.26.4** (resolves `govulncheck` `GO-2026-5037` / `GO-2026-5039`).

## 1.26.1

### Patch Changes

##### Fixed

- Creating a `portainer_environment` with `tag_ids` set failed against any Portainer version since `v1.24.0`

## 1.26.0

### Minor Changes

##### Fixed

- Errors from the Portainer API now include the actual response body instead of generic SDK placeholders like `endpointCreateBadRequest`. (portainer/terraform-provider-portainer#122 )

## 1.25.0

### Minor Changes

#### Fixed

- `portainer_edge_configurations`: provider no longer adopts a pre-existing edge configuration when a same-name resource is created (portainer/terraform-provider-portainer#115)

#### Added

- `portainer_edge_configurations`: detect changes to the underlying file at `file_path` via new computed `file_sha256` attribute - re-upload is now triggered automatically when the file's contents change (portainer/terraform-provider-portainer#116)

## 1.24.0

### Minor Changes

#### Bug Fixes

- **Fix: edge configurations update not working** — Implemented real `PUT /edge_configurations/{id}` instead of no-op, plus type mapping fix eliminating perpetual diff (portainer/terraform-provider-portainer#112)
- **Fix: Kubernetes Helm stack creation failing** — Helm fields sent as top-level payload instead of nested `helmConfig` (portainer/terraform-provider-portainer#111)
- **Fix: edge configurations assigned wrong ID** — Match by name instead of taking first result (portainer/terraform-provider-portainer#113 )
- **Fix: Go stdlib vulnerabilities** — Toolchain bumped to go1.25.9 (GO-2026-4947, GO-2026-4946, GO-2026-4870, GO-2026-4865)

#### New Resources

- `portainer_policy` — Fleet Governance Policies
- `portainer_alerting_settings` / `portainer_alerting_rule` / `portainer_alerting_silence` — Alerting management
- `portainer_shared_git_credential` / `portainer_user_git_credential` — Git credentials
- `portainer_ldap_settings` — LDAP configuration
- `portainer_helm_user_repository` / `portainer_helm_rollback` / `portainer_stack_migrate`

#### New Data Sources

- `portainer_policy` / `portainer_policy_template` — Governance lookup
- `portainer_helm_git_dryrun` / `portainer_helm_release_history` — Helm validation & history
- `portainer_gitops_repo_refs` / `portainer_gitops_repo_file` — GitOps utilities
- `portainer_user_activity` / `portainer_role` / `portainer_kubernetes_crd` / `portainer_shared_git_credential`

#### Improvements

- Fixed incomplete CRUD on `edge_update_schedules`, `kubernetes_ingresscontrollers`, `kubernetes_namespace_ingresscontrollers`, `endpoint_association`
- Added `always_clone` attribute to `portainer_edge_stack`
- Input validation on 28 schema fields (enums, URLs, ranges)
- 34 unit tests covering helper functions and parsers
- Sensitive field marking on notification channel config

## 1.23.0

### Minor Changes

# Release v1.27.0

### Resource Timeouts (portainer/terraform-provider-portainer#107)

- Added configurable timeouts to long-running resources:
  - `portainer_stack` (create: 30m, update: 30m, delete: 10m with retry)
  - `portainer_container_exec` (create: 5m)
  - `portainer_cloud_provider_provision` (create: 30m)
  - `portainer_docker_image` (create: 10m, delete: 5m)
  - `portainer_deploy` (create: 15m)
  - `portainer_kubernetes_helm` (create: 15m, delete: 10m)
  - `portainer_edge_stack` (create: 15m, update: 15m, delete: 10m)
  - `portainer_kubernetes_application` (create: 10m, update: 10m, delete: 5m)

### Stack Improvements

- **Start/Stop support** - new `active` attribute to start/stop stacks (portainer/terraform-provider-portainer#108)
- **Helm values files** - new `additional_helm_values_files` attribute (portainer/terraform-provider-portainer#109)
- `file_path_in_repository` no longer required when `helm_chart_path` is set (portainer/terraform-provider-portainer#109)
- Delete retry on server errors (5xx) with configurable timeout

### Security

- Added security scanning CI pipeline (Trivy, govulncheck, golangci-lint)
- Fixed gRPC CVE (upgraded `google.golang.org/grpc` to v1.79.3)
- Fixed all golangci-lint findings across the codebase (error handling, unused code, errors.As)
- Local security scans via `make sec`

## 1.22.0

### Minor Changes

- cdab503: ## v1.26.0

  ### Bug Fixes
  - **portainer_edge_configurations**: Fix JSON unmarshal error when `prev` field contains an object instead of string ([portainer/terraform-provider-portainer#103](https://github.com/portainer/terraform-provider-portainer/issues/103))
  - **portainer_edge_configurations**: Fix incorrect type documentation — allowed values are `general`, `filename`, `foldername` ([portainer/terraform-provider-portainer#104](https://github.com/portainer/terraform-provider-portainer/issues/104))
  - **portainer_user**: Fix unnecessary resource recreation on import due to `ldap_user` ForceNew and password update failure with 400 error ([portainer/terraform-provider-portainer#96](https://github.com/portainer/terraform-provider-portainer/discussions/96))
  - **portainer_environment**: Fix tag assignment for Edge Agent environments (type 4/7) — tags are now applied via Update after creation
  - **portainer_environment**: Fix 500 error on Update for Edge Agent environments when agent is not yet connected

  ### Features
  - **portainer_stack**: Add `helm_chart_path` support for Kubernetes repository deployments ([portainer/terraform-provider-portainer#105](https://github.com/portainer/terraform-provider-portainer/issues/105))

  ### CI/CD
  - Add Edge Agent e2e testing with dedicated `docker-compose.edge-agent.yml`
  - Add `CLAUDE.md` with project conventions and structure

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

## 1.15.0 (2025-10-29)

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
