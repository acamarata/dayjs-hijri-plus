# Quick Start

This guide covers the most common use cases in dayjs-hijri-plus. All examples use the default Umm al-Qura (UAQ) calendar.

## Installation

```bash
pnpm add dayjs dayjs-hijri-plus hijri-core
```

`dayjs` and `hijri-core` are required peer dependencies. Install both alongside this package.

## Load the plugin

```typescript
import dayjs from 'dayjs';
import hijri from 'dayjs-hijri-plus';

dayjs.extend(hijri);
```

After extending, all `dayjs()` instances gain Hijri methods.

## Convert a Gregorian date to Hijri

```typescript
import dayjs from 'dayjs';
import hijri from 'dayjs-hijri-plus';

dayjs.extend(hijri);

const d = dayjs('2023-03-23'); // 1 Ramadan 1444
console.log(d.iYear());  // 1444
console.log(d.iMonth()); // 9
console.log(d.iDate());  // 1
```

## Format with Hijri tokens

```typescript
d.format('iYYYY/iMM/iDD'); // '1444/09/01'
d.format('iD iMMMM iYYYY'); // '1 Ramadan 1444'
```

Hijri format tokens are prefixed with `i` to avoid conflicts with Day.js Gregorian tokens.

## Convert a Hijri date to a Day.js object

```typescript
import dayjs from 'dayjs';
import hijri from 'dayjs-hijri-plus';

dayjs.extend(hijri);

const d = dayjs.fromHijri(1444, 9, 1);
console.log(d.format('YYYY-MM-DD')); // '2023-03-23'
```

## Use the FCNA calendar

```typescript
const d = dayjs('2023-03-23');
console.log(d.iYear({ calendar: 'fcna' }));  // 1444
console.log(d.iMonth({ calendar: 'fcna' })); // 9 or differs by a day near month start
```

## CommonJS

```js
const dayjs = require('dayjs');
const hijri = require('dayjs-hijri-plus');

dayjs.extend(hijri);

const d = dayjs('2023-03-23');
console.log(d.iYear(), d.iMonth(), d.iDate()); // 1444 9 1
```

## Next steps

- [API Reference](API-Reference) for the full method list
- [Architecture](Architecture) for how the plugin integrates with Day.js
