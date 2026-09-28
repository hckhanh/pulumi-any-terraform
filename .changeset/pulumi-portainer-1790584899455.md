---
'pulumi-portainer': major
---

**Business Edition API coverage**

This release roughly doubles what the provider can manage: 81 new resources and
data sources covering the Business Edition API, alongside fixes for a stack
deployment failure on Portainer 2.45 and a blocker that prevented Edge Agent
environments from being created at all.

Nothing was removed or renamed. Every configuration valid on v1.35.0 is still
valid, but read "Behaviour changes" before upgrading - one of them can replace
an environment.

#### Behaviour changes

**Edge Agent environments are replaced when their address changes.** Portainer
bakes the address into the edge key when the environment is created and never
regenerates it, so an in-place update never actually took effect. Until now the
provider emitted a warning and reported success, leaving the running agent on
the old address. It now forces replacement instead, which issues a new edge key
and means the agent has to be redeployed with it.

This only triggers for environment types 4 and 7, only when the address really
changed, and not when the difference is the URL scheme alone. That last
exclusion matters: Portainer normalises `endpoint.URL` down to the bare host, so
environments created by older provider versions hold a scheme-less address in
state and would otherwise be replaced on every apply.

Run `terraform plan` against your edge environments before upgrading.

**Failed API calls that used to pass silently now fail.** One internal HTTP
helper returned the body of a 403 or a 500 as though it were data. Several
resources then either stored an error page in state or reported a confusing
parse failure. Those calls now fail with what the server actually said. An apply
that appeared to succeed against a misconfigured or unauthorised Portainer may
now stop and tell you why.

**Webhooks still behave as before by default.** Business Edition can move a
webhook to another resource in place, keeping its token and every URL already
handed out. That is available through the new `reassign_on_change` argument and
is off by default, because Portainer CE has no reassign endpoint. Without it,
changing `resource_id` or `webhook_type` replaces the webhook exactly as it
always has.

#### Fixes

- **Creating a stack no longer fails with a 409 (portainer/terraform-provider-portainer#145).** Portainer 2.45 deploys
  stacks asynchronously and holds a per-stack lock until the deploy finishes.
  The provider's follow-up call landed inside that window and was rejected,
  tainting a stack that had in fact deployed fine, so every subsequent apply
  destroyed and recreated it. The provider now waits for the deployment to
  settle first. A deployment that fails is reported as a failure rather than
  retried into a false success. Covers both standalone and swarm stacks.

- **Edge Agent environments can be created on Portainer 2.43 and newer again.**
  Portainer rejects TLS outright for edge types, and the provider was sending
  the TLS fields unconditionally. They are now omitted for types 4 and 7. This
  retires the known issue from v1.35.0: `tls_enabled = false` is no longer
  needed.

- **`portainer_endpoint_relations` no longer clears what it was not asked to
  change.** Portainer reads an empty array as "remove everything", so an
  unconfigured field was wiping an environment's tags or edge groups. Each field
  is now omitted unless it is set.

- **`portainer_kubernetes_cluster` reads again.** Portainer's API specification
  types the dashboard response as a list while the server returns an object, and
  the mismatch took the whole data source down. Both shapes are now accepted.

- **`portainer_user_api_key` explains itself.** Portainer accepts this call only
  from a session and only for the calling user's own account. With an API key it
  answered `401 Auth not supported`, which said nothing useful. The provider now
  refuses before sending and names the arguments to use instead.

- **Credentials no longer reach diagnostics or state.** Errors carried the full
  request URL, and one endpoint takes a service account key as a query
  parameter. Sensitive query parameters are now redacted from error messages,
  and the data sources that store a failure reason keep only what the server
  said.

#### New resources

**Add-on store:** `portainer_addon`, `portainer_addon_access`,
`portainer_addon_config`, `portainer_addon_repair`

**Omni / Talos:** `portainer_omni_cluster`, `portainer_omni_node_reboot`

**GitOps:** `portainer_gitops_workflow`

**Backup:** `portainer_backup_azure_settings`, `portainer_backup_azure_execute`,
`portainer_backup_azure_restore`, `portainer_backup_local_settings`,
`portainer_backup_local_run`, `portainer_backup_s3_restore`

**Kubernetes:** `portainer_kubernetes_pod_security_rule`,
`portainer_kubernetes_cluster_upgrade`

**Alerting:** `portainer_alerting_rule_groups`, `portainer_alerting_rule_tiers`

**Settings and security:** `portainer_settings_default_registry`,
`portainer_settings_additional_functionality`, `portainer_ssrf_allowlist`

**Environments and users:** `portainer_endpoint_trust`,
`portainer_user_memberships_sync`

#### New data sources

**Add-on store:** `portainer_addons`, `portainer_addon_chart_source`

**Omni / Talos:** `portainer_omni_machines`, `portainer_omni_machine`,
`portainer_omni_machine_logs`, `portainer_omni_talos_versions`,
`portainer_omni_upgrade_status`, `portainer_omni_service_account`

**Kubernetes storage:** `portainer_kubernetes_storage_classes`,
`portainer_kubernetes_storage_class`,
`portainer_kubernetes_persistent_volume_claims`,
`portainer_kubernetes_persistent_volume_claim`, `portainer_kubernetes_volumes`,
`portainer_kubernetes_volume`

**Kubernetes workloads:** `portainer_kubernetes_cron_jobs`,
`portainer_kubernetes_endpoints`, `portainer_kubernetes_service_account`,
`portainer_kubernetes_application`, `portainer_kubernetes_resource_counts`,
`portainer_kubernetes_gpu`

**Kubernetes custom resources:**
`portainer_kubernetes_custom_resource_definitions`,
`portainer_kubernetes_custom_resource_definition`,
`portainer_kubernetes_custom_resources`, `portainer_kubernetes_custom_resource`

**Edge:** `portainer_edge_waiting_room`, `portainer_edge_mtls_ca_certificate`,
`portainer_edge_mtls_certificate`, `portainer_endpoint_mtls_certificate`,
`portainer_endpoint_mtls_certificate_error`,
`portainer_edge_configuration_files`, `portainer_edge_stack_stagger_status`,
`portainer_edge_update_schedule_info`,
`portainer_edge_update_previous_versions`,
`portainer_edge_update_schedules_active`, `portainer_agent_versions`

**Identity:** `portainer_ldap_users`, `portainer_ldap_groups`,
`portainer_ldap_admin_groups`, `portainer_ldap_login_test`,
`portainer_user_namespaces`, `portainer_current_user_authorizations`

**Observability and policy:** `portainer_alerting_connectivity`,
`portainer_alerting_rule_environments`, `portainer_environment_logs`,
`portainer_environment_metrics`, `portainer_policy_metadata`,
`portainer_policy_conflicts`, `portainer_policy_observability_test`

**Docker:** `portainer_docker_snapshot`,
`portainer_docker_snapshot_containers`, `portainer_docker_snapshot_container`,
`portainer_image_status`

**Other:** `portainer_licenses_info`, `portainer_recommendations`,
`portainer_auto_updates`, `portainer_stack_conversion`,
`portainer_backup_azure_connection`, `portainer_gitops_repo_file_search`,
`portainer_gitops_helm_values`

#### Edge Stack from a Helm repository

`portainer_edge_stack` gained a `helm_config` block, a fourth deployment source
alongside an inline file, an uploaded file and a git repository. Setting it
deploys the stack from a Helm chart repository. Note that leaving
`chart_version` unset lets Portainer resolve the newest published version at
apply time, so pin it where that matters.

#### Deliberately not covered

Some endpoints exist in the API but do not belong in Terraform, and are left out
on purpose rather than overlooked:

- The add-on store's own configuration API (`/addon-store/v1/*`) and the edge
  configuration state endpoint. Both are called by an add-on or an agent
  reporting its own progress. Terraform is neither, and writing to them would
  falsify the rollout state.
- Deleting Kubernetes custom resources and custom resource definitions. The API
  offers no way to create them, so a resource that could only delete what
  something else made has no lifecycle Terraform can manage. Apply manifests
  with `portainer_kubernetes_manifest` instead.
- Cancelling an Omni provision in flight. It is an interactive escape hatch;
  Terraform's answer to a provision that will not finish is to destroy the
  resource.
- Websocket endpoints, CSV exports, the support bundle and `/system/update`.

#### Known limitations

- **The Business Edition resources have not been exercised against a live
  Business Edition instance.** Their tests are built from Portainer's published
  API specification and verify the shape of every request, not the server's
  behaviour. CI runs Community Edition, so it cannot cover them either. Treat
  the first apply of a Business Edition resource as the real test, and please
  report anything that does not match.
- **`portainer_omni_cluster` cannot detect drift in its machine list.**
  Portainer reports a cluster's spec and status but not the machines it was
  built from, so a node removed outside Terraform will not appear in a plan.
- **`portainer_kubernetes_pod_security_rule` reads back only its switches.** The
  list sections are normalised and reordered by Portainer, so reading them into
  state would make a stable configuration churn. They are driven entirely by the
  configuration.
- **`portainer_user_api_key` needs `api_user` and `api_password`.** Portainer
  only lets a user create a key for themselves, from a session. A key for a user
  Terraform creates in the same configuration needs two separate applies.
