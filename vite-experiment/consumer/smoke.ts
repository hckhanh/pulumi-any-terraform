// Type-level smoke test: import the package and check that the value classes
// and type re-exports are accessible from a TypeScript consumer.
import * as time from 'pulumi-time-vite'

// Value classes — these come from the lazy-loaded modules.
const _OffsetCtor: typeof time.Offset = time.Offset
const _SleepCtor: typeof time.Sleep = time.Sleep
const _StaticCtor: typeof time.Static = time.Static
const _RotatingCtor: typeof time.Rotating = time.Rotating
const _ProviderCtor: typeof time.Provider = time.Provider

// Type re-exports — these are erased at runtime, only used for typing.
type _OffsetArgs = time.OffsetArgs
type _SleepArgs = time.SleepArgs

// Reference to silence "unused" warnings in strict mode.
void [_OffsetCtor, _SleepCtor, _StaticCtor, _RotatingCtor, _ProviderCtor]

console.log('typecheck-only file')
