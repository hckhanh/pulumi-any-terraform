# Pulumi Any Terraform

A collection of dynamically bridged Pulumi providers that enable you to use any Terraform provider within the Pulumi ecosystem. This repository provides seamless integration between Terraform providers and Pulumi, allowing you to leverage the extensive Terraform provider ecosystem while enjoying Pulumi's modern infrastructure-as-code experience.

## Overview

This project automatically bridges Terraform providers to Pulumi, providing:

- **Full Terraform Compatibility**: Use any Terraform provider with Pulumi
- **Type Safety**: Complete TypeScript definitions for all resources
- **Multi-Language Support**: Generate providers for TypeScript, Python, Go, and C#
- **Dynamic Updates**: Automatically stay in sync with upstream Terraform providers
- **Native Pulumi Experience**: Full integration with Pulumi's state management and deployment engine

## Installation

Each package can be installed independently:

```bash
# For Namecheap provider
npm install pulumi-namecheap

# Or with yarn
yarn add pulumi-namecheap

# Or with pnpm
pnpm add pulumi-namecheap
```

## Maintenance Instructions

### Prerequisites

- Node.js 22.18.0
- pnpm 10.14.0
- Access to the repository with appropriate permissions

### Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hckhanh/pulumi-any-terraform.git
   cd pulumi-any-terraform
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Verify setup**:
   ```bash
   pnpm run syncpack:check
   ```

### Package Maintenance

#### Adding a New Provider

To add a new Terraform provider to this collection:

1. Create a new package directory under `packages/`:
   ```bash
   mkdir packages/your-provider
   cd packages/your-provider
   ```

2. Initialize the package structure following the pattern of existing packages:
   - `package.json` with appropriate metadata and dependencies
   - `README.md` with comprehensive documentation
   - Provider configuration and resource definitions

3. Update workspace configuration:
   - Add the package to `pnpm-workspace.yaml` if not already covered by the wildcard
   - Update `.syncpackrc.json` if needed for dependency management

#### Updating Existing Providers

1. **Update Terraform provider version**:
   - Modify the `parameterization.value` field in `package.json`
   - This base64-encoded value contains the provider configuration

2. **Update package version**:
   ```bash
   cd packages/your-provider
   # Update version in package.json
   pnpm version patch|minor|major
   ```

3. **Regenerate types and documentation** (if applicable):
   - Follow provider-specific regeneration steps
   - Update README.md with new features or changes

#### Quality Assurance

1. **Check dependency synchronization**:
   ```bash
   pnpm run syncpack:check
   ```

2. **Fix dependency issues** (if any):
   ```bash
   pnpm run syncpack:fix
   ```

3. **Format code**:
   ```bash
   pnpm run prettier:write
   ```

4. **Validate package configuration**:
   - Ensure all required fields are present in `package.json`
   - Verify `keywords`, `description`, and `repository` fields are accurate
   - Check that `files` array includes necessary distribution files

#### Release Process

1. **Prepare for release**:
   - Ensure all changes are committed
   - Update CHANGELOG.md (if maintained)
   - Run quality assurance checks

2. **Version management**:
   - Use semantic versioning for all packages
   - Coordinate version bumps across related packages if needed

3. **Publishing** (if applicable):
   - Follow npm publishing guidelines
   - Ensure proper access permissions
   - Verify package contents before publishing

### Repository Structure

```shell
├── packages/                 # Individual provider packages
│   └── namecheap/           # Namecheap provider package
│       ├── README.md        # Provider-specific documentation
│       ├── package.json     # Package configuration
│       └── ...             # Provider implementation files
├── .syncpackrc.json         # Dependency synchronization rules
├── pnpm-workspace.yaml      # Workspace configuration
├── package.json            # Root package configuration
└── README.md               # This file
```

### Troubleshooting

#### Common Issues

1. **Dependency conflicts**:
   - Run `pnpm run syncpack:check` to identify issues
   - Use `pnpm run syncpack:fix` to automatically resolve common problems

2. **Build failures**:
   - Check Node.js and pnpm versions match requirements
   - Ensure all dependencies are properly installed
   - Verify TypeScript configuration is correct

3. **Provider sync issues**:
   - Verify base64-encoded parameterization values are correct
   - Check that upstream Terraform provider versions are valid
   - Ensure network access to Terraform registry

#### Getting Help

- **Provider-specific issues**: Check individual provider README files
- **General issues**: Open an issue in this repository
- **Pulumi-related questions**: Consult [Pulumi documentation](https://www.pulumi.com/docs/)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes following the maintenance guidelines above
4. Run quality assurance checks
5. Commit your changes: `git commit -m 'Add your feature'`
6. Push to the branch: `git push origin feature/your-feature`
7. Open a pull request

## License

MIT - see individual package licenses for specific details.

## Author

**Khánh Hoàng**
- Email: hi@khanh.id
- Website: https://www.khanh.id
- GitHub: [@hckhanh](https://github.com/hckhanh)
