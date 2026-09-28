# pulumi-local

## 2.9.4

### Patch Changes

Restore the npm provenance attestation. The previous release authenticated with GitHub Actions OIDC and shipped without the Sigstore statement, so installers that reject a trust downgrade refuse it.

## 2.9.3

### Patch Changes

Drop the unused async-mutex dependency. OpenFGA registers the provider through Pulumi's registerPackage, which already serializes that registration.

## 2.9.2

### Patch Changes

Point provider documentation at https://docs.khanh.id/pulumi-any-terraform.

## 2.9.1

### Patch Changes

#### 2.9.1 (September 10, 2026)

NOTES:

- Upgrade the Go toolchain to 1.26.8. ([hashicorp/terraform-provider-local#526](https://github.com/hashicorp/terraform-provider-local/issues/526))

## 2.9.0

### Minor Changes

#### 2.9.0 (May 12, 2026)

ENHANCEMENTS:

- Added linux/s390x build target for IBM Z platform support ([hashicorp/terraform-provider-local#504](https://github.com/hashicorp/terraform-provider-local/issues/504))

## 2.8.1

### Patch Changes

Add README and documentation for the Local provider

## 2.8.0

### Minor Changes

#### 2.8.0 (April 02, 2026)

NOTES:

- Update dependencies ([hashicorp/terraform-provider-local#404](https://github.com/hashicorp/terraform-provider-local/issues/404))

ENHANCEMENTS:

- Added optional `environment` map attribute to `action/local_command` resource ([hashicorp/terraform-provider-local#493](https://github.com/hashicorp/terraform-provider-local/issues/493))
