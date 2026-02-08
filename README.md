# Pulumi Any Terraform

> **Use any Terraform provider with Pulumi**  
> Full type safety • Multi-language support • Seamless integration

A collection of dynamically bridged Pulumi providers that enable you to use any Terraform provider within the Pulumi ecosystem. This repository provides seamless integration between Terraform providers and Pulumi, allowing you to leverage the extensive Terraform provider ecosystem while enjoying Pulumi's modern infrastructure-as-code experience.

[![autofix enabled](https://shields.io/badge/autofix.ci-yes-success?logo=data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZmZmIiB2aWV3Qm94PSIwIDAgMTI4IDEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCB0cmFuc2Zvcm09InNjYWxlKDAuMDYxLC0wLjA2MSkgdHJhbnNsYXRlKC0yNTAsLTE3NTApIiBkPSJNMTMyNSAtMzQwcS0xMTUgMCAtMTY0LjUgMzIuNXQtNDkuNSAxMTQuNXEwIDMyIDUgNzAuNXQxMC41IDcyLjV0NS41IDU0djIyMHEtMzQgLTkgLTY5LjUgLTE0dC03MS41IC01cS0xMzYgMCAtMjUxLjUgNjJ0LTE5MSAxNjl0LTkyLjUgMjQxcS05MCAxMjAgLTkwIDI2NnEwIDEwOCA0OC41IDIwMC41dDEzMiAxNTUuNXQxODguNSA4MXExNSA5OSAxMDAuNSAxODAuNXQyMTcgMTMwLjV0MjgyLjUgNDlxMTM2IDAgMjU2LjUgLTQ2IHQyMDkgLTEyNy41dDEyOC41IC0xODkuNXExNDkgLTgyIDIyNyAtMjEzLjV0NzggLTI5OS41cTAgLTEzNiAtNTggLTI0NnQtMTY1LjUgLTE4NC41dC0yNTYuNSAtMTAzLjVsLTI0MyAtMzAwdi01MnEwIC0yNyAzLjUgLTU2LjV0Ni41IC01Ny41dDMgLTUycTAgLTg1IC00MS41IC0xMTguNXQtMTU3LjUgLTMzLjV6TTEzMjUgLTI2MHE3NyAwIDk4IDE0LjV0MjEgNTcuNXEwIDI5IC0zIDY4dC02LjUgNzN0LTMuNSA0OHY2NGwyMDcgMjQ5IHEtMzEgMCAtNjAgNS41dC01NCAxMi41bC0xMDQgLTEyM3EtMSAzNCAtMiA2My41dC0xIDU0LjVxMCA2OSA5IDEyM2wzMSAyMDBsLTExNSAtMjhsLTQ2IC0yNzFsLTIwNSAyMjZxLTE5IC0xNSAtNDMgLTI4LjV0LTU1IC0yNi41bDIxOSAtMjQydi0yNzZxMCAtMjAgLTUuNSAtNjB0LTEwLjUgLTc5dC01IC01OHEwIC00MCAzMCAtNTMuNXQxMDQgLTEzLjV6TTEyNjIgNjE2cS0xMTkgMCAtMjI5LjUgMzQuNXQtMTkzLjUgOTYuNWw0OCA2NCBxNzMgLTU1IDE3MC41IC04NXQyMDQuNSAtMzBxMTM3IDAgMjQ5IDQ1LjV0MTc5IDEyMXQ2NyAxNjUuNWg4MHEwIC0xMTQgLTc3LjUgLTIwNy41dC0yMDggLTE0OXQtMjg5LjUgLTU1LjV6TTgwMyA1OTVxODAgMCAxNDkgMjkuNXQxMDggNzIuNWwyMjEgLTY3bDMwOSA4NnE0NyAtMzIgMTA0LjUgLTUwdDExNy41IC0xOHE5MSAwIDE2NSAzOHQxMTguNSAxMDMuNXQ0NC41IDE0Ni41cTAgNzYgLTM0LjUgMTQ5dC05NS41IDEzNHQtMTQzIDk5IHEtMzcgMTA3IC0xMTUuNSAxODMuNXQtMTg2IDExNy41dC0yMzAuNSA0MXEtMTAzIDAgLTE5Ny41IC0yNnQtMTY5IC03Mi41dC0xMTcuNSAtMTA4dC00MyAtMTMxLjVxMCAtMzQgMTQuNSAtNjIuNXQ0MC41IC01MC41bC01NSAtNTlxLTM0IDI5IC01NCA2NS41dC0yNSA4MS41cS04MSAtMTggLTE0NSAtNzB0LTEwMSAtMTI1LjV0LTM3IC0xNTguNXEwIC0xMDIgNDguNSAtMTgwLjV0MTI5LjUgLTEyM3QxNzkgLTQ0LjV6Ii8+PC9zdmc+)](https://autofix.ci)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/badge/npm-packages-red)](https://www.npmjs.com/search?q=pulumi-)

## 🚀 Features

- **🔄 Full Terraform Compatibility** - Use any Terraform provider with Pulumi
- **📘 Complete Type Safety** - Full TypeScript definitions with IntelliSense
- **🌍 Multi-Language Support** - TypeScript, JavaScript, Python, Go, and C# (planned)
- **⚡ Dynamic Updates** - Auto-sync with upstream Terraform providers
- **🎯 Native Pulumi Experience** - Full integration with Pulumi's ecosystem
- **🔒 Secure by Design** - Pulumi secrets management and state encryption
- **📦 Production Ready** - Battle-tested bridge technology

## 📦 Available Providers

| Provider          | Package                | Description                         |
| ----------------- | ---------------------- | ----------------------------------- |
| **Better Uptime** | `pulumi-better-uptime` | Monitoring and incident management  |
| **Bunnynet**      | `pulumi-bunnynet`      | CDN and edge computing              |
| **Infisical**     | `pulumi-infisical`     | Secrets management                  |
| **Logtail**       | `pulumi-logtail`       | Log management and analytics        |
| **Namecheap**     | `pulumi-namecheap`     | Domain and DNS management           |
| **Portainer**     | `pulumi-portainer`     | Container management                |
| **PostHog**       | `pulumi-posthog`       | Product analytics and feature flags |
| **TeamCity**      | `pulumi-teamcity`      | CI/CD platform                      |
| **Time**          | `pulumi-time`          | Time-based resources                |

## ⚡ Quick Start

### Installation

Each package can be installed independently:

```bash
npm install pulumi-namecheap
# or
yarn add pulumi-namecheap
# or
pnpm add pulumi-namecheap
```

### Basic Usage

```typescript
import * as pulumi from '@pulumi/pulumi'
import * as namecheap from 'pulumi-namecheap'

// Configure provider (or use environment variables)
const config = new pulumi.Config('namecheap')

// Create a DNS record
const record = new namecheap.Record('www-record', {
  domain: 'example.com',
  hostname: 'www',
  type: 'A',
  address: '192.168.1.1',
  ttl: 300,
})

// Export the record ID
export const recordId = record.id
```

### Deploy

```bash
pulumi preview  # Preview changes
pulumi up       # Deploy infrastructure
```

## 📚 Documentation

Comprehensive documentation is available covering:

- **[Getting Started](docs/)** - Installation, configuration, and first steps
- **[Architecture](docs/)** - How the bridge works internally
- **[Provider Guides](docs/)** - Detailed guides for each provider
- **[Contributing](docs/)** - How to contribute new providers
- **[Troubleshooting](docs/)** - Common issues and solutions
- **[FAQ](docs/)** - Frequently asked questions

## 🏗️ Architecture

This project uses [Pulumi's Terraform Bridge](https://github.com/pulumi/pulumi-terraform-bridge) to automatically convert Terraform providers into native Pulumi providers:

```
Terraform Provider → Bridge → Pulumi Package → Your Infrastructure Code
```

Key components:

- **Nx Monorepo** - Efficient build orchestration
- **TypeScript** - Full type safety and IntelliSense
- **Automated CI/CD** - GitHub Actions with automated testing and publishing
- **Changesets** - Semantic versioning and release management

## 🛠️ Development

### Prerequisites

- Node.js 22.18.0 or later
- pnpm 10.14.0 or later
- Pulumi CLI 3.190.0 or later

### Setup

1. **Clone and install**:

   ```bash
   git clone https://github.com/hckhanh/pulumi-any-terraform.git
   cd pulumi-any-terraform
   pnpm install
   ```

2. **Verify setup**:
   ```bash
   pnpm run syncpack:check
   pnpm nx run-many -t check
   ```

### Common Tasks

```bash
# Install dependencies
pnpm install

# Check code quality
pnpm nx run-many -t check

# Fix formatting and linting
pnpm nx run-many -t fix

# Build all packages
pnpm nx run-many -t build

# Sync dependency versions
pnpm run syncpack:fix

# Format all code
pnpm run prettier:write
```

### Adding a New Provider

1. Create package directory structure
2. Configure `package.json` with proper metadata
3. Set up parameterization for Terraform provider
4. Write comprehensive documentation
5. Submit pull request

See the [Contributing Guide](docs/) for detailed instructions.

### Project Structure

```
pulumi-any-terraform/
├── packages/              # Provider packages
│   ├── better-uptime/    # Individual providers
│   ├── bunnynet/
│   ├── infisical/
│   ├── logtail/
│   ├── namecheap/
│   ├── portainer/
│   ├── teamcity/
│   └── time/
├── tools/                 # Build system plugins
│   ├── build.ts
│   ├── linter.ts
│   └── prettier.ts
├── docs/                  # Documentation site (Next.js)
├── .github/              # CI/CD workflows
├── nx.json               # Nx configuration
└── pnpm-workspace.yaml   # Workspace config
```

### CI/CD Pipeline

Automated workflows handle:

- **Testing**: Linting, type checking, and builds
- **Auto-fixing**: Prettier and Biome fixes
- **Dependency Updates**: Automated PRs for updates
- **Publishing**: Automatic releases to NPM
- **Security**: Aikido Safe Chain and vulnerability scanning

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

Please read our [Contributing Guide](docs/) for details on:

- Code standards
- Development workflow
- Adding new providers
- Testing requirements
- Release process

## 🐛 Troubleshooting

Common issues and solutions:

- **Installation fails**: Clear cache and retry
- **Type errors**: Update @pulumi/pulumi version
- **Authentication errors**: Check credentials and environment variables
- **Build failures**: Clear Nx cache with `pnpm nx reset`

See our [Troubleshooting Guide](docs/) for more help.

## 🔗 External Connections

This project integrates with:

- **[Terraform Registry](https://registry.terraform.io/)** - Source for provider schemas
- **[NPM Registry](https://www.npmjs.com/)** - Package distribution
- **[Pulumi Service](https://www.pulumi.com/)** - State management (optional)
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD automation
- **[Nx Cloud](https://nx.app/)** - Distributed caching
- **[Aikido Safe Chain](https://www.aikido.dev/)** - Dependency security
- **[Autofix.ci](https://autofix.ci/)** - Automated code fixes

## 📊 Project Stats

- **9 Providers** available
- **MIT Licensed** - Free and open source
- **Active Development** - Regular updates
- **Production Ready** - Used in real projects

## 🌟 Examples

### Multi-Provider Infrastructure

```typescript
import * as pulumi from '@pulumi/pulumi'
import * as namecheap from 'pulumi-namecheap'
import * as betteruptime from 'pulumi-better-uptime'

// DNS Configuration
const apiRecord = new namecheap.Record('api', {
  domain: 'example.com',
  hostname: 'api',
  type: 'A',
  address: '192.168.1.100',
})

// Monitoring
const monitor = new betteruptime.Monitor('api-monitor', {
  url: pulumi.interpolate`https://${apiRecord.hostname}.${apiRecord.domain}`,
  monitorType: 'status',
  checkFrequency: 60,
})

export const apiUrl = pulumi.interpolate`https://${apiRecord.hostname}.${apiRecord.domain}`
export const monitorId = monitor.id
```

## 🙏 Acknowledgments

This project is built on top of:

- **[Pulumi](https://www.pulumi.com/)** - Infrastructure as Code platform
- **[Terraform](https://www.terraform.io/)** - Provider ecosystem
- **[Nx](https://nx.dev/)** - Monorepo build system
- All the amazing Terraform provider maintainers

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Khánh Hoàng**

- Website: [khanh.id](https://www.khanh.id)
- Email: hi@khanh.id
- GitHub: [@hckhanh](https://github.com/hckhanh)

## 🔗 Links

- [Documentation](docs/)
- [NPM Packages](https://www.npmjs.com/search?q=pulumi-)
- [GitHub Repository](https://github.com/hckhanh/pulumi-any-terraform)
- [Issue Tracker](https://github.com/hckhanh/pulumi-any-terraform/issues)
- [Pulumi Documentation](https://www.pulumi.com/docs/)
- [Terraform Registry](https://registry.terraform.io/)

---

**⭐ If you find this project useful, please consider giving it a star on GitHub!**
