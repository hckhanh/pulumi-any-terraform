---
'pulumi-portainer': patch
---

### Release v1.20.1

#### Fix/Patch/Update

- Fixes terraform destroy failures when a stack's ResourceControl is deleted
  automatically by Portainer.
- portainer_resource_control now gracefully handles 403/404 responses on delete,
  e.g. when the parent stack has already removed the ResourceControl.
- This improves compatibility for Environment Admins and GitOps/stack workflows.
