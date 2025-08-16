# Pulumi Better Uptime Provider

A Pulumi provider for managing Better Uptime monitoring, alerting, and incident management resources, dynamically bridged from the [Terraform Better Uptime Provider](https://github.com/betterstackhq/terraform-provider-better-uptime).

## Introduction

This package provides a Pulumi provider that enables you to manage your Better Uptime monitoring infrastructure using TypeScript, JavaScript, Python, Go, or C#. The provider is automatically generated from the Terraform Better Uptime provider, giving you access to all its functionality within the Pulumi ecosystem.

### Features

- **Uptime Monitoring**: Create and manage website, API, and service monitors with detailed configurations
- **Incident Management**: Set up policies, severity levels, and on-call calendars for efficient incident response
- **Heartbeat Monitoring**: Monitor cron jobs, scheduled tasks, and background processes
- **Integrations**: Connect with popular tools like Slack, PagerDuty, Jira, Datadog, and more
- **Status Pages**: Create and manage public status pages for your services
- **Alert Routing**: Configure intelligent alert routing with escalation policies
- **TypeScript Support**: Full type safety with comprehensive TypeScript definitions

## Installation

### npm

```bash
npm install pulumi-better-uptime
```

### yarn

```bash
yarn add pulumi-better-uptime
```

### pnpm

```bash
pnpm add pulumi-better-uptime
```

## Configuration

Before using the Better Uptime provider, you need to configure your API token. You can obtain an API token from your [Better Uptime dashboard](https://betteruptime.com/users/tokens).

### Environment Variables

```bash
export BETTER_UPTIME_API_TOKEN="your-api-token-here"
```

### Pulumi Configuration

```bash
pulumi config set betteruptime:apiToken "your-api-token-here" --secret
```

## Usage

### Basic Monitor Setup

```typescript
import * as betteruptime from 'pulumi-better-uptime'

// Create a basic HTTP monitor
const websiteMonitor = new betteruptime.Monitor('website-monitor', {
  url: 'https://example.com',
  monitorType: 'status',
  checkFrequency: 60, // Check every minute
  requestTimeoutSeconds: 30,
  confirmationPeriod: 0,
  httpRequestHeaders: [
    {
      name: 'User-Agent',
      value: 'BetterUptime-Monitor',
    },
  ],
})

// Create a monitor group for organization
const productionGroup = new betteruptime.MonitorGroup('production-monitors', {
  name: 'Production Services',
  sortIndex: 1,
})
```

### Heartbeat Monitoring

```typescript
import * as betteruptime from 'pulumi-better-uptime'

// Create a heartbeat for cron job monitoring
const backupHeartbeat = new betteruptime.Heartbeat('backup-job', {
  name: 'Daily Backup Job',
  period: 86400, // 24 hours in seconds
  grace: 3600,   // 1 hour grace period
  emailReports: 'never',
})

// Create heartbeat group
const heartbeatGroup = new betteruptime.HeartbeatGroup('critical-jobs', {
  name: 'Critical Background Jobs',
  sortIndex: 1,
})
```

### Integration Setup

```typescript
import * as betteruptime from 'pulumi-better-uptime'

// Slack integration for notifications
const slackIntegration = new betteruptime.EmailIntegration('slack-alerts', {
  name: 'Slack Notifications',
  email: 'alerts@yourcompany.slack.com',
  policyId: policy.id,
})

// PagerDuty integration for escalation
const pagerdutyIntegration = new betteruptime.PagerdutyIntegration('pagerduty-escalation', {
  name: 'PagerDuty Escalation',
  integrationKey: 'your-pagerduty-integration-key',
  policyId: policy.id,
})
```

### Incident Management

```typescript
import * as betteruptime from 'pulumi-better-uptime'

// Create severity levels
const criticalSeverity = new betteruptime.Severity('critical', {
  name: 'Critical',
  emailNotifications: true,
  smsNotifications: true,
  pushNotifications: true,
  webhookNotifications: true,
})

// Create escalation policy
const policy = new betteruptime.Policy('primary-policy', {
  name: 'Primary Escalation Policy',
  teamWait: 300, // 5 minutes
  repeatCount: 2,
  incidentTemplate: 'We are investigating an issue with {{monitor_name}}.',
})

// Create on-call calendar
const onCallCalendar = new betteruptime.OnCallCalendar('dev-oncall', {
  name: 'Development Team On-Call',
  timeZone: 'UTC',
})
```

### Status Page Management

```typescript
import * as betteruptime from 'pulumi-better-uptime'

// Create a status page
const statusPage = new betteruptime.StatusPage('company-status', {
  companyName: 'Your Company',
  companyUrl: 'https://yourcompany.com',
  contactUrl: 'https://yourcompany.com/contact',
  subdomain: 'status',
  timezone: 'America/New_York',
  theme: 'default',
})

// Add sections to status page
const statusSection = new betteruptime.StatusPageSection('api-section', {
  statusPageId: statusPage.id,
  name: 'API Services',
  position: 1,
})

// Add resources to status page
const statusResource = new betteruptime.StatusPageResource('api-resource', {
  statusPageId: statusPage.id,
  statusPageSectionId: statusSection.id,
  monitorId: websiteMonitor.id,
  name: 'Main API',
  position: 1,
})
```

## Resources

### Core Monitoring

- **Monitor**: Website, API, and service monitoring with various check types
- **MonitorGroup**: Organize monitors into logical groups
- **Heartbeat**: Monitor cron jobs and scheduled tasks
- **HeartbeatGroup**: Organize heartbeats into logical groups

### Incident Management

- **Policy**: Define escalation policies for incident response
- **PolicyGroup**: Organize policies into groups
- **Severity**: Configure incident severity levels
- **SeverityGroup**: Group severity levels
- **OnCallCalendar**: Manage on-call schedules

### Integrations

- **EmailIntegration**: Email notifications
- **AwsCloudwatchIntegration**: AWS CloudWatch integration
- **AzureIntegration**: Microsoft Azure integration
- **DatadogIntegration**: Datadog integration
- **ElasticIntegration**: Elasticsearch integration
- **GoogleMonitoringIntegration**: Google Cloud Monitoring
- **GrafanaIntegration**: Grafana integration
- **JiraIntegration**: Jira issue tracking
- **NewRelicIntegration**: New Relic integration
- **PagerdutyIntegration**: PagerDuty escalation
- **PrometheusIntegration**: Prometheus monitoring
- **SplunkOncallIntegration**: Splunk On-Call integration

### Status Pages

- **StatusPage**: Public status pages for service status communication
- **StatusPageGroup**: Group status pages
- **StatusPageSection**: Sections within status pages
- **StatusPageResource**: Individual resources displayed on status pages

### Webhooks & Automation

- **IncomingWebhook**: Handle incoming webhooks
- **OutgoingWebhook**: Send notifications via webhooks

### Service Catalog

- **CatalogAttribute**: Service catalog attributes
- **CatalogRecord**: Service catalog records
- **CatalogRelation**: Service catalog relationships
- **Metadata**: Additional metadata for resources

## API Reference

For detailed API documentation, type definitions, and examples, please refer to the [API Reference documentation](https://www.pulumi.com/registry/packages/better-uptime/api-docs/).

## Authentication Setup

### Obtaining an API Token

1. Log in to your [Better Uptime account](https://betteruptime.com)
2. Navigate to **Account Settings** → **API tokens**
3. Click **Create API token**
4. Provide a name for your token and select appropriate permissions
5. Copy the generated token (it will only be shown once)

### Configuring the Provider

Set your API token using one of these methods:

#### Environment Variable (Recommended)
```bash
export BETTER_UPTIME_API_TOKEN="bt-abcd1234efgh5678ijkl9012mnop3456"
```

#### Pulumi Configuration
```bash
pulumi config set betteruptime:apiToken "bt-abcd1234efgh5678ijkl9012mnop3456" --secret
```

#### Provider Configuration in Code
```typescript
import * as betteruptime from 'pulumi-better-uptime'

const provider = new betteruptime.Provider('better-uptime', {
  apiToken: 'bt-abcd1234efgh5678ijkl9012mnop3456',
})

// Use the provider with resources
const monitor = new betteruptime.Monitor('my-monitor', {
  // ... configuration
}, { provider })
```

## Examples

You can find more examples in common use cases:

- **Basic Monitoring Setup**: HTTP/HTTPS website monitoring with email alerts
- **Comprehensive Incident Management**: Multi-level escalation with integrations
- **Heartbeat Monitoring**: Cron job and background service monitoring
- **Status Page Creation**: Public status pages with multiple service sections
- **Advanced Integrations**: PagerDuty, Slack, and other third-party integrations

## Support

This provider is a derived work of the [Terraform Provider](https://github.com/betterstackhq/terraform-provider-better-uptime) distributed under [MPL 2.0](https://www.mozilla.org/en-US/MPL/2.0/).

If you encounter a bug or missing feature, please consult the source [`terraform-provider-better-uptime` repo](https://github.com/betterstackhq/terraform-provider-better-uptime/issues).

For Pulumi-specific issues, please open an issue in the [pulumi-any-terraform repository](https://github.com/hckhanh/pulumi-any-terraform).

## License

This package is distributed under the MIT License. The underlying Terraform provider is distributed under MPL 2.0.
