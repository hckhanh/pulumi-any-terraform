# Automation Scripts

This directory contains automation scripts for maintaining the Pulumi provider packages.

## check-updates.js

This script automatically checks for updates to Terraform providers and updates the corresponding Pulumi packages.

### How it works

1. **Scans packages**: Iterates through all packages in the `packages/` directory
2. **Extracts provider info**: Decodes the base64-encoded parameterization value to get the current provider version and registry URL
3. **Checks for updates**: Queries the OpenTofu registry API for the latest version of each provider
4. **Fetches changelogs**: Attempts to fetch release notes from GitHub if available
5. **Updates packages**: For packages with newer versions available:
   - Updates the `package.json` with new parameterization value
   - Adds an entry to `CHANGELOG.md` with release notes or a generic update message
6. **Creates release plan**: Uses `nx release plan` to prepare versioning for updated packages
7. **Stages changes**: Adds all changes to git staging area

### Usage

Manual execution:

```bash
node .github/scripts/check-updates.js
```

Automated execution via GitHub Actions:

- Runs weekly on Mondays at 00:00 UTC
- Can be triggered manually via workflow dispatch

### Output

The script produces:

- Updated `package.json` files with new provider versions
- Updated `CHANGELOG.md` files with release information
- Nx release plan files
- GitHub Actions outputs for PR creation

### Environment Variables

When running in GitHub Actions, the script uses:

- `GITHUB_OUTPUT`: To pass update information to subsequent workflow steps

### API Endpoints

- **OpenTofu Registry**: `https://registry.opentofu.org/v1/providers/{namespace}/{name}/versions`
- **GitHub Releases**: `https://api.github.com/repos/{namespace}/terraform-provider-{name}/releases/tags/v{version}`

### Error Handling

The script continues processing other packages if one fails, logging errors to console. It only exits with a non-zero status if the release plan creation fails.
