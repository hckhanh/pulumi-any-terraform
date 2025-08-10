# Pulumi Any Terraform

A Pulumi provider dynamically bridged from Terraform providers.

## Packages

- [`pulumi-namecheap`](./packages/namecheap) - A Pulumi provider for Namecheap

## Development

This project uses [Moon](https://moonrepo.dev) as a task runner and pnpm as package manager.

### Requirements

- Node.js 22.18.0
- pnpm 10.14.0
- Moon 1.39.4 (installed via proto)

### Setup

```bash
npm install
cd packages/namecheap && npm install
```

### Building

```bash
cd packages/namecheap && npx tsdown
```

### Linting

```bash
npx prettier --check .
npx syncpack lint
```

## CI/CD

This repository includes two GitHub Actions workflows:

### Test PR Workflow

- **Trigger**: Pull requests to main branch
- **File**: `.github/workflows/test-pr.yml`
- **Actions**: Lint code formatting and dependencies, build the project

### NPM Publishing Workflow

- **Trigger**: Release creation or manual dispatch
- **File**: `.github/workflows/publish-npm.yml`
- **Actions**: Build and publish packages to NPM with provenance
- **Requirements**: `NPM_TOKEN` secret must be configured in repository settings

## License

MIT
