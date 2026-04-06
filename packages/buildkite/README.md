# Pulumi Buildkite Provider

A Pulumi provider for managing Buildkite CI/CD pipelines, agents, clusters, and team resources, dynamically bridged from the [Terraform Buildkite Provider](https://github.com/buildkite/terraform-provider-buildkite).

## Introduction

This package provides a Pulumi provider that enables you to manage your Buildkite CI/CD infrastructure using TypeScript, JavaScript, Python, Go, or C#. The provider is automatically generated from the Terraform Buildkite provider, giving you access to all its functionality within the Pulumi ecosystem.

### Features

- **Pipelines**: Create and manage CI/CD pipelines with steps, schedules, and webhooks
- **Clusters**: Organize agents into clusters with queues and secrets
- **Agent Tokens**: Manage agent registration tokens for connecting build agents
- **Teams**: Configure teams and manage team membership and pipeline access
- **Organizations**: Manage organization settings, rules, and banners
- **Pipeline Templates**: Create reusable pipeline templates for standardized workflows
- **Test Suites**: Set up and manage test analytics suites
- **Registries**: Configure package registries for artifact management
- **TypeScript Support**: Full type safety with comprehensive TypeScript definitions

## Installation

### npm

```bash
npm install pulumi-buildkite
```

### yarn

```bash
yarn add pulumi-buildkite
```

### pnpm

```bash
pnpm add pulumi-buildkite
```

### bun

```bash
bun add pulumi-buildkite
```

## Configuration

Before using the Buildkite provider, you need to configure your API credentials.

### Required Configuration

- **API Token**: Your Buildkite API access token with appropriate permissions
- **Organization**: Your Buildkite organization slug

### Environment Variables

```bash
export BUILDKITE_API_TOKEN="your-api-token-here"
export BUILDKITE_ORGANIZATION_SLUG="your-org-slug"
```

### Pulumi Configuration

```typescript
import * as pulumi from '@pulumi/pulumi'

const config = new pulumi.Config('buildkite')
config.require('apiToken')
config.require('organization')
```

Or using the Pulumi CLI:

```bash
pulumi config set buildkite:apiToken "your-api-token-here" --secret
pulumi config set buildkite:organization "your-org-slug"
```

## Quick Start

### Pipeline Example

```typescript
import * as pulumi from '@pulumi/pulumi'
import * as buildkite from 'pulumi-buildkite'

// Create a pipeline
const pipeline = new buildkite.Pipeline('my-app', {
  name: 'My Application',
  repository: 'https://github.com/myorg/myapp.git',
  defaultBranch: 'main',
  steps: `
steps:
  - label: ":hammer: Build"
    command: "npm run build"
  - label: ":test_tube: Test"
    command: "npm test"
`,
})

// Export the pipeline slug
export const pipelineSlug = pipeline.slug
```

### Cluster Example

```typescript
import * as pulumi from '@pulumi/pulumi'
import * as buildkite from 'pulumi-buildkite'

// Create a cluster for production agents
const prodCluster = new buildkite.Cluster('production', {
  name: 'Production',
  description: 'Cluster for production build agents',
})

// Create a queue within the cluster
const defaultQueue = new buildkite.ClusterQueue('default-queue', {
  clusterId: prodCluster.id,
  key: 'default',
  description: 'Default queue for production builds',
})

export const clusterId = prodCluster.id
```

### Team Example

```typescript
import * as pulumi from '@pulumi/pulumi'
import * as buildkite from 'pulumi-buildkite'

// Create a team
const devTeam = new buildkite.Team('developers', {
  name: 'Developers',
  privacy: 'VISIBLE',
  defaultMemberRole: 'MEMBER',
  isDefaultTeam: false,
})

// Assign pipeline access to the team
const pipelineAccess = new buildkite.PipelineTeam('dev-pipeline-access', {
  pipelineId: 'pipeline-id',
  teamId: devTeam.id,
  accessLevel: 'BUILD_AND_READ',
})

export const teamId = devTeam.id
```

## Available Resources

This provider supports the following Buildkite resources:

- **Pipeline**: Create and configure CI/CD pipelines
- **PipelineSchedule**: Set up scheduled builds for pipelines
- **PipelineTeam**: Manage team access to pipelines
- **PipelineTemplate**: Create reusable pipeline templates
- **PipelineWebhook**: Configure webhooks for pipeline events
- **Cluster**: Organize agents into clusters
- **ClusterAgentToken**: Manage agent tokens for clusters
- **ClusterDefaultQueue**: Set default queues for clusters
- **ClusterQueue**: Create queues within clusters
- **ClusterSecret**: Store secrets in clusters
- **ClusterMaintainer**: Assign cluster maintainers
- **Team**: Create and manage teams
- **TeamMember**: Manage team membership
- **AgentToken**: Create agent registration tokens
- **Organization**: Manage organization settings
- **OrganizationBanner**: Set organization-wide banners
- **OrganizationRule**: Configure organization rules
- **TestSuite**: Set up test analytics suites
- **TestSuiteTeam**: Manage team access to test suites
- **Registry**: Configure package registries
- **Portal**: Manage portals

## Data Sources

- **getCluster** / **getClusters**: Look up cluster information
- **getMeta**: Get Buildkite metadata
- **getOrganization**: Look up organization details
- **getOrganizationMember** / **getOrganizationMembers**: Look up organization members
- **getOrganizationRule**: Look up organization rules
- **getPipeline**: Look up pipeline details
- **getPipelineTemplate**: Look up pipeline templates
- **getPortal** / **getPortals**: Look up portals
- **getRegistry**: Look up registries
- **getSignedPipelineSteps**: Get signed pipeline steps
- **getTeam** / **getTeams**: Look up team details
- **getTestSuite**: Look up test suite details

## Advanced Usage

### Pipeline with Schedule

```typescript
import * as buildkite from 'pulumi-buildkite'

const pipeline = new buildkite.Pipeline('nightly-build', {
  name: 'Nightly Build',
  repository: 'https://github.com/myorg/myapp.git',
  defaultBranch: 'main',
  steps: `
steps:
  - label: ":night_with_stars: Nightly Build"
    command: "npm run build && npm run test:integration"
`,
})

const schedule = new buildkite.PipelineSchedule('nightly-schedule', {
  pipelineId: pipeline.id,
  label: 'Nightly at midnight UTC',
  cronline: '0 0 * * *',
  branch: 'main',
  enabled: true,
})
```

### Cluster with Secrets

```typescript
import * as buildkite from 'pulumi-buildkite'

const cluster = new buildkite.Cluster('ci-cluster', {
  name: 'CI Cluster',
  description: 'Main CI/CD cluster',
})

const secret = new buildkite.ClusterSecret('npm-token', {
  clusterId: cluster.id,
  key: 'NPM_TOKEN',
  value: 'your-npm-token',
})

const agentToken = new buildkite.ClusterAgentToken('ci-agent-token', {
  clusterId: cluster.id,
  description: 'Token for CI agents',
})
```

## Authentication

### Getting Your API Token

1. Log in to your Buildkite account
2. Navigate to **Personal Settings** → **API Access Tokens**
3. Click **New API Access Token**
4. Select the required scopes for your use case
5. Copy the generated token
6. Set it as an environment variable or Pulumi config:

```bash
# Environment variable
export BUILDKITE_API_TOKEN="bkua_your_api_token_here"

# Or Pulumi config (recommended)
pulumi config set buildkite:apiToken "bkua_your_api_token_here" --secret
```

## Documentation

For detailed documentation on all available resources and their properties, visit:

- [Buildkite Documentation](https://buildkite.com/docs)
- [Terraform Buildkite Provider](https://registry.terraform.io/providers/buildkite/buildkite/latest/docs)
- [Pulumi Documentation](https://www.pulumi.com/docs/)

## Troubleshooting

### Authentication Errors

If you encounter authentication errors:

1. Verify your API token is correct and not expired
2. Ensure your API token has the necessary scopes
3. Check that your organization slug is correctly configured
4. Confirm network connectivity to Buildkite's API

### Permission Errors

If you get `403 Forbidden` errors:

1. Verify your API token has the required scopes for the operation
2. Check that you have the appropriate role in the organization
3. Ensure team permissions allow the requested action

### Common Issues

**Issue**: `401 Unauthorized` error
**Solution**: Verify your API token is valid and properly configured

**Issue**: `404 Not Found` for pipelines or teams
**Solution**: Check that the organization slug is correct and the resource exists

**Issue**: Pipeline steps not parsing correctly
**Solution**: Ensure your YAML steps are properly formatted and indented

## Examples

For more examples, check out the [examples directory](https://github.com/hckhanh/pulumi-any-terraform/tree/main/examples) in the repository.

## Contributing

Contributions are welcome! Please read the [Contributing Guide](https://github.com/hckhanh/pulumi-any-terraform/blob/main/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Support

- **Issues**: [GitHub Issues](https://github.com/hckhanh/pulumi-any-terraform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/hckhanh/pulumi-any-terraform/discussions)
- **Buildkite Community**: [Buildkite Community Forum](https://forum.buildkite.community/)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/hckhanh/pulumi-any-terraform/blob/main/LICENSE) file for details.

## Acknowledgments

- [Buildkite](https://buildkite.com/) for building a powerful CI/CD platform
- [Terraform Buildkite Provider](https://github.com/buildkite/terraform-provider-buildkite) maintainers
- [Pulumi](https://www.pulumi.com/) for the infrastructure as code platform
- The open-source community for continuous support and contributions

## Related Projects

- [Buildkite](https://github.com/buildkite) - CI/CD platform
- [Pulumi Terraform Bridge](https://github.com/pulumi/pulumi-terraform-bridge) - Bridge technology
- [Other Pulumi Providers](https://github.com/hckhanh/pulumi-any-terraform) - More bridged providers

---

**Part of the [Pulumi Any Terraform](https://github.com/hckhanh/pulumi-any-terraform) collection**
