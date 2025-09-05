# Pulumi Namecheap Provider

A Pulumi provider for managing Namecheap resources, dynamically bridged from the [Terraform Namecheap Provider](https://github.com/namecheap/terraform-provider-namecheap).

## Introduction

This package provides a Pulumi provider that enables you to manage your Namecheap domain records and DNS configuration using TypeScript, JavaScript, Python, Go, or C#. The provider is automatically generated from the Terraform Namecheap provider, giving you access to all its functionality within the Pulumi ecosystem.

### Features

- **Domain Record Management**: Create and manage DNS records (A, AAAA, CNAME, MX, TXT, etc.) for your Namecheap domains
- **Multiple Record Types**: Support for A, AAAA, ALIAS, CAA, CNAME, MX, MXE, NS, TXT, URL, URL301, and FRAME records
- **Email Configuration**: Configure email services with support for NONE, MXE, MX, FWD, OX, and GMAIL
- **Sandbox Support**: Test your configurations in Namecheap's sandbox environment
- **TypeScript Support**: Full type safety with comprehensive TypeScript definitions

## Installation

### npm

```bash
npm install pulumi-namecheap
```

### yarn

```bash
yarn add pulumi-namecheap
```

### pnpm

```bash
pnpm add pulumi-namecheap
```

## Configuration

Before using the provider, you need to configure authentication with your Namecheap API credentials.

### Required Configuration

- **API Key**: Your Namecheap API key
- **API User**: Your Namecheap API username
- **Username**: Your Namecheap account username
- **Client IP**: The IP address from which you're making API calls (must be whitelisted in Namecheap)

### Optional Configuration

- **Use Sandbox**: Set to `true` to use Namecheap's sandbox environment for testing

### Setting Configuration

You can configure the provider in several ways:

#### 1. Using Pulumi Config

```bash
pulumi config set namecheap:apiKey your-api-key
pulumi config set namecheap:apiUser your-api-user
pulumi config set namecheap:userName your-username
pulumi config set namecheap:clientIp your-client-ip
pulumi config set namecheap:useSandbox false  # optional
```

#### 2. Using Environment Variables

```bash
export NAMECHEAP_API_KEY="your-api-key"
export NAMECHEAP_API_USER="your-api-user"
export NAMECHEAP_USER_NAME="your-username"
export NAMECHEAP_CLIENT_IP="your-client-ip"
export NAMECHEAP_USE_SANDBOX="false"  # optional
```

#### 3. Provider Constructor

```typescript
import * as namecheap from 'pulumi-namecheap'

const provider = new namecheap.Provider('namecheap-provider', {
  apiKey: 'your-api-key',
  apiUser: 'your-api-user',
  userName: 'your-username',
  clientIp: 'your-client-ip',
  useSandbox: false, // optional
})
```

## Usage

### Basic Domain Records Management

```typescript
import * as namecheap from 'pulumi-namecheap'

// Create DNS records for your domain
const records = new namecheap.DomainRecords('my-domain-records', {
  domain: 'example.com',
  mode: 'OVERWRITE', // MERGE (default) or OVERWRITE
  records: [
    {
      hostname: '@',
      type: 'A',
      address: '192.168.1.100',
      ttl: 300,
    },
    {
      hostname: 'www',
      type: 'CNAME',
      address: 'example.com',
      ttl: 300,
    },
    {
      hostname: '@',
      type: 'MX',
      address: 'mail.example.com',
      mxPref: 10,
      ttl: 300,
    },
    {
      hostname: '@',
      type: 'TXT',
      address: 'v=spf1 include:_spf.google.com ~all',
      ttl: 300,
    },
  ],
})
```

### Advanced Configuration with Email Setup

```typescript
import * as namecheap from 'pulumi-namecheap'

const domainRecords = new namecheap.DomainRecords('example-domain', {
  domain: 'example.com',
  emailType: 'GMAIL', // Configure Gmail for email
  mode: 'MERGE',
  records: [
    // A record for root domain
    {
      hostname: '@',
      type: 'A',
      address: '203.0.113.1',
      ttl: 1800,
    },
    // CNAME for www subdomain
    {
      hostname: 'www',
      type: 'CNAME',
      address: 'example.com',
      ttl: 1800,
    },
    // Multiple MX records for redundancy
    {
      hostname: '@',
      type: 'MX',
      address: 'aspmx.l.google.com',
      mxPref: 1,
      ttl: 3600,
    },
    {
      hostname: '@',
      type: 'MX',
      address: 'alt1.aspmx.l.google.com',
      mxPref: 5,
      ttl: 3600,
    },
    // TXT record for domain verification
    {
      hostname: '@',
      type: 'TXT',
      address: 'google-site-verification=your-verification-string',
      ttl: 3600,
    },
  ],
})

// Export the domain records ID
export const domainRecordsId = domainRecords.domainRecordsId
```

### Using Custom Provider Instance

```typescript
import * as namecheap from 'pulumi-namecheap'

// Create a custom provider for sandbox testing
const sandboxProvider = new namecheap.Provider('sandbox-provider', {
  apiKey: 'your-sandbox-api-key',
  apiUser: 'your-api-user',
  userName: 'your-username',
  clientIp: 'your-client-ip',
  useSandbox: true,
})

// Use the custom provider
const testRecords = new namecheap.DomainRecords(
  'test-records',
  {
    domain: 'test-domain.com',
    records: [
      {
        hostname: 'test',
        type: 'A',
        address: '192.168.1.1',
        ttl: 300,
      },
    ],
  },
  { provider: sandboxProvider },
)
```

## Resources

### DomainRecords

Manages DNS records for a Namecheap domain.

#### Properties

- **domain** (Required): The domain name to manage records for
- **records** (Optional): Array of DNS record configurations
- **emailType** (Optional): Email service configuration (`NONE`, `MXE`, `MX`, `FWD`, `OX`, `GMAIL`)
- **mode** (Optional): How to handle existing records (`MERGE` or `OVERWRITE`)
- **nameservers** (Optional): Custom nameservers for the domain

#### Record Types

Each record in the `records` array supports:

- **hostname** (Required): The subdomain/hostname for the record
- **type** (Required): Record type (`A`, `AAAA`, `ALIAS`, `CAA`, `CNAME`, `MX`, `MXE`, `NS`, `TXT`, `URL`, `URL301`, `FRAME`)
- **address** (Required): The target IP address or hostname
- **ttl** (Optional): Time to live (60-60000 seconds)
- **mxPref** (Optional): MX record priority (required for MX records)

## API Reference

For detailed API documentation, see the generated documentation in your IDE or visit the [Pulumi Registry](https://www.pulumi.com/registry/).

## Authentication Setup

### Getting Your API Credentials

1. **Log in to Namecheap**: Go to your Namecheap account dashboard
2. **Enable API Access**: Navigate to Profile → Tools → Namecheap API Access
3. **Generate API Key**: Create a new API key for your application
4. **Whitelist IP**: Add your client IP address to the whitelist
5. **Note Your Details**: Save your API key, username, and API user name

### Testing in Sandbox

Namecheap provides a sandbox environment for testing. Set `useSandbox: true` in your provider configuration to use the sandbox API endpoints.

## Examples

You can find more examples in the [examples directory](./examples) or check out these common use cases:

- [Basic A/CNAME Records](./examples/basic-records)
- [Email Configuration](./examples/email-setup)
- [Multi-domain Management](./examples/multiple-domains)
- [Sandbox Testing](./examples/sandbox-testing)

## Support

This provider is a derived work of the [Terraform Provider](https://github.com/namecheap/terraform-provider-namecheap) distributed under [MPL 2.0](https://www.mozilla.org/en-US/MPL/2.0/).

If you encounter a bug or missing feature, please consult the source [`terraform-provider-namecheap` repo](https://github.com/namecheap/terraform-provider-namecheap/issues).

For Pulumi-specific issues, please open an issue in the [pulumi-any-terraform repository](https://github.com/hckhanh/pulumi-any-terraform).

## License

This package is distributed under the MIT License. The underlying Terraform provider is distributed under MPL 2.0.
