# pulumi-openfga

## 0.5.4

### Patch Changes

Drop the unused async-mutex dependency. OpenFGA registers the provider through Pulumi's registerPackage, which already serializes that registration.

Update the Pulumi Terraform bridge from 1.1.1 to 1.4.0.

## 0.5.3

### Patch Changes

Point provider documentation at https://docs.khanh.id/pulumi-any-terraform.

## 0.5.2

### Patch Changes

Replace the auto-generated 3-line README stub with a full README covering installation, both authentication modes (API token and OAuth client credentials), runnable usage examples for stores, authorization models (DSL via `getAuthorizationModelDocument`), relationship tuples (including ABAC-conditioned tuples), and the read-side query data sources (`getCheckQuery`, `getListObjectsQuery`, `getListUsersQuery`).
