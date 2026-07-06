---
'pulumi-portainer': minor
---

#### Highlights

- **Kubernetes brownfield adoption** - `terraform import` and drift/deletion
  detection are now available for all 17 Kubernetes resources.
- **Fix:** `portainer_stack` Kubernetes deployments no longer fail with
  `Object not found (key=0)` after a successful create (portainer/terraform-provider-portainer#130).

#### Added

- Read + `Importer` implemented for all 17 Kubernetes resources: `application`,
  `clusterrole`, `clusterrolebinding`, `configmap`, `cronjob`, `helm`, `ingress`,
  `job`, `namespace`, `namespace_system`, `role`, `rolebinding`, `secret`,
  `service`, `serviceaccount`, `storage`, `volume`. This enables importing
  existing infrastructure and detects out-of-band deletion (404 → resource is
  recreated on the next plan). A shared `k8sConfirmExistsByGET` helper backs the
  13 manifest-based resources.

#### Fixed

- `portainer_stack` with `deployment_type = "kubernetes"` failed during the
  finalize step with `404 Object not found (key=0)` when Portainer's create
  response did not include a usable stack `Id` (observed on Portainer 2.21.x).
  The provider now resolves the real stack ID by name + endpoint before
  finalizing.

#### Changed

- Bump `go.mongodb.org/mongo-driver` 1.17.6 -> 1.17.7.

#### Upgrade notes

- `Read` for the Kubernetes resources intentionally does **not** refresh the
  authored `manifest` / `values` / spec fields (the K8s API returns
  server-expanded objects that would cause permanent diffs and, since Update is
  delete+recreate, churn workloads). After `terraform import`, set those fields
  in config to match the live object, otherwise the next apply will recreate it.
  Per-resource import IDs and the fields you must set are documented in each
  resource's docs page.
