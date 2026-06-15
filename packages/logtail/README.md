# Pulumi Logtail Provider

A Pulumi provider for managing Logtail log management and analytics resources, dynamically bridged from the [Terraform Logtail Provider](https://github.com/betterstackhq/terraform-provider-logtail).

## Introduction

This package provides a Pulumi provider that enables you to manage your Logtail logging infrastructure using TypeScript, JavaScript, Python, Go, or C#. The provider is automatically generated from the Terraform Logtail provider, giving you access to all its functionality within the Pulumi ecosystem.

### Features

- **Log Sources**: Create and manage log sources for collecting logs from various platforms and services
- **Source Groups**: Organize log sources into logical groups for better management
- **Metrics**: Define and configure custom metrics based on log data
- **Log Aggregation**: Centralized log collection and processing
- **Log Analytics**: Query and analyze log data with powerful search capabilities
- **TypeScript Support**: Full type safety with comprehensive TypeScript definitions

## Installation

### npm

```bash
npm install pulumi-logtail
```

### yarn

```bash
yarn add pulumi-logtail
```

### pnpm

```bash
pnpm add pulumi-logtail
```

## Configuration

Before using the Logtail provider, you need to configure your API token. You can obtain an API token from your [Logtail dashboard](https://logtail.com/api-tokens).

### Environment Variables

```bash
export LOGTAIL_API_TOKEN="your-api-token-here"
```

### Pulumi Configuration

```bash
pulumi config set logtail:apiToken "your-api-token-here" --secret
```

## Usage

### Log Source Management

```typescript
import * as logtail from 'pulumi-logtail'

// Create a log source for application logs
const appSource = new logtail.Source('app-logs', {
  name: 'Application Logs',
  platform: 'javascript',
  retentionDays: 30,
})

// Create a source for system logs
const systemSource = new logtail.Source('system-logs', {
  name: 'System Logs',
  platform: 'syslog',
  retentionDays: 90,
})

// Create a source for Docker container logs
const dockerSource = new logtail.Source('docker-logs', {
  name: 'Docker Container Logs',
  platform: 'docker',
  retentionDays: 14,
})
```

### Source Group Organization

```typescript
import * as logtail from 'pulumi-logtail'

// Create a source group for production environment
const productionGroup = new logtail.SourceGroup('production', {
  name: 'Production Environment',
  description: 'All log sources from production infrastructure',
})

// Create a source group for development environment
const developmentGroup = new logtail.SourceGroup('development', {
  name: 'Development Environment',
  description: 'Log sources for development and testing',
})

// Create sources within groups
const prodAppSource = new logtail.Source('prod-app', {
  name: 'Production Application',
  platform: 'javascript',
  retentionDays: 90,
  sourceGroupId: productionGroup.id,
})

const devAppSource = new logtail.Source('dev-app', {
  name: 'Development Application',
  platform: 'javascript',
  retentionDays: 7,
  sourceGroupId: developmentGroup.id,
})
```

### Custom Metrics Creation

```typescript
import * as logtail from 'pulumi-logtail'

// Create a metric to count error occurrences
const errorMetric = new logtail.Metric('error-count', {
  name: 'Error Count',
  description: 'Count of application errors',
  sourceId: appSource.id,
  query: 'level:error',
  aggregation: 'count',
  tags: ['environment:production', 'team:backend'],
})

// Create a metric for response time monitoring
const responseTimeMetric = new logtail.Metric('response-time', {
  name: 'Average Response Time',
  description: 'Average HTTP response time',
  sourceId: appSource.id,
  query: 'http.response_time > 0',
  aggregation: 'avg',
  field: 'http.response_time',
  tags: ['environment:production', 'team:backend'],
})

// Create a metric for tracking specific events
const userSignupMetric = new logtail.Metric('user-signups', {
  name: 'User Signups',
  description: 'Count of user registration events',
  sourceId: appSource.id,
  query: 'event:user_signup',
  aggregation: 'count',
  tags: ['environment:production', 'team:growth'],
})
```

### Advanced Log Source Configurations

```typescript
import * as logtail from 'pulumi-logtail'

// Create a source for AWS CloudWatch logs
const cloudwatchSource = new logtail.Source('cloudwatch-logs', {
  name: 'AWS CloudWatch Logs',
  platform: 'cloudwatch',
  retentionDays: 60,
  configuration: {
    region: 'us-east-1',
    logGroups: ['/aws/lambda/my-function', '/aws/apigateway/my-api'],
  },
})

// Create a source for Kubernetes logs
const k8sSource = new logtail.Source('kubernetes-logs', {
  name: 'Kubernetes Cluster Logs',
  platform: 'kubernetes',
  retentionDays: 30,
  configuration: {
    namespace: 'production',
    labelSelectors: ['app=web', 'tier=frontend'],
  },
})

// Create a source for database logs
const dbSource = new logtail.Source('database-logs', {
  name: 'PostgreSQL Logs',
  platform: 'postgresql',
  retentionDays: 45,
  configuration: {
    logLevel: 'info',
    includeStatements: true,
  },
})
```

### Linking an AWS Account

For `aws` platform sources, use `SourceAwsAccount` to connect the AWS account
that Better Stack pulls logs from. Connect a new account with the
`IntegrationRoleArn`/`ExternalId` outputs of the Better Stack CloudFormation
stack, or reuse an already-connected account by its `awsAccountId`:

```typescript
import * as logtail from 'pulumi-logtail'

// An AWS-platform source to attach the account to
const awsSource = new logtail.Source('aws-logs', {
  name: 'AWS Logs',
  platform: 'aws',
})

// Connect a new AWS account using the Better Stack CloudFormation outputs
const awsAccount = new logtail.SourceAwsAccount('aws-account', {
  sourceId: awsSource.id,
  awsRoleArn: 'arn:aws:iam::123456789012:role/BetterStackIntegration',
  awsExternalId: 'cf-stack-external-id',
})

// ...or reuse an account you've already connected
const reusedAccount = new logtail.SourceAwsAccount('aws-account-reuse', {
  sourceId: awsSource.id,
  awsAccountId: '123456789012',
})
```

### Log Analytics and Querying

```typescript
import * as logtail from 'pulumi-logtail'

// Create metrics for monitoring application health
const healthMetrics = [
  new logtail.Metric('4xx-errors', {
    name: '4XX HTTP Errors',
    description: 'Count of 4XX HTTP status codes',
    sourceId: appSource.id,
    query: 'http.status_code >= 400 AND http.status_code < 500',
    aggregation: 'count',
    alertThreshold: 100,
  }),

  new logtail.Metric('5xx-errors', {
    name: '5XX HTTP Errors',
    description: 'Count of 5XX HTTP status codes',
    sourceId: appSource.id,
    query: 'http.status_code >= 500',
    aggregation: 'count',
    alertThreshold: 10,
  }),

  new logtail.Metric('slow-queries', {
    name: 'Slow Database Queries',
    description: 'Count of slow database queries',
    sourceId: dbSource.id,
    query: 'duration > 1000',
    aggregation: 'count',
    alertThreshold: 50,
  }),
]
```

## Resources

### Core Resources

- **Source**: Log sources for collecting logs from various platforms and services
- **SourceAwsAccount**: Link an AWS account to an `aws` platform `Source`, either by reusing an already-connected account (`awsAccountId`) or by connecting a new one with the `awsRoleArn`/`awsExternalId` pair from the Better Stack CloudFormation stack. Added in 10.14.0.
- **SourceGroup**: Logical groups for organizing related log sources
- **Metric**: Custom metrics based on log data for monitoring and alerting
- **Collector**: Self-hosted agent that collects metrics from databases and processes inside your infrastructure. Supports multi-line log merging (`mergeLogs`/`mergeLogsConfig`) and disk-buffer tuning (`bufferMaxEvents`, plus an overflow policy of `dropNewest` or `block`), added in 10.14.2.
- **CollectorTarget**: Individual scrape target attached to a collector (postgres, pgbouncer, mysql, redis, mongodb, memcached, elasticsearch, nginx, apache, kafka, prometheus). Added in 10.11.3 and now the preferred way to configure collector targets instead of the deprecated `databases` field on `Collector`. The `pgbouncer` kind was added in 10.14.2.
- **Connection**: Connect external data sources for log ingestion
- **Dashboard / DashboardGroup / DashboardSection / DashboardChart / DashboardAlert**: Build and organize log dashboards and alerts
- **Exploration / ExplorationGroup / ExplorationAlert**: Saved log explorations and their alerts
- **ErrorsApplication / ErrorsApplicationGroup**: Application error tracking. `ErrorsApplication` exposes `correlateWithSourceId` to correlate errors with a specific log source and `githubRepositoryName` (added in 10.14.0) to link the application to a GitHub repository for source-level context.

### Data Sources

The provider exposes `get*` data sources for every resource above, including
`getSource`, `getSourceGroup`, `getMetric`, `getCollector`, `getConnection`,
`getDashboard`, `getDashboardTemplate`, `getExploration`, and
`getErrorsApplication`.

## API Reference

For detailed API documentation, type definitions, and examples, please refer to the [API Reference documentation](https://www.pulumi.com/registry/packages/logtail/api-docs/).

## Authentication Setup

### Obtaining an API Token

1. Log in to your [Logtail account](https://logtail.com)
2. Navigate to **Settings** → **API Tokens**
3. Click **Create API Token**
4. Provide a name for your token and select appropriate permissions
5. Copy the generated token (it will only be shown once)

### Configuring the Provider

Set your API token using one of these methods:

#### Environment Variable (Recommended)

```bash
export LOGTAIL_API_TOKEN="logtail-api-token"
```

#### Pulumi Configuration

```bash
pulumi config set logtail:apiToken "logtail-api-token" --secret
```

#### Provider Configuration in Code

```typescript
import * as logtail from 'pulumi-logtail'

const provider = new logtail.Provider('logtail', {
  apiToken: 'logtail-api-token',
})

// Use the provider with resources
const source = new logtail.Source(
  'my-source',
  {
    // ... configuration
  },
  { provider },
)
```

## Platform Support

Logtail supports log collection from various platforms and services:

### Application Platforms

- **JavaScript/Node.js**: Browser and server-side JavaScript applications
- **Python**: Python applications and scripts
- **Ruby**: Ruby applications and Rails
- **Go**: Go applications and services
- **Java**: Java applications and Spring Boot
- **PHP**: PHP applications and Laravel
- **.NET**: .NET Core and Framework applications

### Infrastructure Platforms

- **Docker**: Container logs from Docker environments
- **Kubernetes**: Pod and container logs from Kubernetes clusters
- **AWS CloudWatch**: Logs from AWS services and Lambda functions
- **Syslog**: System logs from servers and network devices
- **PostgreSQL**: Database logs and query logs
- **MySQL**: Database logs and slow query logs
- **Redis**: Redis server logs
- **Nginx**: Web server access and error logs
- **Apache**: Apache web server logs

### Cloud Services

- **AWS**: CloudWatch Logs, ELB, CloudFront, and other AWS services
- **Google Cloud**: Cloud Logging and other GCP services
- **Azure**: Azure Monitor and other Azure services
- **Heroku**: Application and system logs from Heroku dynos

## Examples

You can find more examples in common use cases:

- **Basic Log Collection**: Setting up log sources for web applications
- **Multi-Environment Setup**: Organizing logs across development, staging, and production
- **Metrics and Alerting**: Creating custom metrics for monitoring application health
- **Log Aggregation**: Centralized logging for microservices architecture
- **Platform Integration**: Connecting various platforms and services to Logtail

## Support

This provider is a derived work of the [Terraform Provider](https://github.com/betterstackhq/terraform-provider-logtail) distributed under [MPL 2.0](https://www.mozilla.org/en-US/MPL/2.0/).

If you encounter a bug or missing feature, please consult the source [`terraform-provider-logtail` repo](https://github.com/betterstackhq/terraform-provider-logtail/issues).

For Pulumi-specific issues, please open an issue in the [pulumi-any-terraform repository](https://github.com/hckhanh/pulumi-any-terraform).

## License

This package is distributed under the MIT License. The underlying Terraform provider is distributed under MPL 2.0.
