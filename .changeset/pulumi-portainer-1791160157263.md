---
'pulumi-portainer': patch
---

#### Fixed

- **Stacks left in `Error` can be updated again** ([portainer/terraform-provider-portainer#147](https://github.com/portainer/terraform-provider-portainer/issues/147))
  A stack whose deployment had failed refused every further apply, in a fraction
  of a second and without sending a request. The only way out was starting the
  stack by hand in the Portainer UI. Fixing the compose file and re-applying now
  recovers the stack. A deployment that this provider itself started and that
  fails is still reported as a failure.

- **`portainer_stack_delete_by_name` now works at all**
  Every call failed with `400 Invalid query parameter: namespace`. Portainer
  requires a `namespace` query parameter that its API specification does not
  document, so the resource never sent it.

- **`portainer_registry_connection` now works at all**
  Every check failed with `400 Username and password are required`. Portainer
  demands credentials for all registry types, including public ones, so the
  data source never reached the connection test it exists to run. GitHub
  registries (`type = 8`) are also accepted now; the type was capped at 7.

#### Action required

Both fixes add a required argument to something that could not have been in
working use, so no running configuration changes behaviour - but configurations
that reference these two will now fail at plan time until they are updated:

```hcl
resource "portainer_stack_delete_by_name" "example" {
  name        = "legacy-app"
  namespace   = "legacy-apps" # new, required
  endpoint_id = 4
}

data "portainer_registry_connection" "example" {
  url      = "registry.example.com"
  type     = 3
  username = "robot"  # new, required
  password = var.password # new, required
}
```
