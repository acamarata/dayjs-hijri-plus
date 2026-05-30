# Quick Start

This guide covers the most common use cases. All examples use the default Umm al-Qura (UAQ) calendar.

## Installation

```bash
pnpm add dayjs dayjs-hijri-plus hijri-core
```

`dayjs` and `hijri-core` are required peer dependencies. Install both alongside this package.

## Load the plugin

```typescript
import dayjs from 'dayjs';
import hijriPlugin from 'dayjs-hijri-plus';

dayjs.extend(hijriPlugin);
```

After extending, all `dayjs()` instances gain Hijri methods.

## Convert a Gregorian date to Hijri

```typescript
import dayjs from 'dayjs';
import hijriPlugin from 'dayjs-hijri-plus';

dayjs.extend(hijriPlugin);

const d = dayjs('2023-03-23'); // 1 Ramadan 1444
console.log(d.hijriYear());   // 1444
console.log(d.hijriMonth());  // 9
console.log(d.hijriDay());    // 1
```

## Format with Hijri tokens

```typescript
d.formatHijri('iYYYY/iMM/iDD');  // '1444/09/01'
d.formatHijri('iD iMMMM iYYYY'); // '1 Ramadan 1444'
```

Hijri tokens are prefixed with `i` to avoid conflicts with Day.js Gregorian tokens.

## Convert a Hijri date to a Day.js object

```typescript
import dayjs from 'dayjs';
import hijriPlugin from 'dayjs-hijri-plus';

dayjs.extend(hijriPlugin);

const d = dayjs.fromHijri(1444, 9, 1);
console.log(d.format('YYYY-MM-DD')); // '2023-03-23'
```

## Use the FCNA calendar

```typescript
const d = dayjs('2023-03-23');
const h = d.toHijri({ calendar: 'fcna' });
// Near month boundaries, UAQ and FCNA may differ by one day
console.log(h?.hy, h?.hm, h?.hd);
```

## CommonJS

```js
const dayjs = require('dayjs');
const hijriPlugin = require('dayjs-hijri-plus');

dayjs.extend(hijriPlugin);

const d = dayjs('2023-03-23');
console.log(d.hijriYear(), d.hijriMonth(), d.hijriDay()); // 1444 9 1
```

## Next steps

- [API Reference](../API-Reference) for the full method list
- [Architecture](../Architecture) for how the plugin integrates with Day.js
