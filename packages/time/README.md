# Pulumi Time Provider

A Pulumi provider for managing time-based resources and operations, dynamically bridged from the [Terraform Time Provider](https://github.com/hashicorp/terraform-provider-time).

## Introduction

This package provides a Pulumi provider that enables you to manage time-based resources and operations using TypeScript, JavaScript, Python, Go, or C#. The provider is automatically generated from the Terraform Time provider, giving you access to all its functionality within the Pulumi ecosystem.

### Features

- **Time Delays**: Add configurable delays to resource operations
- **Time Offsets**: Calculate and manage time offsets for scheduling
- **Time Rotation**: Implement time-based rotation for secrets, certificates, and other resources
- **Static Time**: Create fixed timestamps for consistent resource references
- **Sleep Operations**: Add controlled pauses in resource provisioning workflows
- **TypeScript Support**: Full type safety with comprehensive TypeScript definitions

## Installation

### npm

```bash
npm install pulumi-time
```

### yarn

```bash
yarn add pulumi-time
```

### pnpm

```bash
pnpm add pulumi-time
```

## Configuration

The Time provider typically doesn't require explicit configuration as it operates on time-based calculations. However, you can customize behavior through provider options if needed.

### Setting Configuration

You can configure the provider in several ways:

#### 1. Provider Constructor

```typescript
import * as time from 'pulumi-time'

const provider = new time.Provider('time-provider', {
  // Provider-specific options if any
})
```

## Usage

### Adding Delays to Resource Operations

```typescript
import * as time from 'pulumi-time'

// Add a 30-second delay before proceeding
const delay = new time.Sleep('deployment-delay', {
  createDuration: '30s',
})

// Use the delay as a dependency for other resources
const myResource = new SomeResource(
  'my-resource',
  {
    // resource configuration
  },
  {
    dependsOn: [delay],
  },
)
```

### Time-based Rotation for Secrets

```typescript
import * as time from 'pulumi-time'

// Rotate every 30 days
const rotation = new time.Rotating('secret-rotation', {
  rotationDays: 30,
})

// Use the rotation time for certificate or secret renewal
const certificate = new SomeCertificate('my-cert', {
  validityPeriod: rotation.id,
  // other certificate configuration
})
```

### Static Timestamp References

```typescript
import * as time from 'pulumi-time'

// Create a static timestamp for consistent references
const timestamp = new time.Static('deployment-timestamp', {
  // The timestamp will be set when the resource is created
})

// Use the timestamp in resource tags or metadata
const resource = new SomeResource('tagged-resource', {
  tags: {
    'deployment-time': timestamp.unix,
    'deployment-rfc3339': timestamp.rfc3339,
  },
})
```

### Time Offsets for Scheduling

```typescript
import * as time from 'pulumi-time'

// Calculate a future time offset
const futureTime = new time.Offset('maintenance-window', {
  offsetDays: 7,
  offsetHours: 2,
})

// Use for scheduling maintenance windows or expiration times
const maintenanceSchedule = new SomeSchedule('maintenance', {
  startTime: futureTime.rfc3339,
  // other scheduling configuration
})
```

### Complex Time-based Workflows

```typescript
import * as time from 'pulumi-time'

// Step 1: Initial delay
const initialDelay = new time.Sleep('initial-setup-delay', {
  createDuration: '10s',
})

// Step 2: Create timestamp after delay
const setupTimestamp = new time.Static(
  'setup-timestamp',
  {},
  {
    dependsOn: [initialDelay],
  },
)

// Step 3: Set up rotation schedule
const certRotation = new time.Rotating('cert-rotation', {
  rotationDays: 90,
  rotationHours: 2, // Rotate at 2 AM
})

// Step 4: Use all time resources together
const secureResource = new SomeSecureResource(
  'secure-app',
  {
    deploymentTime: setupTimestamp.rfc3339,
    rotationSchedule: certRotation.id,
    // other configuration
  },
  {
    dependsOn: [initialDelay],
  },
)
```

## Resources

### Core Time Resources

- **Sleep**: Add delays to resource operations with configurable duration
- **Static**: Create static timestamps for consistent time references
- **Offset**: Calculate future or past time offsets from the current time
- **Rotating**: Implement time-based rotation schedules

### Common Use Cases

- **Deployment Delays**: Add controlled delays between deployment steps
- **Certificate Rotation**: Automate certificate renewal schedules
- **Secret Rotation**: Implement automatic secret rotation policies
- **Maintenance Windows**: Schedule maintenance operations
- **Resource Expiration**: Set expiration times for temporary resources
- **Timestamp Tagging**: Add consistent timestamps to resource metadata

## API Reference

For detailed API documentation, please refer to the [Pulumi Registry documentation](https://www.pulumi.com/registry/packages/time/) or the generated TypeScript definitions in your IDE.

## Examples

You can find more examples in the [examples directory](./examples) or check out these common use cases:

- [Basic Sleep Operations](./examples/basic-sleep)
- [Certificate Rotation](./examples/cert-rotation)
- [Deployment Delays](./examples/deployment-delays)
- [Time-based Scheduling](./examples/time-scheduling)

## Support

This provider is a derived work of the [Terraform Provider](https://github.com/hashicorp/terraform-provider-time) distributed under [MPL 2.0](https://www.mozilla.org/en-US/MPL/2.0/).

If you encounter a bug or missing feature, please consult the source [`terraform-provider-time` repo](https://github.com/hashicorp/terraform-provider-time/issues).

For Pulumi-specific issues, please open an issue in the [pulumi-any-terraform repository](https://github.com/hckhanh/pulumi-any-terraform).

## License

This package is distributed under the MIT License. The underlying Terraform provider is distributed under MPL 2.0.
