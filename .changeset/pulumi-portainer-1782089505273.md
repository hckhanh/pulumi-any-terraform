---
'pulumi-portainer': minor
---

#### Bug fixes

- **edge_stack: non-destructive brownfield import.** `Read` now populates the full state from `GET /edge_stacks/{id}` (git config, edge groups, deployment metadata, AutoUpdate/webhook fields) instead of only ~6 of ~20 returned fields, so `terraform import` no longer forces a **destroy + recreate**. `repository_reference_name` is no longer `ForceNew` (the git endpoint updates it in place); other git fields keep `ForceNew`. Verified live: import now yields `No changes`, and a ref-name change plans as `~ update in-place`.
- **docker_secret: stable `driver`/`templating` on refresh.** `Read` now flattens the API's `{Name, Options}` shape back into the flat map schema, fixing a refresh-time type error and state drift.

#### Internal modernization & quality (no breaking config changes)

- Migrated **all resources and data sources** to context-aware CRUD (`CreateContext`/`ReadContext`/`UpdateContext`/`DeleteContext` returning `diag.Diagnostics`).
- HTTP requests now honor Terraform's context (cancellation / timeouts) via `http.NewRequestWithContext`.
- `Importer.State` → `StateContext` (dropped deprecated `ImportStatePassthrough`) and removed the `-SA1019` staticcheck suppression.
- Re-enabled `errcheck` on `d.Set` so schema-mapping bugs surface instead of being silently ignored.
- Enabled 9 additional golangci-lint linters and fixed the fallout.
- Raised unit-test coverage **~66% → ~78%** (+~350 tests).
- Bumped Go toolchain to **1.26.4** (resolves `govulncheck` `GO-2026-5037` / `GO-2026-5039`).
