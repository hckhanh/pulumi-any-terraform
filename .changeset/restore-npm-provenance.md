---
'pulumi-better-uptime': patch
'pulumi-buildkite': patch
'pulumi-bunnynet': patch
'pulumi-infisical': patch
'pulumi-local': patch
'pulumi-logtail': patch
'pulumi-namecheap': patch
'pulumi-openfga': patch
'pulumi-portainer': patch
'pulumi-posthog': patch
'pulumi-teamcity': patch
'pulumi-time': patch
---

Restore the npm provenance attestation. The previous release authenticated with GitHub Actions OIDC and shipped without the Sigstore statement, so installers that reject a trust downgrade refuse it.
