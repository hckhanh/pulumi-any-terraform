# Pulumi PostHog Provider

A Pulumi provider for managing PostHog analytics, product insights, and feature flag resources, dynamically bridged from the [Terraform PostHog Provider](https://github.com/PostHog/terraform-provider-posthog).

## Introduction

This package provides a Pulumi provider that enables you to manage your PostHog product analytics and feature flag infrastructure using TypeScript, JavaScript, Python, Go, or C#. The provider is automatically generated from the Terraform PostHog provider, giving you access to all its functionality within the Pulumi ecosystem.

### Features

- **Product Analytics**: Configure projects, cohorts, and insights for analyzing user behavior
- **Feature Flags**: Create and manage feature flags with rollout strategies and targeting rules
- **Event Actions**: Define custom actions to track specific user behaviors
- **Annotations**: Add context to your analytics with time-based annotations
- **Dashboards**: Build and maintain custom dashboards for data visualization
- **Experiments**: Run A/B tests and multivariate experiments
- **Session Recording**: Configure session recording settings and filters
- **TypeScript Support**: Full type safety with comprehensive TypeScript definitions

## Installation

### npm

```bash
npm install pulumi-posthog
```

### yarn

```bash
yarn add pulumi-posthog
```

### pnpm

```bash
pnpm add pulumi-posthog
```

### bun

```bash
bun add pulumi-posthog
```

## Configuration

Before using the PostHog provider, you need to configure your API credentials.

### Required Configuration

- **API Key**: Your PostHog Personal API Key
- **Host**: Your PostHog instance URL (e.g., `https://app.posthog.com` or your self-hosted URL)

### Environment Variables

```bash
export POSTHOG_API_KEY="your-api-key-here"
export POSTHOG_HOST="https://app.posthog.com"
```

### Pulumi Configuration

```typescript
import * as pulumi from '@pulumi/pulumi'

const config = new pulumi.Config('posthog')
config.require('apiKey')
config.require('host')
```

Or using the Pulumi CLI:

```bash
pulumi config set posthog:apiKey "your-api-key-here" --secret
pulumi config set posthog:host "https://app.posthog.com"
```

## Quick Start

### Feature Flag Example

```typescript
import * as pulumi from '@pulumi/pulumi'
import * as posthog from 'pulumi-posthog'

// Create a feature flag
const betaFeature = new posthog.FeatureFlag('beta-feature', {
  key: 'new-dashboard',
  name: 'New Dashboard Beta',
  active: true,
  filters: {
    groups: [
      {
        properties: [],
        rolloutPercentage: 25,
      },
    ],
  },
})

// Export the feature flag key
export const featureFlagKey = betaFeature.key
```

### Project Example

```typescript
import * as pulumi from '@pulumi/pulumi'
import * as posthog from 'pulumi-posthog'

// Create a new project
const project = new posthog.Project('analytics-project', {
  name: 'Production Analytics',
  isDemo: false,
})

// Export the project ID
export const projectId = project.id
```

### Action Example

```typescript
import * as pulumi from '@pulumi/pulumi'
import * as posthog from 'pulumi-posthog'

// Create a custom action to track button clicks
const buttonClickAction = new posthog.Action('button-click', {
  name: 'Checkout Button Click',
  description: 'Tracks when users click the checkout button',
  steps: [
    {
      event: '$autocapture',
      selector: '#checkout-button',
      url: '/cart',
    },
  ],
})

// Export the action ID
export const actionId = buttonClickAction.id
```

## Available Resources

This provider supports the following PostHog resources:

- **Projects**: Manage PostHog projects
- **Feature Flags**: Create and configure feature flags with targeting rules
- **Actions**: Define custom event actions
- **Cohorts**: Create user segments based on properties and behaviors
- **Annotations**: Add contextual markers to your analytics timeline
- **Dashboards**: Build custom dashboards
- **Insights**: Configure analytics insights
- **Webhooks**: Set up webhook integrations

## Advanced Usage

### Feature Flag with Complex Targeting

```typescript
import * as posthog from 'pulumi-posthog'

const advancedFlag = new posthog.FeatureFlag('advanced-targeting', {
  key: 'premium-features',
  name: 'Premium Features',
  active: true,
  filters: {
    groups: [
      {
        properties: [
          {
            key: 'plan',
            value: 'premium',
            type: 'person',
            operator: 'exact',
          },
        ],
        rolloutPercentage: 100,
      },
      {
        properties: [],
        rolloutPercentage: 10, // 10% rollout for non-premium users
      },
    ],
  },
  ensureExperienceContinuity: true,
})
```

### Multi-Resource Setup

```typescript
import * as pulumi from '@pulumi/pulumi'
import * as posthog from 'pulumi-posthog'

// Create a project
const project = new posthog.Project('app-project', {
  name: 'My Application',
})

// Create an action within the project
const signupAction = new posthog.Action(
  'signup-action',
  {
    name: 'User Signup',
    description: 'Tracks successful user signups',
    projectId: project.id,
    steps: [
      {
        event: 'signup_completed',
      },
    ],
  },
  { dependsOn: [project] }
)

// Create a cohort of users who signed up
const signupCohort = new posthog.Cohort(
  'signup-cohort',
  {
    name: 'Signed Up Users',
    projectId: project.id,
    filters: {
      properties: {
        type: 'AND',
        values: [
          {
            type: 'action',
            key: signupAction.id,
          },
        ],
      },
    },
  },
  { dependsOn: [signupAction] }
)

export const projectName = project.name
export const actionId = signupAction.id
export const cohortId = signupCohort.id
```

## Authentication

### Getting Your API Key

1. Log in to your PostHog instance
2. Navigate to **Settings** → **User** → **Personal API Keys**
3. Click **Create Personal API Key**
4. Copy the generated key
5. Set it as an environment variable or Pulumi config:

```bash
# Environment variable
export POSTHOG_API_KEY="phx_your_api_key_here"

# Or Pulumi config (recommended)
pulumi config set posthog:apiKey "phx_your_api_key_here" --secret
```

### Self-Hosted PostHog

If you're using a self-hosted PostHog instance, configure the host:

```bash
export POSTHOG_HOST="https://posthog.yourcompany.com"
# or
pulumi config set posthog:host "https://posthog.yourcompany.com"
```

## Documentation

For detailed documentation on all available resources and their properties, visit:

- [PostHog Documentation](https://posthog.com/docs)
- [Terraform PostHog Provider](https://registry.terraform.io/providers/PostHog/posthog/latest/docs)
- [Pulumi Documentation](https://www.pulumi.com/docs/)

## Troubleshooting

### Authentication Errors

If you encounter authentication errors:

1. Verify your API key is correct and not expired
2. Ensure your API key has the necessary permissions
3. Check that your host URL is correctly configured
4. Confirm network connectivity to your PostHog instance

### Resource Not Found

If resources aren't found after creation:

1. Check that you're using the correct project ID
2. Verify the resource was created successfully in the PostHog UI
3. Ensure your API key has access to the project

### Common Issues

**Issue**: `401 Unauthorized` error  
**Solution**: Verify your API key is valid and properly configured

**Issue**: `403 Forbidden` error  
**Solution**: Check that your API key has the required permissions for the operation

**Issue**: Resources not appearing in PostHog UI  
**Solution**: Wait a few moments for replication, or check if you're viewing the correct project

## Examples

For more examples, check out the [examples directory](https://github.com/hckhanh/pulumi-any-terraform/tree/main/examples) in the repository.

## Contributing

Contributions are welcome! Please read the [Contributing Guide](https://github.com/hckhanh/pulumi-any-terraform/blob/main/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Support

- **Issues**: [GitHub Issues](https://github.com/hckhanh/pulumi-any-terraform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/hckhanh/pulumi-any-terraform/discussions)
- **PostHog Community**: [PostHog Slack](https://posthog.com/slack)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/hckhanh/pulumi-any-terraform/blob/main/LICENSE) file for details.

## Acknowledgments

- [PostHog](https://posthog.com/) for building an amazing product analytics platform
- [Terraform PostHog Provider](https://github.com/PostHog/terraform-provider-posthog) maintainers
- [Pulumi](https://www.pulumi.com/) for the infrastructure as code platform
- The open-source community for continuous support and contributions

## Related Projects

- [PostHog](https://github.com/PostHog/posthog) - Open-source product analytics
- [Pulumi Terraform Bridge](https://github.com/pulumi/pulumi-terraform-bridge) - Bridge technology
- [Other Pulumi Providers](https://github.com/hckhanh/pulumi-any-terraform) - More bridged providers

---

**Part of the [Pulumi Any Terraform](https://github.com/hckhanh/pulumi-any-terraform) collection**
