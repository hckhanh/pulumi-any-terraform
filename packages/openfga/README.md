# Pulumi OpenFGA Provider

A Pulumi provider for managing [OpenFGA](https://openfga.dev) — a fine-grained, relationship-based authorization system inspired by [Google Zanzibar](https://research.google/pubs/pub48190/) — dynamically bridged from the [Terraform OpenFGA Provider](https://github.com/openfga/terraform-provider-openfga).

## Introduction

This package provides a Pulumi provider that lets you manage OpenFGA stores, authorization models, and relationship tuples using TypeScript, JavaScript, Python, Go, or .NET. The provider is automatically generated from the upstream Terraform provider, giving you the full surface area of OpenFGA Terraform resources within the Pulumi ecosystem.

### Features

- **Stores**: Create and manage logical containers for authorization models and tuples
- **Authorization Models**: Author models in either OpenFGA DSL or canonical JSON, with helper data sources to convert between formats
- **Relationship Tuples**: Manage `(user, relation, object)` facts, optionally pinned to a specific authorization model and gated by ABAC conditions
- **Two Authentication Modes**: Pre-shared API token (FGA cloud, self-hosted with shared secrets) or OAuth 2.0 client credentials (FGA cloud production)
- **Read-Side Data Sources**: Query `Check`, `ListObjects`, and `ListUsers` against any model offline, plus lookups for stores, models, and tuples
- **Self-Hosted Friendly**: Point at any OpenFGA-compatible API URL
- **TypeScript Support**: Full type safety with comprehensive TypeScript definitions

## Installation

### npm

```bash
npm install pulumi-openfga
```

### yarn

```bash
yarn add pulumi-openfga
```

### pnpm

```bash
pnpm add pulumi-openfga
```

### bun

```bash
bun add pulumi-openfga
```

## Configuration

Before using the provider, configure it with the URL of your OpenFGA server and credentials.

### Required Configuration

- **`apiUrl`**: URL of the OpenFGA server (e.g., `https://api.us1.fga.dev` for the FGA cloud US region, or your self-hosted URL)

### Authentication — pick one mode

#### API Token (recommended for self-hosted and quick start)

- **`apiToken`**: Pre-shared access token sent as `Authorization: Bearer <token>`

#### OAuth 2.0 Client Credentials (recommended for FGA cloud production)

- **`clientId`**, **`clientSecret`**: OAuth client credentials
- **`apiTokenIssuer`**: Token issuer URL or full token endpoint (e.g., `https://fga.us.auth0.com`)
- **`apiAudience`**: API audience for the token (e.g., `https://api.us1.fga.dev/`)
- **`apiScopes`**: Optional space-separated scope list

### Setting Configuration

You can configure the provider in several ways:

#### 1. Using Pulumi Config

```bash
# API token
pulumi config set openfga:apiUrl https://api.us1.fga.dev
pulumi config set --secret openfga:apiToken your-api-token

# Or OAuth client credentials
pulumi config set openfga:apiUrl https://api.us1.fga.dev
pulumi config set openfga:clientId your-client-id
pulumi config set --secret openfga:clientSecret your-client-secret
pulumi config set openfga:apiTokenIssuer https://fga.us.auth0.com
pulumi config set openfga:apiAudience https://api.us1.fga.dev/
```

#### 2. Using Environment Variables

```bash
export FGA_API_URL="https://api.us1.fga.dev"
export FGA_API_TOKEN="your-api-token"

# OAuth equivalents:
# export FGA_CLIENT_ID="..."
# export FGA_CLIENT_SECRET="..."
# export FGA_API_TOKEN_ISSUER="..."
# export FGA_API_AUDIENCE="..."
# export FGA_API_SCOPES="..."
```

#### 3. Provider Constructor

```typescript
import * as openfga from 'pulumi-openfga'

const provider = new openfga.Provider('openfga-provider', {
  apiUrl: 'https://api.us1.fga.dev',
  apiToken: 'your-api-token',
})
```

## Usage

### Stores and Authorization Models

```typescript
import * as openfga from 'pulumi-openfga'

// Create a store
const store = new openfga.Store('docs-app', {
  name: 'docs-app',
})

// Author the model in OpenFGA DSL and convert to canonical JSON
const modelDoc = openfga.getAuthorizationModelDocumentOutput({
  dsl: `
model
  schema 1.1

type user

type document
  relations
    define viewer: [user]
    define editor: [user]
    define owner: [user]
`,
})

// Apply the model to the store
const model = new openfga.AuthorizationModel('docs-app-model', {
  storeId: store.id,
  modelJson: modelDoc.result,
})

export const storeId = store.id
export const modelId = model.id
```

### Relationship Tuples

```typescript
import * as openfga from 'pulumi-openfga'

// alice can view document:readme (pinned to a specific model version)
const aliceCanView = new openfga.RelationshipTuple('alice-can-view-readme', {
  storeId: store.id,
  authorizationModelId: model.id,
  user: 'user:alice',
  relation: 'viewer',
  object: 'document:readme',
})

// Conditional tuple — only valid during business hours (ABAC)
const conditionalAccess = new openfga.RelationshipTuple('temp-editor', {
  storeId: store.id,
  authorizationModelId: model.id,
  user: 'user:bob',
  relation: 'editor',
  object: 'document:readme',
  condition: {
    name: 'within_business_hours',
    contextJson: JSON.stringify({ tz: 'UTC' }),
  },
})
```

### Read-Side Authorization Queries

```typescript
import * as openfga from 'pulumi-openfga'

// Check whether alice has the viewer relation on document:readme
const aliceCheck = openfga.getCheckQueryOutput({
  storeId: store.id,
  authorizationModelId: model.id,
  tupleKey: {
    user: 'user:alice',
    relation: 'viewer',
    object: 'document:readme',
  },
})

// List all documents alice can view
const aliceCanViewQuery = openfga.getListObjectsQueryOutput({
  storeId: store.id,
  authorizationModelId: model.id,
  type: 'document',
  user: 'user:alice',
  relation: 'viewer',
})

// List all users with viewer access to document:readme
const readmeViewers = openfga.getListUsersQueryOutput({
  storeId: store.id,
  authorizationModelId: model.id,
  object: { type: 'document', id: 'readme' },
  relation: 'viewer',
  userFilters: [{ type: 'user' }],
})

export const aliceAllowed = aliceCheck.allowed
export const aliceVisibleDocs = aliceCanViewQuery.objects
```

### Looking Up Existing State

```typescript
import * as openfga from 'pulumi-openfga'

// Discover all stores in the FGA instance
const allStores = openfga.getStoresOutput({})

// Fetch a specific store by id
const billingStore = openfga.getStoreOutput({ id: 'YOUR_STORE_ID' })

// Get the latest authorization model for a store
const latestModel = openfga.getAuthorizationModelsOutput({
  storeId: billingStore.id,
})
```

### Self-Hosted OpenFGA

```typescript
import * as pulumi from '@pulumi/pulumi'
import * as openfga from 'pulumi-openfga'

const selfHosted = new openfga.Provider('self-hosted', {
  apiUrl: 'https://openfga.your-domain.com',
  apiToken: pulumi.secret('your-token'),
})

const store = new openfga.Store(
  'app',
  { name: 'app' },
  { provider: selfHosted },
)
```

## Resources

### Core Resources

- **Store**: Logical container for an authorization model and its relationship tuples
- **AuthorizationModel**: The schema describing object types, relations, and rewrite rules
- **RelationshipTuple**: A single `(user, relation, object)` fact, optionally with ABAC condition

### Data Sources

- **getStore / getStores**: Look up a single store by id, or list all stores
- **getAuthorizationModel / getAuthorizationModels**: Fetch a specific model or list a store's models
- **getAuthorizationModelDocument**: Convert between OpenFGA DSL, canonical JSON, modular `fga.mod`, or structured model objects
- **getRelationshipTuple / getRelationshipTuples**: Read tuples from a store
- **getCheckQuery**: Evaluate a `Check` against a model — does `user` have `relation` on `object`?
- **getListObjectsQuery**: List all objects of a given type that a user has the relation on
- **getListUsersQuery**: List all users with a relation on a given object

## API Reference

For detailed API documentation, see the generated TypeScript definitions in your IDE, the [provider documentation site](https://pulumi.khanh.id/docs/providers/openfga), or the [upstream Terraform provider docs](https://registry.opentofu.org/openfga/openfga/latest/docs).

## Authentication Setup

### FGA Cloud (recommended for production)

1. **Create an FGA store** at <https://app.fga.dev>
2. **Create OAuth client credentials** in _Settings → Authentication Methods_
3. **Note your API URL, store ID, client id, client secret, token issuer, and audience**
4. Configure the provider with the OAuth client credentials shown above

### Self-Hosted OpenFGA

1. **Run an OpenFGA server** (binary, Docker image, or Helm chart — see <https://openfga.dev/docs/getting-started/setup-openfga>)
2. **Configure pre-shared keys** via `OPENFGA_AUTHN_METHOD=preshared` if you want token auth
3. Configure the provider with `apiUrl` (your server) and `apiToken` (your pre-shared key)

### Testing Your Setup

```typescript
import * as openfga from 'pulumi-openfga'

// List existing stores to confirm authentication works
const stores = openfga.getStoresOutput({})
export const storeNames = stores.stores.apply(
  (s) => s?.map((x) => x.name) ?? [],
)
```

## Support

This provider is a derived work of the [Terraform Provider](https://github.com/openfga/terraform-provider-openfga) distributed under [MPL 2.0](https://www.mozilla.org/en-US/MPL/2.0/).

If you encounter a bug or missing feature in the underlying provider, please consult the source [`terraform-provider-openfga` repo](https://github.com/openfga/terraform-provider-openfga/issues).

For Pulumi-specific issues, please open an issue in the [pulumi-any-terraform repository](https://github.com/hckhanh/pulumi-any-terraform).

## License

This package is distributed under the MIT License. The underlying Terraform provider is distributed under MPL 2.0.
