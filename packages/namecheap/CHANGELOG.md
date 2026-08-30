## 2.4.1

### Patch Changes

#### [2.9.1](https://github.com/namecheap/terraform-provider-namecheap/compare/v2.9.0...v2.9.1) (2026-08-25)

#### Bug Fixes

- **deps:** bump github.com/namecheap/go-namecheap-sdk/v2 from 2.10.1 to 2.10.2 ([namecheap/terraform-provider-namecheap#326](https://github.com/namecheap/terraform-provider-namecheap/issues/326)) ([df69f75](https://github.com/namecheap/terraform-provider-namecheap/commit/namecheap/terraform-provider-namecheap@df69f75))
- **deps:** bump github.com/stretchr/testify from 1.11.1 to 1.12.0 ([namecheap/terraform-provider-namecheap#322](https://github.com/namecheap/terraform-provider-namecheap/issues/322)) ([7abe284](https://github.com/namecheap/terraform-provider-namecheap/commit/namecheap/terraform-provider-namecheap@7abe284))
- **deps:** bump golang.org/x/mod to v0.40.0 and update golang.org/x family ([namecheap/terraform-provider-namecheap#325](https://github.com/namecheap/terraform-provider-namecheap/issues/325)) ([79e3743](https://github.com/namecheap/terraform-provider-namecheap/commit/namecheap/terraform-provider-namecheap@79e3743))

## 2.4.0

### Minor Changes

#### [2.5.0](https://github.com/namecheap/terraform-provider-namecheap/compare/v2.4.0...v2.5.0) (2026-07-10)

#### Features

- add namecheap_domain_contacts resource (WHOIS contact management) ([namecheap/terraform-provider-namecheap#285](https://github.com/namecheap/terraform-provider-namecheap/issues/285)) ([2006dc9](https://github.com/namecheap/terraform-provider-namecheap/commit/namecheap/terraform-provider-namecheap@2006dc9))
- add namecheap_domain, namecheap_domains, namecheap_domain_records data sources ([namecheap/terraform-provider-namecheap#286](https://github.com/namecheap/terraform-provider-namecheap/issues/286)) ([517b525](https://github.com/namecheap/terraform-provider-namecheap/commit/namecheap/terraform-provider-namecheap@517b525))
- add namecheap_nameserver resource (register personal nameservers) ([namecheap/terraform-provider-namecheap#284](https://github.com/namecheap/terraform-provider-namecheap/issues/284)) ([47a251f](https://github.com/namecheap/terraform-provider-namecheap/commit/namecheap/terraform-provider-namecheap@47a251f))

#### [2.6.0](https://github.com/namecheap/terraform-provider-namecheap/compare/v2.5.0...v2.6.0) (2026-07-13)

#### Features

- add namecheap_email_forwarding resource ([namecheap/terraform-provider-namecheap#289](https://github.com/namecheap/terraform-provider-namecheap/issues/289)) ([66c8e65](https://github.com/namecheap/terraform-provider-namecheap/commit/namecheap/terraform-provider-namecheap@66c8e65))
- warn before OVERWRITE mode deletes unmanaged DNS records ([namecheap/terraform-provider-namecheap#288](https://github.com/namecheap/terraform-provider-namecheap/issues/288)) ([825256a](https://github.com/namecheap/terraform-provider-namecheap/commit/namecheap/terraform-provider-namecheap@825256a))

#### [2.7.0](https://github.com/namecheap/terraform-provider-namecheap/compare/v2.6.2...v2.7.0) (2026-08-01)

#### Features

- add namecheap_account_balance and namecheap_tld_pricing data sources ([namecheap/terraform-provider-namecheap#305](https://github.com/namecheap/terraform-provider-namecheap/issues/305)) ([0a0328a](https://github.com/namecheap/terraform-provider-namecheap/commit/namecheap/terraform-provider-namecheap@0a0328a))
- expose retry_base_delay and retry_max_delay provider options ([namecheap/terraform-provider-namecheap#307](https://github.com/namecheap/terraform-provider-namecheap/issues/307)) ([6bee275](https://github.com/namecheap/terraform-provider-namecheap/commit/namecheap/terraform-provider-namecheap@6bee275))

#### [2.9.0](https://github.com/namecheap/terraform-provider-namecheap/compare/v2.8.0...v2.9.0) (2026-08-14)

#### Features

- read the full domain info from getInfo and expose privacy, ownership, and rights attributes ([namecheap/terraform-provider-namecheap#320](https://github.com/namecheap/terraform-provider-namecheap/issues/320)) ([b42b1a7](https://github.com/namecheap/terraform-provider-namecheap/commit/namecheap/terraform-provider-namecheap@b42b1a7))

### Patch Changes

#### [2.6.1](https://github.com/namecheap/terraform-provider-namecheap/compare/v2.6.0...v2.6.1) (2026-07-22)

#### Bug Fixes

- **deps:** bump golang.org/x/text to 0.39.0 and google.golang.org/grpc to 1.82.1 ([namecheap/terraform-provider-namecheap#296](https://github.com/namecheap/terraform-provider-namecheap/issues/296)) ([cffc8c5](https://github.com/namecheap/terraform-provider-namecheap/commit/namecheap/terraform-provider-namecheap@cffc8c5))

## 2.3.3

### Patch Changes

#### [2.3.5](https://github.com/namecheap/terraform-provider-namecheap/compare/v2.3.4...v2.3.5) (2026-06-17)

#### Bug Fixes

- **deps:** bump hc-install to v0.9.5 and terraform-exec to v0.25.2 ([namecheap/terraform-provider-namecheap#231](https://github.com/namecheap/terraform-provider-namecheap/issues/231)) ([3dfc098](https://github.com/namecheap/terraform-provider-namecheap/commit/namecheap/terraform-provider-namecheap@3dfc098))

## 2.3.2

### Patch Changes

- test: make resetDomainNameservers resilient; fix TestAccDomainValidation PreCheck by @kurok in https://github.com/namecheap/terraform-provider-namecheap/pull/206
- chore: update go-namecheap-sdk to v2.5.0 and bump Go to 1.26.3 by @kurok in https://github.com/namecheap/terraform-provider-namecheap/pull/209
- chore: update Go dependencies to latest versions by @kurok in https://github.com/namecheap/terraform-provider-namecheap/pull/210

**Full Changelog**: https://github.com/namecheap/terraform-provider-namecheap/compare/v2.3.3...v2.3.4

## 2.3.1

### Patch Changes

- chore: bump Go 1.25.8 → 1.25.9 by @kurok in https://github.com/namecheap/terraform-provider-namecheap/pull/133
- test: improve unit test coverage from 65% to 82% by @kurok in https://github.com/namecheap/terraform-provider-namecheap/pull/134
- fix: address code quality findings from AI scan by @kurok in https://github.com/namecheap/terraform-provider-namecheap/pull/141
- fix: multiple dependency updates

**Full Changelog**: https://github.com/namecheap/terraform-provider-namecheap/compare/v2.3.2...v2.3.3

## 2.3.0

### Minor Changes

- fix: correct grammar in CONTRIBUTING.md by @kurok in https://github.com/namecheap/terraform-provider-namecheap/pull/130
- fix: reject subdomain in domain field to prevent silent data corruption by @kurok in https://github.com/namecheap/terraform-provider-namecheap/pull/129
- refactor: reduce duplication in testAccPreCheck with loop by @kurok in https://github.com/namecheap/terraform-provider-namecheap/pull/131

**Full Changelog**: https://github.com/namecheap/terraform-provider-namecheap/compare/v2.3.1...v2.3.2

## 2.2.13 (2025-10-08)

### 🩹 Fixes

- Add `"sideEffects": false` to the package.json to indicate the package is side-effect-free ([a5e20a3](https://github.com/hckhanh/pulumi-any-terraform/commit/a5e20a3))

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 2.2.12 (2025-09-28)

### 🩹 Fixes

- - Add bun installation example to README ([1a1b2f5](https://github.com/hckhanh/pulumi-any-terraform/commit/1a1b2f5))

  - Modernize TypeScript patterns using declare syntax for class properties
  - Use optional chaining and modern destructuring patterns
  - Improve TypeScript compilation with better type handling
  - Update target to ES2020 for better compatibility
  - Add terraformConfig method to Provider class for enhanced configuration
  - Update package version from 0.8.0 to 0.14.0 with improved parameterization
  - Enhance postinstall script with better error handling and TypeScript compilation
  - Improve export patterns and module structure
  - Add comprehensive type definitions with better Node.js compatibility

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 2.2.11 (2025-08-26)

### 🩹 Fixes

- Add build step to fix empty `bin` folder ([db7e314](https://github.com/hckhanh/pulumi-any-terraform/commit/db7e314))

### ❤️ Thank You

- Khánh Hoàng @hckhanh

## 2.2.10 (2025-08-19)

### 🩹 Fixes

- **namecheap:** add publishConfig for public package access ([d0844ff](https://github.com/hckhanh/pulumi-any-terraform/commit/d0844ff))

### ❤️ Thank You

- Khánh Hoàng @hckhanh
