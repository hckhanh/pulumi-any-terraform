import type { CreateNodesResult } from '@nx/devkit'
import { Plugin } from './utils/plugin.ts'
import { dirname } from 'node:path'

class OxfmtPlugin extends Plugin {
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
            'oxfmt:check': {
              command:
                'pnpm oxfmt --check --no-error-on-unmatched-pattern {projectRoot}',
              inputs: ['oxfmt'],
              cache: true,
              metadata: {
                description: 'Check source files for formatting issues.',
                technologies: ['oxfmt'],
              },
            },
            'oxfmt:write': {
              command:
                'pnpm oxfmt --no-error-on-unmatched-pattern {projectRoot}',
              inputs: ['oxfmt'],
              cache: true,
              metadata: {
                description: 'Fix formatting issues in source files.',
                technologies: ['oxfmt'],
              },
            },
          },
        },
      },
    }
  }
}

const plugin = new OxfmtPlugin()
export const { createNodes } = plugin
