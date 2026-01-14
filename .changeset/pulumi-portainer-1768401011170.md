---
'pulumi-portainer': minor
---

# Release v1.21.0

This release introduces major improvements, including comprehensive Data Source support and several new resources to enhance Portainer infrastructure management via Terraform.

## 🚀 Key Features

- **20 New Data Sources**: Support for importing existing Portainer resources like Users, Teams, Environments, Stacks, and Docker objects into your configuration. portainer/terraform-provider-portainer#84
- **Enhanced `portainer_stack`**: Now supports private registries, multiple Git YAML files. portainer/terraform-provider-portainer#83 + Slack

## 🛠️ Maintenance

- Updated to the latest Go version.
