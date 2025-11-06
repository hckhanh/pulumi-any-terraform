---
'pulumi-portainer': minor
---

## v1.16.0 – Add write-only (\_wo) ephemeral secret support

### Features

- Added `_wo` (write-only) attributes for ephemeral secrets across multiple resources.
- Introduced `_wo_version` flag for rotation and re-creation of ephemeral-sensitive data.

### Updated Resources

- `portainer_stack`
- `portainer_docker_secret`

### Documentation

- Extended examples for ephemeral secret usage.
- Updated resource docs with `_wo` attribute descriptions and usage notes.
