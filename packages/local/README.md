# Pulumi Local Provider

A Pulumi provider for managing local files, directories, and sensitive files, dynamically bridged from the [Terraform Local Provider](https://github.com/hashicorp/terraform-provider-local).

## Introduction

This package provides a Pulumi provider that enables you to manage local filesystem resources using TypeScript, JavaScript, Python, Go, or C#. The provider is automatically generated from the Terraform Local provider, giving you access to all its functionality within the Pulumi ecosystem.

### Features

- **File Management**: Create and manage local files with specific content and permissions
- **Sensitive Files**: Handle files containing sensitive data with appropriate protections
- **File Reading**: Read existing local files as data sources
- **Command Execution**: Execute local commands and capture output
- **TypeScript Support**: Full type safety with comprehensive TypeScript definitions

## Installation

### npm

```bash
npm install pulumi-local
```

### yarn

```bash
yarn add pulumi-local
```

### pnpm

```bash
pnpm add pulumi-local
```

### bun

```bash
bun add pulumi-local
```

## Configuration

The Local provider typically doesn't require explicit configuration as it operates on the local filesystem.

## Quick Start

### File Example

```typescript
import * as pulumi from '@pulumi/pulumi'
import * as local from 'pulumi-local'

// Create a local file
const config = new local.File('app-config', {
  filename: '/tmp/config.json',
  content: JSON.stringify({
    environment: 'production',
    debug: false,
  }),
})

// Export the file path
export const configPath = config.filename
```

### Sensitive File Example

```typescript
import * as pulumi from '@pulumi/pulumi'
import * as local from 'pulumi-local'

// Create a file with sensitive content (restricted permissions)
const secretFile = new local.SensitiveFile('credentials', {
  filename: '/tmp/credentials.json',
  content: JSON.stringify({
    apiKey: 'secret-key-value',
    dbPassword: 'secret-password',
  }),
})
```

### Read File Example

```typescript
import * as pulumi from '@pulumi/pulumi'
import * as local from 'pulumi-local'

// Read an existing file
const existingConfig = local.getFile({
  filename: '/etc/hostname',
})

export const hostname = existingConfig.then((f) => f.content)
```

## Available Resources

This provider supports the following resources:

- **File**: Create and manage local files with content and permissions
- **SensitiveFile**: Create files containing sensitive data with restricted permissions

## Data Sources

- **getFile**: Read the content of an existing local file
- **getSensitiveFile**: Read the content of an existing sensitive file
- **getCommand**: Execute a local command and capture its output

## Advanced Usage

### Generate Configuration Files

```typescript
import * as pulumi from '@pulumi/pulumi'
import * as local from 'pulumi-local'

const stack = pulumi.getStack()

// Generate environment-specific config
const envConfig = new local.File('env-config', {
  filename: `.env.${stack}`,
  content: pulumi.interpolate`
NODE_ENV=${stack}
API_URL=https://api.${stack}.example.com
LOG_LEVEL=${stack === 'production' ? 'warn' : 'debug'}
`.apply((s) => s.trim()),
})
```

### Template Rendering

```typescript
import * as local from 'pulumi-local'

// Create an nginx config from a template
const nginxConfig = new local.File('nginx-config', {
  filename: '/etc/nginx/conf.d/app.conf',
  content: `
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
`,
})
```

### Execute Commands

```typescript
import * as local from 'pulumi-local'

// Execute a command and capture output
const gitCommit = local.getCommand({
  command: 'git rev-parse HEAD',
})
```

## Documentation

For detailed documentation on all available resources and their properties, visit:

- [Terraform Local Provider](https://registry.terraform.io/providers/hashicorp/local/latest/docs)
- [Pulumi Documentation](https://www.pulumi.com/docs/)

## Troubleshooting

### Permission Errors

If you encounter permission errors:

1. Verify the target directory exists and is writable
2. Check file permissions for the Pulumi process user
3. For sensitive files, ensure the process has appropriate privileges

### Common Issues

**Issue**: `ENOENT: no such file or directory`
**Solution**: Ensure the parent directory exists before creating files

**Issue**: `EACCES: permission denied`
**Solution**: Check directory and file permissions, run with appropriate privileges

**Issue**: File content not updating
**Solution**: Verify the content input has changed; Pulumi skips updates when inputs are identical

## Examples

For more examples, check out the [examples directory](https://github.com/hckhanh/pulumi-any-terraform/tree/main/examples) in the repository.

## Contributing

Contributions are welcome! Please read the [Contributing Guide](https://github.com/hckhanh/pulumi-any-terraform/blob/main/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Support

- **Issues**: [GitHub Issues](https://github.com/hckhanh/pulumi-any-terraform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/hckhanh/pulumi-any-terraform/discussions)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/hckhanh/pulumi-any-terraform/blob/main/LICENSE) file for details.

## Acknowledgments

- [HashiCorp](https://www.hashicorp.com/) for the Terraform Local provider
- [Terraform Local Provider](https://github.com/hashicorp/terraform-provider-local) maintainers
- [Pulumi](https://www.pulumi.com/) for the infrastructure as code platform
- The open-source community for continuous support and contributions

## Related Projects

- [Pulumi Terraform Bridge](https://github.com/pulumi/pulumi-terraform-bridge) - Bridge technology
- [Other Pulumi Providers](https://github.com/hckhanh/pulumi-any-terraform) - More bridged providers

---

**Part of the [Pulumi Any Terraform](https://github.com/hckhanh/pulumi-any-terraform) collection**
