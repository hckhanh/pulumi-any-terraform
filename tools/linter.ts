import type { CreateNodesResult } from '@nx/devkit'
import { Plugin } from './utils/plugin'
import { dirname } from 'node:path'

class LinterPlugin extends Plugin {
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
            check: {
              dependsOn: [
                'build',
                'prettier:check',
                'root:syncpack:lint',
                'root:syncpack:format:check',
              ],
              metadata: {
                description: 'Run all linters and checks for the project.',
                technologies: ['node', 'prettier', 'typescript'],
              },
            },
            fix: {
              dependsOn: [
                'biome:check:fix',
                'prettier:write',
                'root:syncpack:format',
              ],
              metadata: {
                description: 'Run all auto-fixable linters for the project.',
                technologies: ['node', 'prettier', 'typescript'],
              },
            },
          },
        },
      },
    }
  }
}

const plugin = new LinterPlugin()
export const { createNodesV2 } = plugin
