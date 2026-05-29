# Basic Usage Examples

## Setup

```typescript
import dayjs from 'dayjs';
import hijri from 'dayjs-hijri-plus';

dayjs.extend(hijri);
```

## Convert today's date to Hijri

```typescript
const today = dayjs();
const h = today.toHijri();
// { hy: 1444, hm: 9, hd: 1 }  (example — actual output depends on the current date)

console.log(`${h.hd} / ${h.hm} / ${h.hy}`);
```

## Convert a known Gregorian date

```typescript
// 23 March 2023 = 1 Ramadan 1444 AH
const d = dayjs('2023-03-23');
const h = d.toHijri();

console.log(h.hy);  // 1444
console.log(h.hm);  // 9  (Ramadan is the 9th month)
console.log(h.hd);  // 1
```

## Convert from Hijri to Gregorian

```typescript
const gregorian = dayjs.fromHijri(1444, 9, 1);
console.log(gregorian.format('YYYY-MM-DD'));  // '2023-03-23'
```

## Hijri accessor methods

```typescript
const d = dayjs('2023-03-23');

console.log(d.iYear());   // 1444
console.log(d.iMonth());  // 9
console.log(d.iDate());   // 1
```

## Format with Hijri tokens

```typescript
const d = dayjs('2023-03-23');

d.format('iD iMMMM iYYYY');    // '1 Ramadan 1444'
d.format('iDD/iMM/iYYYY');     // '01/09/1444'
d.format('YYYY-MM-DD');        // '2023-03-23'  (Gregorian tokens still work)
d.format('YYYY (iYYYY/iM/iD)'); // '2023 (1444/9/1)'
```

## Use FCNA calendar

```typescript
const d = dayjs('2023-03-23');
const fcna = d.toHijri({ calendar: 'fcna' });

console.log(fcna.hy);  // 1444
console.log(fcna.hm);  // 9
console.log(fcna.hd);  // 1
// Near month boundaries, UAQ and FCNA may differ by one day
```

## CJS usage

```javascript
const dayjs = require('dayjs');
const hijri = require('dayjs-hijri-plus');

dayjs.extend(hijri);

const d = dayjs('2023-03-23');
console.log(d.iYear());  // 1444
```
