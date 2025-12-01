---
'pulumi-portainer': minor
---

## Release v1.20.0 – `resource_control_id` support & admin bootstrap without credentials

### Update

- Added `resource_control_id` as a computed attribute for:
  - `portainer_docker_secret`
  - `portainer_docker_config`
  - `portainer_docker_network`
  - `portainer_docker_volume`
  - `portainer_stack`
- Provider can now be configured **without credentials** for use cases that rely only on public endpoints (e.g. `portainer_user_admin` for initial admin bootstrap).
- Keeps backward compatibility with existing `api_key` / `api_user` + `api_password` authentication flow.
