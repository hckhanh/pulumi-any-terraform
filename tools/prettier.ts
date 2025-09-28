import type { CreateNodesResult } from '@nx/devkit'
import { Plugin } from './utils/plugin'
import { dirname } from 'node:path'

class PrettierPlugin extends Plugin {
  constructor() {
    super('**/project.json')
  }

  protected processFile(file: string): CreateNodesResult {
    const projectRoot = dirname(file)

    return {
      projects: {
        [projectRoot]: {
          root: projectRoot,
          targets: {
            'prettier:check': {
              command: 'pnpm prettier --check {projectRoot}',
              inputs: ['prettier'],
              cache: true,
              metadata: {
                description: 'Check source files for formatting issues.',
                technologies: ['prettier'],
              },
            },
            'prettier:write': {
              command: 'pnpm prettier --write {projectRoot}',
              inputs: ['prettier'],
              dependsOn: ['oxlint:fix'],
              cache: true,
              metadata: {
                description: 'Fix formatting issues in source files.',
                technologies: ['prettier'],
              },
            },
          },
        },
      },
    }
  }
}

const plugin = new PrettierPlugin()
export const { createNodesV2 } = plugin
