import { defineConfig } from 'tsdown'

export default defineConfig({
  platform: 'node',
  entry: ['./index.ts'],
  unbundle: true,
  dts: { tsgo: true },
  exports: true,
  outDir: 'bin',
  copy: ['package.json'],
})
