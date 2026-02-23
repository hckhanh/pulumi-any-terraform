---
'pulumi-portainer': minor
---

# Release v1.25.0

## Features

- **User Import:** You can now easily import existing `portainer_user` resources into Terraform state using either their numeric ID or Username. portainer/terraform-provider-portainer#96
- **Custom Headers:** Added support for passing custom headers to the Provider configuration, which is especially useful when placing Portainer behind service-to-service authentication proxies (like Cloudflare Access). portainer/terraform-provider-portainer#90
- **New Data Sources:** Introduced three new data sources (`portainer_team_membership, portainer_endpoint_group_access, portainer_registry_access`) that allow you to easily query and read existing access rights (roles) and team memberships for existing entities.

## Bug Fixes

- **Access Policy Destruction:** Fixed an issue where destroying `portainer_registry_access` or `portainer_endpoint_group_access` resources would fail with a `404 Not Found` error if the parent registry or endpoint was already deleted. The provider now handles out-of-order deletions gracefully.
- **Stack GitOps Polling (`update_interval`):** Fixed an issue in `portainer_stack` and `portainer_edge_stack` where the `update_interval` parameter for Git auto-updates was being ignored if the webhook was not enabled. GitOps polling now works correctly and independently of the `stack_webhook` setting. portainer/terraform-provider-portainer#97
