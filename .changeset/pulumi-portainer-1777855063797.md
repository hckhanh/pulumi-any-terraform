---
'pulumi-portainer': minor
---

#### Fixed

- `portainer_edge_configurations`: provider no longer adopts a pre-existing edge configuration when a same-name resource is created (portainer/terraform-provider-portainer#115)

#### Added

- `portainer_edge_configurations`: detect changes to the underlying file at `file_path` via new computed `file_sha256` attribute - re-upload is now triggered automatically when the file's contents change (portainer/terraform-provider-portainer#116)
