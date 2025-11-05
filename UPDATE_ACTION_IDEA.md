# Update Action Idea

This is the idea for update packages automatically.

## General Idea

It will check the update of the terraform provider and convert it to pulumi package by using a temporary pulumi project.

1. This will be an Github Action that run weekly to handle the process
2. The action will fetch the latest releases of the given github repo url
3. If there is a new version, it will update the according package
   1. The action will create a temp folder, initialize pulumi project with typescript template
   2. Then inside that temp folder, run `pulumi package add terraform-provider@v1.0.1 <namespace/name> <new-version>`
      * I think at this point, we need to get the latest version of the terraform package, try to figure out how to do this.
      * https://developer.hashicorp.com/terraform/registry/api-docs
      * I think we need to get the namespace and name of the terraform provider
   3. If the release has changelog content, use that content for the changelog of this package
   4. If not, just say "Update to version x.y.z"
4. Create a PR with the changes
   1. Update version plan `nx release plan --message="Markdown content here"`
   2. Commit the changes and push to a branch
   3. Create a PR with the changes
