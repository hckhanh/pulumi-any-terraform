---
'pulumi-portainer': patch
---

## Release v1.16.1

### Bug fixes

- **portainer_docker_network**: Fixed an issue where Docker networks
  (especially overlay networks in Docker Swarm environments) were
  intermittently planned for creation even though they already existed.

  This makes repeated `terraform apply` runs idempotent for
  `portainer_docker_network` resources and resolves issue #57.
