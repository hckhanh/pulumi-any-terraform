import type { CreateNodesResult } from '@nx/devkit'
import { Plugin } from './utils/plugin'
import { dirname } from 'node:path'

class SyncpackPlugin extends Plugin {
  constructor() {
    super('**/package.json')
  }

  protected processFile(file: string): CreateNodesResult {
    const projectRoot = dirname(file)

    return {
      projects: {
        [projectRoot]: {
          root: projectRoot,
          targets: {
            'syncpack:format': {
              command:
                'pnpm syncpack format --source={projectRoot}/package.json || true',
              inputs: ['syncpack:format'],
              cache: true,
              dependsOn: ['root:syncpack:fix'],
              metadata: {
                description:
                  'Sort package.json fields into a predictable order and nested fields alphabetically.',
                technologies: ['node'],
              },
            },
            'syncpack:format:check': {
              command: 'pnpm syncpack format --check',
              inputs: ['syncpack:format'],
              cache: true,
              options: {
                source: '{projectRoot}/package.json',
              },
              metadata: {
                description:
                  'Lint formatting instead of fixing it and exit with a status code of 1 if issues are found.',
                technologies: ['node'],
              },
            },
          },
        },
      },
    }
  }
}

const plugin = new SyncpackPlugin()
export const { createNodesV2 } = plugin
