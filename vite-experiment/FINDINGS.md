# Vite/Rolldown migration experiment

Goal: try building one Pulumi provider package (`packages/time`) with
`rolldown-vite` in library mode, then consume it from a sample CommonJS project,
to evaluate whether the repo should migrate from `tsc`.

Tooling: `rolldown-vite@7.3.1` (npm alias of `vite`), `typescript@5.9.3`,
`@pulumi/pulumi@3.232.0`, Node 22.22.2.

## Layout

- `time-pkg/` — copy of the `packages/time` source (`src/*.ts`) plus
  `vite.config.ts`, `tsconfig.json`, `tsconfig.dts.json`, `package.json`.
- `consumer/` — sample CommonJS consumer that imports `pulumi-time-vite` via a
  `file:` link and runs both a typecheck and a Node `require()` smoke test.

## Reproduce

```sh
# in time-pkg
pnpm install --ignore-workspace
pnpm build:vite           # rolldown-vite library build → dist/
pnpm build:dts || true    # tsc-only .d.ts emit (vite cannot do this)
cp package.json dist/package.json

# in consumer
pnpm install --ignore-workspace
pnpm typecheck            # passes (uses tsc-emitted .d.ts)
pnpm smoke                # FAILS at runtime
```

## What works

- TypeScript typecheck of the consumer passes — but only because the `.d.ts`
  files are emitted by `tsc`, not Vite. Vite library mode does not generate
  declarations; you would need `vite-plugin-dts` or a separate `tsc` pass
  (which is what this experiment does).

## What breaks

The Pulumi-generated source uses several CommonJS-specific patterns that
Rolldown's bundler does not preserve safely:

1. **Type-only re-exports without the `type` keyword.** `index.ts` does
   `export { OffsetArgs, OffsetState } from "./offset"` where these are
   `interface`s. Rolldown errors with `MISSING_EXPORT` because it cannot tell
   they are erased at runtime. `tsc` handles this natively. Worked around in
   this experiment by externalizing all relative imports (`/^\.\//`), which
   defeats the purpose of bundling.

2. **Tree-shaker inlines the `null` placeholder used by `lazyLoad`.** The
   generated pattern is:
   ```ts
   export const Offset: typeof import("./offset").Offset = null as any
   utilities.lazyLoad(exports, ["Offset"], () => require("./offset"))
   ```
   Rolldown sees `Offset` as a constant `null` and inlines it into the
   resource-construction switch in `index.ts`, producing literal
   `new null(name, void 0, { urn })` in `dist/index.js`. That throws
   `TypeError: null is not a constructor` the first time Pulumi reconstructs a
   resource from URN. Confirmed by `grep "new null" dist/index.js` (5 hits).

3. **Output filename / `require()` mismatch.** With `formats: ['cjs']` and
   `fileName: '*.cjs'`, Rolldown still emits `require("./offset")` (no
   extension). Node's CJS resolver does not try `.cjs`, only `.js`/`.json`/
   `.node`, so loading `dist/index.cjs` fails with `MODULE_NOT_FOUND`.
   Worked around by switching the output extension to `.js`.

4. **Unresolvable virtual-module specifier in shipped output.** Rolldown emits
   a shared chunk `dist/objectSpread2-*.js` whose first lines contain
   `require("\0@oxc-project+runtime@0.101.0/helpers/defineProperty.js")`.
   That leading `\0` is Rollup's internal marker for virtual modules — it
   must not appear in shipped artifacts. At runtime Node throws
   `MODULE_NOT_FOUND` on this specifier. This is a Rolldown bug for our
   pattern, with no clean configuration-only workaround.

5. **Unnecessary shared chunks.** Rolldown extracts `chunk-*.js` and
   `objectSpread2-*.js` for helpers and SWC-style `_objectSpread2`
   transforms even though we asked for one entry per file. `tsc` produces
   strictly per-file output with no extra files.

6. **No `.d.ts` generation.** Out of scope for Vite. We still have to run
   `tsc` for declarations, so a Vite migration adds a build step rather than
   replacing one.

## Baseline comparison (`tsc`)

```
$ node /tmp/baseline-smoke.cjs
exports keys:  [ 'Offset', 'Provider', 'Rotating', 'Sleep', 'Static' ]
typeof Offset   : function
typeof Sleep    : function
typeof Static   : function
typeof Rotating : function
typeof Provider : function
```

The current `tsc`-based build produces a working CommonJS package with no
post-processing beyond copying `package.json` into `bin/`.

## Followup: is there a "tsc mode" in Rolldown / Vite?

Three knobs were tried as a tsc-like fallback (see `vite.config.tsc-mode.ts`):

| Knob | Result |
|------|--------|
| `output.preserveModules: true` | Crashes Rolldown harder — it tries to write the virtual `\0@oxc-project+runtime/...` module to disk, OS rejects "file name contained an unexpected NUL byte" |
| `treeshake: false` | Build succeeds but `new null(...)` is **still** in the output. The inlining is not from tree-shaking; it's from oxc's transform pipeline folding `const Offset = null as any` into a literal and propagating it |
| Switch alias from `rolldown-vite` to plain `vite@8` (Rollup-backed) | **Identical bugs** — `new null(...)` × 5 in `dist/index.js`, same `\0@oxc-project+runtime@.../helpers/defineProperty.js` unresolved specifier in the helper chunk |

So the breakage is in **Vite's library mode + oxc transformer**, not in Rolldown specifically. There is no "tsc mode" that produces correct CJS for Pulumi's codegen pattern.

## Conclusion

The Pulumi codegen output is fundamentally CommonJS-shaped (lazy
`require("./X")`, mutated `exports`, `null` placeholders patched at runtime,
runtime `require('./package.json')`, type-only re-exports without the `type`
keyword). Vite/Rolldown's library mode is ESM-first and applies aggressive
tree-shaking and helper extraction that breaks every one of these patterns.
Even with workarounds (externalize all relative imports, rename `.cjs` to
`.js`, run a separate `tsc` pass for `.d.ts`), the resulting bundle is broken
at runtime (`new null(...)` and a `\0`-prefixed virtual specifier in shipped
JS).

**Recommendation: do not migrate.** Stay on `tsc` for `packages/*`. Revisit
only if Pulumi's codegen starts emitting ESM with proper `export type` / no
`lazyLoad` mutation, or if a future Rolldown release fixes the helper-chunk
and tree-shaking issues.
