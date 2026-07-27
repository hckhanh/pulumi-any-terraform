---
'pulumi-portainer': minor
---

#### Bug Fixes

- **`portainer_stack`: honor `active = false` on create (portainer/terraform-provider-portainer#134)** — a stack created
  with `active = false` is now stopped right after deployment instead of coming up
  running. Previously the flag was only applied on _update_, so a new stack always
  started, and with `ignore_changes = [active]` it never stopped at all.

#### Internal / Maintenance

- Unify direct-HTTP call sites behind a single `doJSON` helper (auth + status +
  JSON decode) across 97 files, with typed API errors and 404 handling.
- Add a table-driven CRUD test harness (`crudCase`).
- Add a schema↔docs drift-check linter as a new CI guard.
- Parallelize the e2e CI pipeline (shared composite setup action + split
  docker/kubernetes/swarm, edge and ssl jobs).

#### Documentation

- Document previously-missing schema fields: `portainer_edge_stack.always_clone`,
  `portainer_settings.black_listed_labels`, `portainer_settings.edge_portainer_url`.
