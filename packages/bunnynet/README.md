# Pulumi Bunnynet Provider

A Pulumi provider for managing Bunny.net CDN and edge computing resources, dynamically bridged from the [Terraform Bunnynet Provider](https://github.com/bunnyway/terraform-provider-bunnynet).

## Introduction

This package provides a Pulumi provider that enables you to manage your Bunny.net CDN, storage, DNS, compute containers, and video streaming resources using TypeScript, JavaScript, Python, Go, or C#. The provider is automatically generated from the Terraform Bunnynet provider, giving you access to all its functionality within the Pulumi ecosystem.

### Features

- **Pull Zones (CDN)**: Create and manage CDN pull zones with edge rules, hostnames, and optimizer classes
- **Storage Management**: Manage storage zones and files for global content delivery
- **DNS Management**: Configure DNS zones and records for your domains
- **Compute Containers**: Deploy and manage container applications at the edge
- **Video Streaming**: Set up video libraries, collections, and streaming content
- **Edge Computing**: Configure compute scripts with variables and secrets
- **TypeScript Support**: Full type safety with comprehensive TypeScript definitions

## Installation

### npm

```bash
npm install pulumi-bunnynet
```

### yarn

```bash
yarn add pulumi-bunnynet
```

### pnpm

```bash
pnpm add pulumi-bunnynet
```

## Configuration

Before using the provider, you need to configure authentication with your Bunny.net API credentials.

### Required Configuration

- **API Key**: Your Bunny.net API key
- **Access Key**: Your storage access key (for storage operations)

### Setting Configuration

You can configure the provider in several ways:

#### 1. Using Pulumi Config

```bash
pulumi config set bunnynet:apiKey your-api-key
pulumi config set bunnynet:accessKey your-access-key
```

#### 2. Using Environment Variables

```bash
export BUNNYNET_API_KEY="your-api-key"
export BUNNYNET_ACCESS_KEY="your-access-key"
```

#### 3. Provider Constructor

```typescript
import * as bunnynet from 'pulumi-bunnynet'

const provider = new bunnynet.Provider('bunnynet-provider', {
  apiKey: 'your-api-key',
  accessKey: 'your-access-key',
})
```

## Usage

### Pull Zone Management

```typescript
import * as bunnynet from 'pulumi-bunnynet'

// Create a pull zone for CDN
const pullZone = new bunnynet.Pullzone('my-cdn', {
  name: 'my-website-cdn',
  originUrl: 'https://my-website.com',
  type: 'standard',
  storageZoneId: 12345,
  cacheControlMaxAge: 3600,
  cacheControlPublicMaxAge: 86400,
  addCanonicalHeader: true,
  enableGeoipCountryCode: true,
  enableOriginShield: true,
})

// Add a custom hostname
const hostname = new bunnynet.PullzoneHostname('custom-domain', {
  pullzoneId: pullZone.id,
  hostname: 'cdn.my-website.com',
  certificateId: 67890,
})

// Create edge rules
const edgeRule = new bunnynet.PullzoneEdgerule('cache-rule', {
  pullzoneId: pullZone.id,
  actionType: 'SetCacheTime',
  triggerType: 'RequestHeader',
  triggerValue: 'X-Cache-Control',
  actionParameter1: '3600',
})
```

### Storage Management

```typescript
import * as bunnynet from 'pulumi-bunnynet'

// Create a storage zone
const storageZone = new bunnynet.StorageZone('media-storage', {
  name: 'media-files',
  region: 'NY', // New York region
  replicationRegions: ['LA', 'SG'], // Los Angeles and Singapore replicas
})

// Upload files to storage
const file = new bunnynet.StorageFile('logo', {
  storageZoneName: storageZone.name,
  path: '/images/logo.png',
  source: './assets/logo.png',
  contentType: 'image/png',
})
```

### DNS Management

```typescript
import * as bunnynet from 'pulumi-bunnynet'

// Create DNS zone
const dnsZone = new bunnynet.DnsZone('my-domain', {
  domain: 'example.com',
  soaEmail: 'admin@example.com',
})

// Add DNS records
const aRecord = new bunnynet.DnsRecord('www-record', {
  zoneId: dnsZone.id,
  type: 'A',
  name: 'www',
  value: '203.0.113.1',
  ttl: 3600,
})

const cnameRecord = new bunnynet.DnsRecord('cdn-record', {
  zoneId: dnsZone.id,
  type: 'CNAME',
  name: 'cdn',
  value: 'b-cdn.net',
  ttl: 3600,
})
```

### Compute Container Applications

```typescript
import * as bunnynet from 'pulumi-bunnynet'

// Create container image registry
const registry = new bunnynet.ComputeContainerImageregistry('my-registry', {
  name: 'my-app-registry',
  imageUrl: 'docker.io/myorg/myapp:latest',
  username: 'myusername',
  password: 'mypassword',
})

// Deploy container app
const containerApp = new bunnynet.ComputeContainerApp('edge-app', {
  name: 'my-edge-app',
  imageRegistryId: registry.id,
  environmentVariables: [
    {
      name: 'NODE_ENV',
      value: 'production',
    },
    {
      name: 'API_URL',
      value: 'https://api.example.com',
    },
  ],
  cpu: 0.1,
  memory: 128,
})
```

### Video Streaming

```typescript
import * as bunnynet from 'pulumi-bunnynet'

// Create video library
const videoLibrary = new bunnynet.StreamLibrary('video-content', {
  name: 'my-video-library',
  storageZoneId: 12345,
  replicationRegions: ['NY', 'LA', 'SG'],
  watermarkPositionLeft: 10,
  watermarkPositionTop: 10,
  watermarkWidth: 100,
  watermarkHeight: 50,
})

// Create video collection
const collection = new bunnynet.StreamCollection('tutorials', {
  libraryId: videoLibrary.id,
  name: 'Tutorial Videos',
})

// Upload video
const video = new bunnynet.StreamVideo('intro-video', {
  libraryId: videoLibrary.id,
  title: 'Introduction Tutorial',
  collectionId: collection.id,
  // Video will be uploaded separately via API or dashboard
})
```

### Compute Scripts

```typescript
import * as bunnynet from 'pulumi-bunnynet'

// Create compute script
const script = new bunnynet.ComputeScript('edge-function', {
  name: 'my-edge-function',
  scriptType: 'standalone',
  code: `
        async function handleRequest(request) {
            const response = await fetch(request);
            const body = await response.text();
            
            // Add custom header
            const headers = new Headers(response.headers);
            headers.set('X-Processed-By', 'Bunny-Edge');
            
            return new Response(body, {
                status: response.status,
                headers: headers
            });
        }
        
        addEventListener('fetch', event => {
            event.respondWith(handleRequest(event.request));
        });
    `,
})

// Add script variables
const scriptVar = new bunnynet.ComputeScriptVariable('api-endpoint', {
  scriptId: script.id,
  name: 'API_ENDPOINT',
  value: 'https://api.example.com/v1',
})

// Add script secrets
const scriptSecret = new bunnynet.ComputeScriptSecret('api-key', {
  scriptId: script.id,
  name: 'API_KEY',
  value: 'secret-api-key-value',
})
```

## Resources

### Pull Zones

- **Pullzone**: Main CDN pull zone configuration
- **PullzoneHostname**: Custom domains for pull zones
- **PullzoneEdgerule**: Cache and routing rules
- **PullzoneOptimizerClass**: Image optimization settings

### Storage

- **StorageZone**: Global storage zones
- **StorageFile**: Individual file management

### DNS

- **DnsZone**: DNS zone management
- **DnsRecord**: Individual DNS records (A, AAAA, CNAME, MX, TXT, etc.)

### Compute

- **ComputeContainerApp**: Edge container applications
- **ComputeContainerImageregistry**: Container image registries
- **ComputeScript**: Edge computing scripts
- **ComputeScriptVariable**: Script environment variables
- **ComputeScriptSecret**: Script secrets

### Video Streaming

- **StreamLibrary**: Video libraries
- **StreamCollection**: Video collections
- **StreamVideo**: Individual videos

## API Reference

For detailed API documentation, see the generated documentation in your IDE or visit the [Pulumi Registry](https://www.pulumi.com/registry/).

## Authentication Setup

### Getting Your API Credentials

1. **Log in to Bunny.net**: Go to your Bunny.net dashboard
2. **Navigate to Account Settings**: Click on your profile → Account Settings
3. **Generate API Key**: Go to API section and create a new API key
4. **Storage Access Key**: For storage operations, get your access key from Storage → FTP & API Access
5. **Note Your Details**: Save your API key and access key securely

### Testing Your Setup

```typescript
import * as bunnynet from 'pulumi-bunnynet'

// Test with a simple resource query
const regions = bunnynet.getRegion({})
```

## Examples

You can find more examples in the [examples directory](./examples) or check out these common use cases:

- [Basic CDN Setup](./examples/basic-cdn)
- [Storage and File Management](./examples/storage-management)
- [DNS Configuration](./examples/dns-setup)
- [Edge Computing](./examples/edge-computing)
- [Video Streaming Platform](./examples/video-streaming)

## Support

This provider is a derived work of the [Terraform Provider](https://github.com/bunnyway/terraform-provider-bunnynet) distributed under [MPL 2.0](https://www.mozilla.org/en-US/MPL/2.0/).

If you encounter a bug or missing feature, please consult the source [`terraform-provider-bunnynet` repo](https://github.com/bunnyway/terraform-provider-bunnynet/issues).

For Pulumi-specific issues, please open an issue in the [pulumi-any-terraform repository](https://github.com/hckhanh/pulumi-any-terraform).

## License

This package is distributed under the MIT License. The underlying Terraform provider is distributed under MPL 2.0.
