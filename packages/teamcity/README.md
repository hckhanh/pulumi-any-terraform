# Pulumi TeamCity Provider

A Pulumi provider for managing TeamCity CI/CD platform, dynamically bridged from the [Terraform TeamCity Provider](https://github.com/jetbrains/terraform-provider-teamcity).

## Introduction

This package provides a Pulumi provider that enables you to manage your TeamCity CI/CD platform using TypeScript, JavaScript, Python, Go, or C#. The provider is automatically generated from the Terraform TeamCity provider, giving you access to all its functionality within the Pulumi ecosystem.

### Features

- **Project Management**: Create and organize build projects with hierarchical structures
- **Build Configurations**: Define and manage build configurations, triggers, and dependencies
- **VCS Integration**: Configure Version Control System roots and connections
- **User & Team Management**: Manage users, groups, roles, and permissions
- **Agent Pools**: Configure and manage build agent pools and licensing
- **Global Settings**: Configure server-wide settings, authentication, and email notifications
- **Security**: Manage SSH keys, secure tokens, and authentication methods
- **TypeScript Support**: Full type safety with comprehensive TypeScript definitions

## Installation

### npm

```bash
npm install pulumi-teamcity
```

### yarn

```bash
yarn add pulumi-teamcity
```

### pnpm

```bash
pnpm add pulumi-teamcity
```

## Configuration

Before using the provider, you need to configure authentication with your TeamCity server.

### Required Configuration

- **URL**: Your TeamCity server URL (e.g., `https://teamcity.example.com`)
- **Username**: TeamCity username with appropriate permissions
- **Password**: TeamCity password or access token

### Setting Configuration

You can configure the provider in several ways:

#### 1. Provider Constructor

```typescript
import * as teamcity from 'pulumi-teamcity'

const provider = new teamcity.Provider('teamcity-provider', {
  url: 'https://teamcity.example.com',
  username: 'admin',
  password: 'your-password-or-token',
})
```

#### 2. Environment Variables

```bash
export TEAMCITY_URL=https://teamcity.example.com
export TEAMCITY_USERNAME=admin
export TEAMCITY_PASSWORD=your-password-or-token
```

#### 3. Pulumi Configuration

```bash
pulumi config set teamcity:url https://teamcity.example.com
pulumi config set teamcity:username admin
pulumi config set teamcity:password your-password-or-token --secret
```

## Usage Examples

### Basic Project Setup

```typescript
import * as teamcity from 'pulumi-teamcity'

// Create a project
const project = new teamcity.Project('my-project', {
  name: 'My Application',
  projectId: 'MyApp',
  description: 'Main application project',
})

// Create a VCS root
const vcsRoot = new teamcity.Vcsroot('my-vcs', {
  name: 'Main Repository',
  vcsName: 'jetbrains.git',
  projectId: project.projectId,
  properties: {
    branch: 'refs/heads/main',
    url: 'https://github.com/example/my-app.git',
    authMethod: 'PASSWORD',
    username: 'git-user',
    password: 'git-token',
  },
})

// Create a build configuration
const buildConfig = new teamcity.BuildConfiguration('my-build', {
  name: 'Build and Test',
  projectId: project.projectId,
  vcsRoots: [
    {
      id: vcsRoot.id,
      checkoutRules: '+:. => source',
    },
  ],
  steps: [
    {
      type: 'simpleRunner',
      name: 'Build',
      properties: {
        script: 'npm install && npm run build',
      },
    },
  ],
})
```

### User and Team Management

```typescript
import * as teamcity from 'pulumi-teamcity'

// Create a user
const developer = new teamcity.User('developer', {
  username: 'john.doe',
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'secure-password',
})

// Create a group
const developersGroup = new teamcity.Group('developers', {
  name: 'Developers',
  description: 'Development team members',
})

// Add user to group
const groupMember = new teamcity.GroupMember('dev-member', {
  groupKey: developersGroup.key,
  username: developer.username,
})

// Assign role to user for a project
const projectRole = new teamcity.Role('project-developer', {
  roleId: 'PROJECT_DEVELOPER',
  scope: 'p:MyApp',
  username: developer.username,
})
```

### Agent Pool Configuration

```typescript
import * as teamcity from 'pulumi-teamcity'

// Create an agent pool
const pool = new teamcity.Pool('build-pool', {
  name: 'Build Agents',
  maxAgents: 5,
})
```

## Resource Types

This provider supports all TeamCity resource types including:

- **Projects**: `teamcity.Project`
- **Build Configurations**: `teamcity.BuildConfiguration`
- **VCS Roots**: `teamcity.Vcsroot`
- **Users**: `teamcity.User`
- **Groups**: `teamcity.Group`
- **Roles**: `teamcity.Role`
- **Agent Pools**: `teamcity.Pool`
- **Settings**: Various configuration resources

For a complete list of available resources and their properties, refer to the [Terraform TeamCity Provider documentation](https://registry.terraform.io/providers/jetbrains/teamcity/latest/docs).

## Data Sources

The provider also supports data sources for querying existing TeamCity resources:

- `teamcity.getBuildConfiguration`: Get build configuration details
- `teamcity.getPool`: Get agent pool information
- `teamcity.getServer`: Get server information
- `teamcity.getSshKey`: Get SSH key details

## Best Practices

1. **Use Projects for Organization**: Group related build configurations under projects
2. **Secure Credentials**: Always use secure storage for passwords and tokens
3. **Version Control Integration**: Link build configurations to VCS roots for automatic triggering
4. **Agent Pool Management**: Organize agents into pools based on capabilities and requirements
5. **Role-Based Access**: Use groups and roles to manage user permissions effectively

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Verify your TeamCity credentials and server URL
2. **Permission Denied**: Ensure your user account has sufficient permissions for the operations
3. **Connection Issues**: Check network connectivity and firewall rules

### Getting Help

- **TeamCity Documentation**: [Official TeamCity Documentation](https://www.jetbrains.com/help/teamcity/)
- **Provider Issues**: [Terraform TeamCity Provider Issues](https://github.com/jetbrains/terraform-provider-teamcity/issues)
- **Pulumi Community**: [Pulumi Community Slack](https://slack.pulumi.com/)

## License

This provider is licensed under the MIT License. The underlying Terraform provider is distributed under [MPL 2.0](https://www.mozilla.org/en-US/MPL/2.0/).

## Contributing

This provider is automatically generated from the Terraform TeamCity provider. For issues or feature requests, please:

1. Check if the issue exists in the [upstream Terraform provider](https://github.com/jetbrains/terraform-provider-teamcity/issues)
2. For provider-specific issues, create an issue in this repository
3. For general Pulumi questions, visit the [Pulumi Community](https://pulumi.com/community/)

---

> This provider is a derived work of the [Terraform Provider](https://github.com/jetbrains/terraform-provider-teamcity)
> distributed under [MPL 2.0](https://www.mozilla.org/en-US/MPL/2.0/). If you encounter a bug or missing feature,
> please consult the source [`terraform-provider-teamcity` repo](https://github.com/jetbrains/terraform-provider-teamcity/issues).
