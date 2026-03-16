---
'pulumi-portainer': minor
---

## v1.26.0

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
