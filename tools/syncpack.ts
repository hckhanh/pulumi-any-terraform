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
            'syncpack:fix': {
              command: 'pnpm syncpack fix',
              inputs: ['syncpack:workspace'],
              cache: true,
              options: {
                source: '{projectRoot}/package.json',
              },
              metadata: {
                description:
                  'Fix every auto-fixable issue found by `syncpack lint`.',
                technologies: ['node'],
              },
            },
            'syncpack:format': {
              command:
                'pnpm syncpack format --source={projectRoot}/package.json || true',
              inputs: ['syncpack'],
              cache: true,
              dependsOn: ['syncpack:fix'],
              metadata: {
                description:
                  'Sort package.json fields into a predictable order and nested fields alphabetically.',
                technologies: ['node'],
              },
            },
            'syncpack:format:check': {
              command: 'pnpm syncpack format --check',
              inputs: ['syncpack'],
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
            'syncpack:lint': {
              command: 'pnpm syncpack lint',
              inputs: ['syncpack:workspace'],
              cache: true,
              options: {
                source: '{projectRoot}/package.json',
              },
              metadata: {
                description:
                  'Lint all versions and ranges and exit with `0` or `1` based on whether all files match your Syncpack configuration file.',
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
