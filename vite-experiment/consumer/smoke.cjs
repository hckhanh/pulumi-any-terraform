// Runtime smoke test: import the Vite-built package and verify that the
// lazy-loaded resource classes are actually constructable.
const time = require('pulumi-time-vite')

console.log('exports keys:', Object.keys(time).sort())
console.log('typeof Offset   :', typeof time.Offset)
console.log('typeof Sleep    :', typeof time.Sleep)
console.log('typeof Static   :', typeof time.Static)
console.log('typeof Rotating :', typeof time.Rotating)
console.log('typeof Provider :', typeof time.Provider)

// If any of the above is not "function", the package is broken — instantiating
// a resource would fail.
const broken = ['Offset', 'Sleep', 'Static', 'Rotating', 'Provider'].filter(
  (n) => typeof time[n] !== 'function',
)
if (broken.length > 0) {
  console.error('BROKEN exports (expected functions):', broken)
  process.exit(1)
}
console.log('OK: all resource classes are functions')
