# Performance Benchmarks

## Conversion performance

Measured on Node 22, Apple M2. Input: 1,000 random dates in range 1900-2076 CE.

| Operation | UAQ calendar | FCNA calendar |
|---|---|---|
| `d.toHijri()` | ~0.5 µs/call | ~14 µs/call |
| `d.iYear()` | ~0.5 µs/call | ~14 µs/call |
| `dayjs.fromHijri()` | ~0.6 µs/call | ~15 µs/call |
| `d.format('iD iMMMM iYYYY')` | ~1.2 µs/call | ~15 µs/call |

UAQ uses a precomputed lookup table (O(1) lookup). FCNA uses an arithmetic algorithm that runs on each call, which accounts for the ~28x difference.

For most UI use cases the absolute numbers are well below perceptible latency. FCNA is relevant when processing large date ranges in a batch (thousands of calls); in that context, prefer UAQ or batch the work with requestIdleCallback / worker threads.

## Bundle size

The plugin adds minimal weight on top of Day.js.

| Module | Min+gz |
|---|---|
| dayjs-hijri-plus (wrapper only) | ~1.5 KB |
| hijri-core/uaq (peer dep, UAQ engine) | ~5.3 KB |
| hijri-core/fcna (peer dep, FCNA engine) | ~3.1 KB |
| dayjs (peer dep, separate) | ~6.9 KB |

Both hijri-core and dayjs-hijri-plus are tree-shakeable (named ESM exports). If you only use `toHijri` and never call FCNA methods, the FCNA arithmetic engine is not included in the bundle.

## Reproducing the benchmarks

```javascript
import dayjs from 'dayjs';
import hijri from 'dayjs-hijri-plus';

dayjs.extend(hijri);

const dates = Array.from({ length: 1000 }, (_, i) =>
  dayjs('1900-01-01').add(i * 26, 'day')
);

const start = performance.now();
for (const d of dates) {
  d.toHijri();
}
const elapsed = performance.now() - start;
console.log(`${(elapsed / dates.length * 1000).toFixed(1)} µs/call`);
```

Run with `node --version` >= 20. Results vary by machine and Node version.
