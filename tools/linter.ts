import type { CreateNodesResult } from '@nx/devkit'
import { Plugin } from './utils/plugin.ts'
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
                'oxfmt:check',
                'root:syncpack:lint',
                'root:syncpack:format:check',
                'root:actionlint',
                'root:actions-lock',
                'root:zizmor',
              ],
              metadata: {
                description: 'Run all linters and checks for the project.',
                technologies: ['node', 'oxfmt', 'typescript'],
              },
            },
            fix: {
              dependsOn: [
                'biome:check:fix',
                'oxfmt:write',
                'root:syncpack:format',
              ],
              metadata: {
                description: 'Run all auto-fixable linters for the project.',
                technologies: ['node', 'oxfmt', 'typescript'],
              },
            },
          },
        },
      },
    }
  }
}

const plugin = new LinterPlugin()
export const { createNodes } = plugin
