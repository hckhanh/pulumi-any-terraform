---
'pulumi-portainer': minor
---

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
