# Advanced Usage

## Switching calendars per call

Each method accepts an optional options argument. You can mix UAQ and FCNA in the same codebase:

```typescript
import dayjs from 'dayjs';
import hijriPlugin from 'dayjs-hijri-plus';

dayjs.extend(hijriPlugin);

const d = dayjs('2023-03-23');

const uaqYear = d.hijriYear();                     // UAQ (default)
const fcnaYear = d.hijriYear({ calendar: 'fcna' }); // FCNA
```

Near month boundaries, UAQ and FCNA may differ by one day. The calendar argument is per-call, not session-wide.

## Null safety

`toHijri()` returns `null` for dates outside the UAQ range (approximately 1900-2076 CE). Guard before using the result:

```typescript
const h = d.toHijri();
if (h !== null) {
  console.log(h.hy, h.hm, h.hd);
}
```

Use `isValidHijri()` when you only need a boolean check.

## Combining with Day.js plugins

dayjs-hijri-plus works alongside other Day.js plugins. The order of `extend()` calls matters when two plugins patch the same method. Register `dayjs-hijri-plus` after plugins that also modify `.format()`:

```typescript
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import hijriPlugin from 'dayjs-hijri-plus';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(hijriPlugin);

const d = dayjs.utc('2023-03-23');
console.log(d.hijriYear()); // 1444
```

## Mixing Gregorian and Hijri tokens

Hijri tokens (`iYYYY`, `iMM`, `iDD`, `iMMMM`, etc.) coexist with Day.js Gregorian tokens in `formatHijri`:

```typescript
d.formatHijri('YYYY-MM-DD (iD iMMMM iYYYY)');
// '2023-03-23 (1 Ramadan 1444)'
```

Standard Day.js `.format()` still handles Gregorian-only strings normally. Use `formatHijri` only when you need Hijri tokens.

## Tree-shaking

The package ships both ESM and CJS builds. ESM bundlers (Vite, esbuild, Rollup) eliminate unused code. The plugin is approximately 2 KB min+gz on top of Day.js.

## TypeScript augmentation

The plugin augments the Day.js type definitions automatically. No separate type import is needed:

```typescript
import dayjs from 'dayjs';
import hijriPlugin from 'dayjs-hijri-plus';

dayjs.extend(hijriPlugin);

const d = dayjs('2023-03-23');
const year: number = d.hijriYear()!; // fully typed; assert non-null if date is in range
```
