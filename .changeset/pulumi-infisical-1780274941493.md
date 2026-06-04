---
'pulumi-infisical': minor
---

- feat: cert-manager application rework by @carlosmonastyrski in https://github.com/Infisical/terraform-provider-infisical/pull/283
- add the option to add group access token to gitlab connection app by @romga in https://github.com/Infisical/terraform-provider-infisical/pull/286

#### New Resources

- Added `CertManagerApplication`, `CertManagerApplicationProfile`, `CertManagerApplicationUser`, `CertManagerApplicationGroup`, and `CertManagerApplicationIdentity` for managing certificate-consuming applications and their access grants.
- Added `CertManagerUser`, `CertManagerGroup`, and `CertManagerIdentity` for granting access to the certificate management module.

#### Breaking Changes

- The `projectSlug` property was removed from `CertManagerExternalCaAcme`, `CertManagerExternalCaAdcs`, and `CertManagerInternalCa` as part of the cert-manager application rework.

#### New Contributors

- @romga made their first contribution in https://github.com/Infisical/terraform-provider-infisical/pull/286

**Full Changelog**: https://github.com/Infisical/terraform-provider-infisical/compare/v0.16.25...v0.16.26
