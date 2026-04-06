---
'pulumi-portainer': minor
---

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
