import type { CreateNodesResult } from '@nx/devkit'
import { Plugin } from './utils/plugin'
import { dirname } from 'node:path'

class BuildPlugin extends Plugin {
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
            build: {
              command: 'node ./scripts/postinstall.js',
              inputs: ['sources', { externalDependencies: ['typescript'] }],
              options: { cwd: '{projectRoot}' },
              metadata: {
                description: 'Builds the project with `postinstall.js` script.',
              },
            },
          },
        },
      },
    }
  }
}

const plugin = new BuildPlugin()
export const { createNodesV2 } = plugin
