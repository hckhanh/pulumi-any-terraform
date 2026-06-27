import {
  AggregateCreateNodesError,
  type CreateNodes,
  type CreateNodesFunction,
  type CreateNodesResult,
} from '@nx/devkit'

export abstract class Plugin {
  private readonly projectFilePattern: string

  protected constructor(projectFilePattern: string) {
    this.projectFilePattern = projectFilePattern
  }

  private readonly createNodesFunction: CreateNodesFunction = (
    configFiles,
    _options,
    _context,
  ) => {
    const results: [file: string, value: CreateNodesResult][] = []
    const errors: [file: string, error: Error][] = []

    for (const file of configFiles) {
      try {
        const value = this.processFile(file)
        if (value) {
          results.push([file, value] as const)
        }
      } catch (error) {
        errors.push([file, error as Error] as const)
      }
    }

    if (errors.length) {
      throw new AggregateCreateNodesError(errors, results)
    }

    return results
  }

  protected abstract processFile(file: string): CreateNodesResult

  get createNodes(): CreateNodes {
    return [this.projectFilePattern, this.createNodesFunction]
  }
}
