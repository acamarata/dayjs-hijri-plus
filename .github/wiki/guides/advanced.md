# Advanced Usage

## Switching calendars per call

Each method accepts an optional options argument. You can mix UAQ and FCNA in the same codebase:

```typescript
import dayjs from 'dayjs';
import hijri from 'dayjs-hijri-plus';

dayjs.extend(hijri);

const d = dayjs('2023-03-23');

const uaqYear = d.iYear();               // UAQ (default)
const fcnaYear = d.iYear({ calendar: 'fcna' }); // FCNA
```

Near month boundaries, UAQ and FCNA may differ by one day. The calendar argument is per-call, not session-wide.

## Null safety

`d.toHijri()` (if the package exposes it) returns `null` for dates outside UAQ range (approximately 1900-2076 CE). Guard before using:

```typescript
const hijri = d.toHijri();
if (hijri !== null) {
  console.log(hijri.hy, hijri.hm, hijri.hd);
}
```

## Combining with Day.js plugins

dayjs-hijri-plus works alongside other Day.js plugins. The order of `extend()` calls matters when two plugins patch the same method:

```typescript
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import hijri from 'dayjs-hijri-plus';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(hijri);

// UTC-aware conversion
const d = dayjs.utc('2023-03-23');
console.log(d.iYear()); // 1444
```

## Formatting alongside Gregorian tokens

Hijri tokens (`iYYYY`, `iMM`, `iDD`, `iMMMM`, etc.) coexist with Day.js Gregorian tokens. Use them in the same format string:

```typescript
d.format('YYYY-MM-DD (iD iMMMM iYYYY)');
// '2023-03-23 (1 Ramadan 1444)'
```

## Tree-shaking

The package ships both ESM and CJS builds. In ESM bundlers (Vite, esbuild, Rollup), unused code is eliminated. The plugin itself is ~2 KB min+gz on top of Day.js.

## TypeScript augmentation

The plugin augments the Day.js type definitions automatically. You do not need to import any separate types file:

```typescript
import dayjs from 'dayjs';
import hijri from 'dayjs-hijri-plus';

dayjs.extend(hijri);

const d = dayjs('2023-03-23');
const year: number = d.iYear(); // fully typed
```
