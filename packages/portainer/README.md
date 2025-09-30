# Pulumi Portainer Provider

A Pulumi provider for managing Portainer container management platform resources, dynamically bridged from the [Terraform Portainer Provider](https://github.com/portainer/terraform-provider-portainer).

## Introduction

This package provides a Pulumi provider that enables you to manage your Portainer container management platform using TypeScript, JavaScript, Python, Go, or C#. The provider is automatically generated from the Terraform Portainer provider, giving you access to all its functionality within the Pulumi ecosystem.

### Features

- **Environment Management**: Create and manage Docker and Kubernetes environments
- **Stack Deployment**: Deploy and manage container stacks with Docker Compose or Kubernetes manifests
- **User & Team Management**: Configure users, teams, and access permissions
- **Registry Management**: Manage Docker registries and authentication
- **Edge Computing**: Deploy and manage edge environments and stacks
- **Resource Control**: Fine-grained access control for resources and teams
- **TypeScript Support**: Full type safety with comprehensive TypeScript definitions

## Installation

### npm

```bash
npm install pulumi-portainer
```

### yarn

```bash
yarn add pulumi-portainer
```

### pnpm

```bash
pnpm add pulumi-portainer
```

### bun

```bash
bun add pulumi-portainer
```

## Configuration

Before using the provider, you need to configure authentication with your Portainer instance.

### Required Configuration

- **URL**: Your Portainer instance URL
- **Username**: Your Portainer username
- **Password**: Your Portainer password

### Setting Configuration

You can configure the provider in several ways:

#### 1. Using Pulumi Config

```bash
pulumi config set portainer:url https://your-portainer-instance.com
pulumi config set portainer:username your-username
pulumi config set portainer:password your-password --secret
```

#### 2. Using Environment Variables

```bash
export PORTAINER_URL="https://your-portainer-instance.com"
export PORTAINER_USERNAME="your-username"
export PORTAINER_PASSWORD="your-password"
```

#### 3. Provider Constructor

```typescript
import * as portainer from 'pulumi-portainer'

const provider = new portainer.Provider('portainer-provider', {
  url: 'https://your-portainer-instance.com',
  username: 'your-username',
  password: 'your-password',
})
```

## Usage

### Environment Management

```typescript
import * as portainer from 'pulumi-portainer'

// Create a Docker environment
const dockerEnv = new portainer.Environment('docker-prod', {
  name: 'Docker Production',
  environmentUrl: 'unix:///var/run/docker.sock',
  environmentType: 1, // Docker environment
  publicUrl: 'docker-prod.example.com:2376',
})

// Create a Kubernetes environment
const k8sEnv = new portainer.Environment('k8s-cluster', {
  name: 'Kubernetes Production',
  environmentUrl: 'https://k8s.example.com:6443',
  environmentType: 2, // Kubernetes environment
  kubernetesConfig: {
    serverUrl: 'https://k8s.example.com:6443',
    token: 'your-k8s-token',
  },
})
```

### Stack Deployment

```typescript
import * as portainer from 'pulumi-portainer'

// Deploy a Docker Compose stack
const webStack = new portainer.Stack('web-application', {
  name: 'web-app',
  environmentId: dockerEnv.id,
  type: 2, // Docker Compose stack
  stackFileContent: `
version: '3.8'
services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    deploy:
      replicas: 2
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
  `,
})

// Deploy a Kubernetes stack
const k8sStack = new portainer.Stack('k8s-application', {
  name: 'k8s-app',
  environmentId: k8sEnv.id,
  type: 1, // Kubernetes stack
  stackFileContent: `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: nginx:alpine
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: web-service
spec:
  selector:
    app: web
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
  `,
})
```

### User and Team Management

```typescript
import * as portainer from 'pulumi-portainer'

// Create a user
const devUser = new portainer.User('developer', {
  username: 'john.developer',
  password: 'secure-password',
  role: 2, // Standard user role
})

// Create a team
const devTeam = new portainer.Team('development-team', {
  name: 'Development Team',
})

// Add user to team
const teamMembership = new portainer.TeamMembership('dev-team-membership', {
  teamId: devTeam.id,
  userId: devUser.id,
  role: 1, // Team leader role
})
```

### Registry Management

```typescript
import * as portainer from 'pulumi-portainer'

// Create a Docker Hub registry
const dockerHubRegistry = new portainer.Registry('dockerhub', {
  name: 'Docker Hub',
  type: 1, // Docker Hub
  url: 'docker.io',
  authentication: true,
  username: 'your-dockerhub-username',
  password: 'your-dockerhub-password',
})

// Create a private registry
const privateRegistry = new portainer.Registry('private-registry', {
  name: 'Private Registry',
  type: 3, // Custom registry
  url: 'registry.example.com',
  authentication: true,
  username: 'registry-user',
  password: 'registry-password',
})
```

### Resource Control and Access

```typescript
import * as portainer from 'pulumi-portainer'

// Create resource control for stack
const stackResourceControl = new portainer.ResourceControl('stack-access', {
  resourceId: webStack.id.apply((id) => `${dockerEnv.id}_${id}`),
  type: 'stack',
  public: false,
  teams: [devTeam.id],
  users: [],
})

// Create endpoint group
const endpointGroup = new portainer.EndpointGroup('production-group', {
  name: 'Production Environments',
  description: 'All production Docker and Kubernetes environments',
})

// Associate environment with group
const endpointAssociation = new portainer.EndpointAssociation(
  'env-group-assoc',
  {
    endpointId: dockerEnv.id,
    groupId: endpointGroup.id,
  },
)
```

### Edge Management

```typescript
import * as portainer from 'pulumi-portainer'

// Create edge group
const edgeGroup = new portainer.EdgeGroup('iot-devices', {
  name: 'IoT Edge Devices',
  dynamic: false,
  tagIds: [],
})

// Create edge stack
const edgeStack = new portainer.EdgeStack('iot-monitoring', {
  name: 'IoT Monitoring Stack',
  stackFileContent: `
version: '3.8'
services:
  monitoring-agent:
    image: monitoring/agent:latest
    restart: always
    environment:
      - ENDPOINT_URL=https://monitoring.example.com
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
  `,
  deploymentType: 0, // Compose stack
  edgeGroups: [edgeGroup.id],
})
```

## Resources

### Core Management

- **Environment**: Docker and Kubernetes environment management
- **Stack**: Container stack deployment and management
- **User**: User account management
- **Team**: Team and group management
- **TeamMembership**: Team membership assignments

### Registries and Authentication

- **Registry**: Docker registry configuration
- **DockerConfig**: Docker daemon configuration
- **Auth**: Authentication and access tokens

### Access Control

- **ResourceControl**: Resource access permissions
- **EndpointGroup**: Environment grouping
- **EndpointAssociation**: Environment-group associations
- **Settings**: Global Portainer settings

### Edge Computing

- **EdgeGroup**: Edge device groups
- **EdgeStack**: Edge deployments
- **EdgeJob**: Edge job management

### Monitoring and Operations

- **Webhook**: Webhook configurations
- **Tag**: Resource tagging
- **CustomTemplate**: Custom deployment templates

## API Reference

For detailed API documentation, see the generated documentation in your IDE or visit the [Pulumi Registry](https://www.pulumi.com/registry/).

## Authentication Setup

### Getting Your Credentials

1. **Access Portainer**: Navigate to your Portainer web interface
2. **Login**: Use your admin or user credentials
3. **API Access**: Generate API keys if needed from User Settings
4. **Environment URLs**: Note the URLs for your Docker/Kubernetes environments

### Testing Your Setup

```typescript
import * as portainer from 'pulumi-portainer'

// Test with a simple resource query
const environments = portainer.getEnvironments({})
```

## Examples

You can find more examples in common use cases:

- [Basic Environment Setup](./examples/basic-setup)
- [Multi-Stack Application](./examples/multi-stack-app)
- [Team and Access Management](./examples/team-management)
- [Edge Deployment](./examples/edge-deployment)
- [Registry Integration](./examples/registry-setup)

## Support

This provider is a derived work of the [Terraform Provider](https://github.com/portainer/terraform-provider-portainer) distributed under [MPL 2.0](https://www.mozilla.org/en-US/MPL/2.0/).

If you encounter a bug or missing feature, please consult the source [`terraform-provider-portainer` repo](https://github.com/portainer/terraform-provider-portainer/issues).

For Pulumi-specific issues, please open an issue in the [pulumi-any-terraform repository](https://github.com/hckhanh/pulumi-any-terraform).

## License

This package is distributed under the MIT License. The underlying Terraform provider is distributed under MPL 2.0.
