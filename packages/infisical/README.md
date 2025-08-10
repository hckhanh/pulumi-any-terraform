# Pulumi Infisical Provider

A Pulumi provider for managing Infisical secrets management platform, dynamically bridged from the [Terraform Infisical Provider](https://github.com/infisical/terraform-provider-infisical).

## Introduction

This package provides a Pulumi provider that enables you to manage your Infisical secrets management platform using TypeScript, JavaScript, Python, Go, or C#. The provider is automatically generated from the Terraform Infisical provider, giving you access to all its functionality within the Pulumi ecosystem.

### Features

- **Secrets Management**: Create and manage secrets, folders, and tags across projects and environments
- **Identity & Authentication**: Configure multiple authentication methods (Universal Auth, AWS IAM, GCP, Azure, Kubernetes, OIDC)
- **Project Management**: Organize secrets with projects, environments, and role-based access control
- **Integrations**: Connect with cloud providers (AWS, GCP, Azure) and CI/CD platforms (CircleCI, Databricks)
- **Access Control**: Implement approval policies and fine-grained permissions
- **Secret Synchronization**: Sync secrets to external secret stores (AWS Parameter Store, Secrets Manager, Azure Key Vault, etc.)
- **TypeScript Support**: Full type safety with comprehensive TypeScript definitions

## Installation

### npm

```bash
npm install pulumi-infisical
```

### yarn

```bash
yarn add pulumi-infisical
```

### pnpm

```bash
pnpm add pulumi-infisical
```

## Configuration

Before using the provider, you need to configure authentication with your Infisical API credentials.

### Required Configuration

- **Host URL**: Your Infisical instance URL (e.g., `https://app.infisical.com`)
- **Service Token**: Service token for machine-to-machine authentication

### Optional Configuration

- **Universal Auth**: Client ID and secret for Universal Auth
- **AWS IAM Auth**: For AWS-based authentication
- **GCP Auth**: For Google Cloud authentication

### Setting Configuration

You can configure the provider in several ways:

#### 1. Using Pulumi Config

```bash
pulumi config set infisical:hostUrl https://app.infisical.com
pulumi config set --secret infisical:serviceToken your-service-token
```

#### 2. Using Environment Variables

```bash
export INFISICAL_HOST_URL="https://app.infisical.com"
export INFISICAL_SERVICE_TOKEN="your-service-token"
```

#### 3. Provider Constructor

```typescript
import * as infisical from 'pulumi-infisical'

const provider = new infisical.Provider('infisical-provider', {
  hostUrl: 'https://app.infisical.com',
  serviceToken: 'your-service-token',
})
```

## Usage

### Project and Environment Management

```typescript
import * as infisical from 'pulumi-infisical'

// Create a project
const project = new infisical.Project('my-app', {
  name: 'my-application',
  slug: 'my-app',
})

// Create environments
const devEnvironment = new infisical.ProjectEnvironment('dev-env', {
  projectId: project.id,
  name: 'development',
  slug: 'dev',
})

const prodEnvironment = new infisical.ProjectEnvironment('prod-env', {
  projectId: project.id,
  name: 'production',
  slug: 'prod',
})
```

### Secrets Management

```typescript
import * as infisical from 'pulumi-infisical'

// Create secret folders for organization
const apiFolder = new infisical.SecretFolder('api-secrets', {
  projectId: project.id,
  environmentSlug: 'dev',
  path: '/api',
  name: 'api-config',
})

const dbFolder = new infisical.SecretFolder('db-secrets', {
  projectId: project.id,
  environmentSlug: 'dev',
  path: '/database',
  name: 'database-config',
})

// Create secrets
const dbPassword = new infisical.Secret('db-password', {
  projectId: project.id,
  environmentSlug: 'dev',
  secretPath: '/database',
  secretName: 'DB_PASSWORD',
  secretValue: 'super-secret-password',
  type: 'shared',
})

const apiKey = new infisical.Secret('api-key', {
  projectId: project.id,
  environmentSlug: 'dev',
  secretPath: '/api',
  secretName: 'API_KEY',
  secretValue: 'your-api-key',
  type: 'shared',
})

// Create secret tags for categorization
const dbTag = new infisical.SecretTag('database-tag', {
  projectId: project.id,
  name: 'database',
  color: '#3b82f6',
})

const apiTag = new infisical.SecretTag('api-tag', {
  projectId: project.id,
  name: 'api',
  color: '#10b981',
})
```

### Identity and Authentication

```typescript
import * as infisical from 'pulumi-infisical'

// Create Universal Auth identity
const appIdentity = new infisical.Identity('app-identity', {
  name: 'my-application-identity',
  authMethod: 'universal-auth',
})

// Configure Universal Auth
const universalAuth = new infisical.IdentityUniversalAuth(
  'app-universal-auth',
  {
    identityId: appIdentity.id,
    clientSecretTrustedIps: [
      {
        ipAddress: '0.0.0.0/0',
      },
    ],
    accessTokenTrustedIps: [
      {
        ipAddress: '0.0.0.0/0',
      },
    ],
    accessTokenTtl: 3600,
    accessTokenMaxTtl: 7200,
  },
)

// Create client secret
const clientSecret = new infisical.IdentityUniversalAuthClientSecret(
  'app-client-secret',
  {
    identityId: appIdentity.id,
    description: 'Client secret for my application',
    ttl: 0, // No expiration
  },
)

// Create AWS IAM Auth identity
const awsIdentity = new infisical.Identity('aws-identity', {
  name: 'aws-iam-identity',
  authMethod: 'aws-auth',
})

const awsAuth = new infisical.IdentityAwsAuth('aws-auth-config', {
  identityId: awsIdentity.id,
  type: 'iam',
  allowedPrincipalArns: ['arn:aws:iam::123456789012:role/MyRole'],
  allowedAccountIds: ['123456789012'],
  accessTokenTtl: 3600,
  accessTokenMaxTtl: 7200,
})
```

### Project Access Control

```typescript
import * as infisical import "pulumi-infisical";

// Create custom project role
const projectRole = new infisical.ProjectRole("api-role", {
    projectId: project.id,
    name: "API Access Role",
    description: "Role for API service access",
    slug: "api-access",
    permissions: [
        {
            action: "read",
            subject: "secrets",
            conditions: {
                environment: "dev",
                secretPath: "/api/*",
            },
        },
        {
            action: "create",
            subject: "secrets",
            conditions: {
                environment: "dev",
                secretPath: "/api/*",
            },
        },
    ],
});

// Assign identity to project
const projectIdentity = new infisical.ProjectIdentity("app-project-identity", {
    identityId: appIdentity.id,
    projectId: project.id,
    roles: [
        {
            roleSlug: projectRole.slug,
        },
    ],
});

// Create user in project (if managing users)
const projectUser = new infisical.ProjectUser("developer", {
    projectId: project.id,
    username: "developer@company.com",
    roles: [
        {
            roleSlug: "admin",
        },
    ],
});
```

### Cloud Provider Integrations

```typescript
import * as infisical from 'pulumi-infisical'

// AWS Parameter Store integration
const awsParameterStoreIntegration = new infisical.IntegrationAwsParameterStore(
  'aws-params',
  {
    integrationAuthId: 'your-aws-auth-id',
    projectId: project.id,
    environmentSlug: 'prod',
    secretPath: '/',
    region: 'us-east-1',
    parameters: [
      {
        name: '/myapp/database/password',
        secretName: 'DB_PASSWORD',
      },
      {
        name: '/myapp/api/key',
        secretName: 'API_KEY',
      },
    ],
  },
)

// AWS Secrets Manager integration
const awsSecretsManagerIntegration = new infisical.IntegrationAwsSecretsManager(
  'aws-secrets',
  {
    integrationAuthId: 'your-aws-auth-id',
    projectId: project.id,
    environmentSlug: 'prod',
    secretPath: '/',
    region: 'us-east-1',
    secrets: [
      {
        name: 'myapp-database-credentials',
        secretName: 'DB_PASSWORD',
      },
    ],
  },
)

// GCP Secret Manager integration
const gcpSecretManagerIntegration = new infisical.IntegrationGcpSecretManager(
  'gcp-secrets',
  {
    integrationAuthId: 'your-gcp-auth-id',
    projectId: project.id,
    environmentSlug: 'prod',
    secretPath: '/',
    secrets: [
      {
        secretName: 'API_KEY',
        gcpSecretName: 'api-key',
        gcpSecretId: 'projects/my-project/secrets/api-key',
      },
    ],
  },
)
```

### Secret Synchronization

```typescript
import * as infisical from 'pulumi-infisical'

// Sync secrets to AWS Parameter Store
const parameterStoreSync = new infisical.SecretSyncAwsParameterStore(
  'param-sync',
  {
    projectId: project.id,
    environmentSlug: 'prod',
    secretPath: '/api',
    region: 'us-east-1',
    parameterName: '/myapp/api/config',
    integrationId: 'your-integration-id',
  },
)

// Sync secrets to Azure Key Vault
const azureKeyVaultSync = new infisical.SecretSyncAzureKeyVault('azure-sync', {
  projectId: project.id,
  environmentSlug: 'prod',
  secretPath: '/database',
  keyVaultName: 'my-key-vault',
  secretName: 'database-password',
  integrationId: 'your-azure-integration-id',
})
```

### Access Approval Policies

```typescript
import * as infisical from 'pulumi-infisical'

// Create access approval policy
const approvalPolicy = new infisical.AccessApprovalPolicy(
  'prod-access-policy',
  {
    projectId: project.id,
    name: 'Production Access Policy',
    environmentSlug: 'prod',
    secretPath: '/*',
    approvals: 2,
    approvers: ['admin@company.com', 'security@company.com'],
    enforcementLevel: 'hard',
  },
)

// Create secret approval policy
const secretApprovalPolicy = new infisical.SecretApprovalPolicy(
  'secret-approval',
  {
    projectId: project.id,
    name: 'Secret Change Approval',
    environmentSlug: 'prod',
    secretPath: '/critical/*',
    approvals: 1,
    approvers: ['security@company.com'],
    enforcementLevel: 'soft',
  },
)
```

## Resources

### Project Management

- **Project**: Main project container
- **ProjectEnvironment**: Environment within a project (dev, staging, prod)
- **ProjectRole**: Custom roles with fine-grained permissions
- **ProjectUser**: User assignments to projects
- **ProjectIdentity**: Identity assignments to projects

### Secrets Management

- **Secret**: Individual secrets with values
- **SecretFolder**: Organizational folders for secrets
- **SecretTag**: Tags for categorizing secrets
- **SecretImport**: Import secrets between environments

### Identity & Authentication

- **Identity**: Base identity for authentication
- **IdentityUniversalAuth**: Universal authentication configuration
- **IdentityUniversalAuthClientSecret**: Client secrets for Universal Auth
- **IdentityAwsAuth**: AWS IAM authentication
- **IdentityGcpAuth**: Google Cloud authentication
- **IdentityAzureAuth**: Azure authentication
- **IdentityKubernetesAuth**: Kubernetes authentication
- **IdentityOidcAuth**: OIDC authentication

### Integrations

- **IntegrationAwsParameterStore**: AWS Systems Manager Parameter Store
- **IntegrationAwsSecretsManager**: AWS Secrets Manager
- **IntegrationGcpSecretManager**: Google Cloud Secret Manager
- **IntegrationCircleci**: CircleCI integration
- **IntegrationDatabricks**: Databricks integration

### Secret Synchronization

- **SecretSyncAwsParameterStore**: Sync to AWS Parameter Store
- **SecretSyncAwsSecretsManager**: Sync to AWS Secrets Manager
- **SecretSyncAzureKeyVault**: Sync to Azure Key Vault
- **SecretSyncGcpSecretManager**: Sync to GCP Secret Manager

### Access Control

- **AccessApprovalPolicy**: Approval requirements for access
- **SecretApprovalPolicy**: Approval requirements for secret changes

## API Reference

For detailed API documentation, see the generated documentation in your IDE or visit the [Pulumi Registry](https://www.pulumi.com/registry/).

## Authentication Setup

### Getting Your API Credentials

1. **Log in to Infisical**: Go to your Infisical instance
2. **Navigate to Settings**: Go to Organization Settings → Access Tokens
3. **Create Service Token**: Generate a new service token for machine access
4. **Universal Auth Setup**: For Universal Auth, create an identity and client credentials
5. **Cloud Provider Auth**: Configure AWS IAM, GCP, or Azure authentication as needed

### Testing Your Setup

```typescript
import * as infisical from 'pulumi-infisical'

// Test with a simple data source query
const projects = infisical.getProjects({})
const groups = infisical.getGroups({})
```

## Examples

You can find more examples in the [examples directory](./examples) or check out these common use cases:

- [Basic Secrets Management](./examples/basic-secrets)
- [Identity and Authentication Setup](./examples/identity-auth)
- [Cloud Provider Integrations](./examples/cloud-integrations)
- [Project Access Control](./examples/access-control)
- [Secret Synchronization](./examples/secret-sync)

## Support

This provider is a derived work of the [Terraform Provider](https://github.com/infisical/terraform-provider-infisical) distributed under [MPL 2.0](https://www.mozilla.org/en-US/MPL/2.0/).

If you encounter a bug or missing feature, please consult the source [`terraform-provider-infisical` repo](https://github.com/infisical/terraform-provider-infisical/issues).

For Pulumi-specific issues, please open an issue in the [pulumi-any-terraform repository](https://github.com/hckhanh/pulumi-any-terraform).

## License

This package is distributed under the MIT License. The underlying Terraform provider is distributed under MPL 2.0.
