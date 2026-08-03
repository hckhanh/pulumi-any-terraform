---
'pulumi-portainer': patch
---

#### Bug Fixes

- **`portainer_stack`: `active = false` now persists on repository stacks (portainer/terraform-provider-portainer#139)** -
  the update path stopped the stack _before_ the git redeploy, which restarted it,
  so `active = false` never took effect (perpetual `true -> false` diff). The stop
  now runs _after_ the redeploy.
- **`portainer_environment`: `type = 4` creates a Docker Edge Agent, not Kubernetes
  (portainer/terraform-provider-portainer#140)** - an Edge Agent create now sends `ContainerEngine=docker`, so Portainer
  provisions the requested Docker edge (type 4) instead of a Kubernetes edge (type 7).
