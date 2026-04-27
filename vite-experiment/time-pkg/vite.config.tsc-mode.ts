import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { builtinModules } from 'node:module'

// "tsc-mode" attempt: preserveModules + no tree-shaking + per-file entries.
// Goal: get a 1:1 file mapping like tsc, with no constant inlining and no
// shared helper chunks.
const entries = {
  index: resolve(__dirname, 'src/index.ts'),
  offset: resolve(__dirname, 'src/offset.ts'),
  provider: resolve(__dirname, 'src/provider.ts'),
  rotating: resolve(__dirname, 'src/rotating.ts'),
  sleep: resolve(__dirname, 'src/sleep.ts'),
  static: resolve(__dirname, 'src/static.ts'),
  utilities: resolve(__dirname, 'src/utilities.ts'),
}

const externals = [
  '@pulumi/pulumi',
  /^@pulumi\/pulumi\//,
  'async-mutex',
  './package.json',
  /^\.\//,
  ...builtinModules,
  ...builtinModules.map((m) => `node:${m}`),
]

export default defineConfig({
  build: {
    target: 'es2016',
    outDir: 'dist-tsc-mode',
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    lib: {
      entry: entries,
      formats: ['cjs'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: externals,
      treeshake: false,
      output: {
        preserveModules: false,
        exports: 'named',
      },
    },
  },
})
