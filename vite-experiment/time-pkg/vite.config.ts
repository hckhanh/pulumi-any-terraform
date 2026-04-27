import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { builtinModules } from 'node:module'

// Mirror tsc's per-file output: each source file becomes its own entry so the
// lazy `require("./offset")` etc. continue to resolve at runtime.
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
  // Mirror tsc multi-file output: keep relative imports unbundled so each
  // entry stays independent and type-only re-exports pass through at runtime.
  /^\.\//,
  ...builtinModules,
  ...builtinModules.map((m) => `node:${m}`),
]

export default defineConfig({
  build: {
    target: 'es2016',
    outDir: 'dist',
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
      output: {
        preserveModules: false,
        exports: 'named',
      },
    },
  },
})
