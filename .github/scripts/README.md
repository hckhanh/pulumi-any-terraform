# Automation Scripts

This directory contains automation scripts for maintaining the Pulumi provider packages.

## check-updates.js

This script automatically checks for updates to Terraform providers and updates the corresponding Pulumi packages.

### How it works

1. **Scans packages**: Iterates through all packages in the `packages/` directory
2. **Extracts provider info**: Decodes the base64-encoded parameterization value to get the current provider version and registry URL
3. **Gets GitHub repository**: Queries the Terraform registry to get the source GitHub repository
4. **Fetches latest release**: Gets the latest release version and changelog from GitHub API
5. **Updates packages**: For packages with newer versions available:
   - Creates a temporary Pulumi project
   - Runs `pulumi package add terraform-provider namespace/name@version`
   - Copies generated TypeScript files to the package directory
   - Updates the `pulumi` property in `package.json` with new parameterization
6. **Creates release plan**: Uses `nx release plan` to prepare versioning and changelog updates
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

- **Terraform Registry**: `https://registry.terraform.io/v1/providers/{namespace}/{name}` - to get the GitHub repository URL
- **GitHub Releases**: `https://api.github.com/repos/{owner}/{repo}/releases/latest` - to get the latest version and changelog

### Error Handling

The script continues processing other packages if one fails, logging errors to console. It only exits with a non-zero status if the release plan creation fails.
