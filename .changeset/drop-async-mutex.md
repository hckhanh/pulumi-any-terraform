---
"pulumi-better-uptime": patch
"pulumi-buildkite": patch
"pulumi-bunnynet": patch
"pulumi-infisical": patch
"pulumi-local": patch
"pulumi-logtail": patch
"pulumi-namecheap": patch
"pulumi-openfga": patch
"pulumi-portainer": patch
"pulumi-posthog": patch
"pulumi-teamcity": patch
"pulumi-time": patch
---

Drop the unused async-mutex dependency. OpenFGA registers the provider through Pulumi's registerPackage, which already serializes that registration.
