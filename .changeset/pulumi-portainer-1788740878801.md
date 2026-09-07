---
'pulumi-portainer': minor
---

Support for **Portainer 2.45.0 LTS**, full coverage of the Portainer API, and two Edge Agent fixes.

The provider grows from 120 to **172 resources and data sources**.

#### Portainer 2.45 support

2.45 introduced native Portainer APIs for Kubernetes alongside the kube-apiserver proxy. An audit of every route between 2.44.0 and 2.45.0 found the API delta is confined to the Kubernetes handler; everything else that changed upstream is internal refactoring with no payload change.

New resources:

- `portainer_kubernetes_node_drain` - drain a node with all six `kubectl drain` options (force, timeout, grace period, ignore DaemonSets, delete emptyDir data, disable eviction)
- `portainer_kubernetes_deployment_scale` - manage a deployment's replica count, with drift detection
- `portainer_kubernetes_deployment_rollback` - roll a deployment back to an earlier revision
- `portainer_kubernetes_persistent_volume` - pin a PersistentVolume's reclaim policy

New data sources: `portainer_kubernetes_manifest_dry_run` (validate manifests server-side before anything is applied), `portainer_kubernetes_ingress_classes`, `portainer_kubernetes_resource_quotas`, `portainer_kubernetes_replicasets`, `portainer_kubernetes_deployments`, `portainer_kubernetes_pods`, `portainer_kubernetes_pod_logs`.

Existing Kubernetes resources keep using the kube-apiserver proxy, so nothing changes for users on older Portainer versions.

#### GitOps

GitOps Sources & Workflows was the largest gap in API coverage - an entire Portainer feature with nothing but two repository helpers reachable from Terraform. Now covered by `portainer_gitops_source` (full lifecycle plus import) and five data sources: `portainer_gitops_source`, `portainer_gitops_sources`, `portainer_gitops_workflow`, `portainer_gitops_workflows` and `portainer_gitops_source_connection`.

#### Edge Agent fixes

- **`edge_id` is no longer empty (portainer/terraform-provider-portainer#142).** Portainer only assigns an Edge ID at creation while the `EnforceEdgeID` setting is on; otherwise it stays empty until an agent connects, so there was nothing to template `PORTAINER_EDGE_ID` from and the agent could not be deployed from Terraform at all. The provider now generates one at create time, exactly as Portainer's own UI wizard does, and Portainer adopts it when the agent first checks in.
- **`environment_address` no longer drifts (portainer/terraform-provider-portainer#136).** Portainer stores an edge endpoint's URL as a bare host, dropping the scheme, the port and the path, so `http://portainer:9000` came back as `portainer` and showed a change on every plan. The address is now recovered from the edge key, which keeps it verbatim.
- Editing the address of an existing Edge Agent environment now warns instead of looking like a successful apply: Portainer bakes it into the edge key at creation and never regenerates it, so the resource has to be replaced.

#### Known issues

Two things to be aware of when managing Edge Agent environments. Neither is new in this release.

**Creating an Edge Agent environment needs `tls_enabled = false` on Portainer 2.43 and newer.** Portainer rejects the request with `TLS is not supported for Edge Agent environments`, because the provider sends the TLS flags on create and `tls_enabled` defaults to `true`. Set it explicitly until this is fixed:

```hcl
resource "portainer_environment" "edge" {
  name                = "edge-device"
  environment_address = "https://portainer.example.com"
  type                = 4

  tls_enabled = false # required on Portainer >= 2.43
}
```

**Changing `environment_address` on an existing Edge Agent environment does not converge.** The apply warns and the plan keeps showing the change, because Portainer bakes the address into the edge key at creation and the provider reads it back from there. Replace the environment (`terraform apply -replace=...`) to move it, then redeploy the agent with the new edge key.

#### Complete API coverage

Every path in Portainer 2.45's API is now reachable, except fifteen left out by design: interactive websocket streams, edge-agent-facing polling endpoints, binary upload into a container, session and auth flows, the host upgrade, bulk environment delete, the edge stack status an agent reports, and the multipart stack create that the existing string variant already covers.

Closing the remaining gaps added, among others:

- `portainer_user_api_key` - API keys can finally be **revoked and rotated**, not only created
- `portainer_endpoint_group_membership` - place a single environment in a group
- `portainer_registry_configure` and `portainer_registry_connection` - registry configuration and a pre-flight reachability check
- `portainer_ldap_check` - validate LDAP settings before committing them
- `portainer_restore` - the counterpart of `portainer_backup`
- `portainer_endpoint_relations`, `portainer_stack_delete_by_name`, `portainer_edge_job_task_logs`
- `portainer_resource_control` can now **create** a control, which makes every resource type other than stacks usable
- Read-only data sources for the instance itself (`portainer_system`, `portainer_settings_public`, `portainer_motd`), access auditing (`portainer_user_access`, `portainer_team_memberships`), the Kubernetes cluster (`portainer_kubernetes_cluster`, `_nodes`, `_events`, `_describe`, `_persistent_volumes`, `_config`, `_pod_metrics`, `_node_metrics`, `_application_resources`), Docker (`portainer_docker_dashboard`, `_images`, `_container_gpus`), templates (`portainer_app_templates`, `portainer_helm_chart`), stored files and `portainer_endpoints_summary`

`portainer_system.server_version` is the one to reach for if you need to gate configuration on the Portainer release - several of the resources above require 2.45 or newer.

#### Notes on sensitive data

Two of the new data sources touch credentials, and both are deliberate about it:

- `portainer_kubernetes_config` returns a kubeconfig carrying a bearer token for the calling user. It is marked sensitive, but it still lands in Terraform state.
- `portainer_endpoint_registries` does **not** expose the password or access token that Portainer returns with every registry object, on purpose.

#### Maintenance

- Go **1.27** (from 1.26). Building from source now needs Go 1.27+; the released binaries are unaffected.
- `go-openapi/runtime` 0.32.1 → 0.33.1, `go-openapi/strfmt` 0.26.2 → 0.27.0, plus 25 indirect modules, picking up their CVE fixes. `terraform-plugin-sdk/v2` and `portainer/client-api-go/v2` were already current.
- Contributors: `make lint` now installs **golangci-lint v2** (pinned to v2.13.2) and `.golangci.yml` is in the v2 format. The v1 line cannot read Go 1.27 export data.
