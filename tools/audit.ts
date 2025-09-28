import type { CreateNodesResult } from '@nx/devkit'
import { Plugin } from './utils/plugin'
import { dirname } from 'node:path'

class AuditPlugin extends Plugin {
  constructor() {
    super('**/*/tsconfig.json')
  }

  protected processFile(file: string): CreateNodesResult {
    const projectRoot = dirname(file)

    return {
      projects: {
        [projectRoot]: {
          root: projectRoot,
          targets: {
            audit: {
              command: 'npm audit signature --no-package-lock',
              inputs: ['{projectRoot}/package.json'],
              options: { cwd: '{projectRoot}' },
              metadata: {
                description:
                  'Ensure the integrity of packages you download from the public npm registry, or any registry that supports signatures',
                technologies: ['node'],
              },
            },
          },
        },
      },
    }
  }
}

const plugin = new AuditPlugin()
export const { createNodesV2 } = plugin
