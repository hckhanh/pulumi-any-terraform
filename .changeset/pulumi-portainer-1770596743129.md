---
'pulumi-portainer': minor
---

# Release v1.24.0

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
