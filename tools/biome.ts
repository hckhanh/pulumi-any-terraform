import { dirname } from 'node:path'
import type { CreateNodesResult } from '@nx/devkit'
import { Plugin } from './utils/plugin'

class BiomePlugin extends Plugin {
  constructor() {
    super('**/biome.json')
  }

  protected processFile(file: string): CreateNodesResult {
    const projectRoot = dirname(file)

    return {
      projects: {
        [projectRoot]: {
          root: projectRoot,
          targets: {
            'biome:check': {
              command: 'biome check',
              inputs: ['biome'],
              dependsOn: ['^build'],
              cache: true,
              options: {
                cwd: '{projectRoot}',
              },
              metadata: {
                description:
                  'Runs formatter, linter and import sorting to the requested files.',
                technologies: ['typescript'],
              },
            },
            'biome:check:fix': {
              command: 'biome check --fix --verbose || true',
              inputs: ['biome'],
              dependsOn: ['^build'],
              cache: true,
              options: {
                cwd: '{projectRoot}',
              },
              metadata: {
                description:
                  'Command to use in CI environments. Runs formatter, linter and import sorting to the requested files.',
                technologies: ['typescript'],
              },
            },
          },
        },
      },
    }
  }
}

const plugin = new BiomePlugin()
export const { createNodesV2 } = plugin
