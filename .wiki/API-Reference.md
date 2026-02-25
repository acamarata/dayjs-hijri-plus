# API Reference

## Setup

```ts
import dayjs from 'dayjs';
import hijriPlugin from 'dayjs-hijri-plus';

dayjs.extend(hijriPlugin);
```

Call `dayjs.extend` once, globally. After that, every Day.js instance has the plugin methods.

---

## Instance Methods

### `.toHijri(opts?)`

Convert the Day.js date to a Hijri date.

**Signature:**
```ts
toHijri(opts?: ConversionOptions): HijriDate | null
```

**Parameters:**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `opts.calendar` | `string` | `'uaq'` | Calendar engine id. Built-ins: `'uaq'`, `'fcna'` |

**Returns:** `{ hy: number, hm: number, hd: number }` or `null` if the date is outside the table range.

```ts
dayjs('2023-03-23').toHijri();
// => { hy: 1444, hm: 9, hd: 1 }

dayjs('2023-03-23').toHijri({ calendar: 'fcna' });
// => { hy: 1444, hm: 9, hd: 2 }
```

---

### `.isValidHijri(opts?)`

Check whether the date has a valid Hijri representation in the supported range.

**Signature:**
```ts
isValidHijri(opts?: ConversionOptions): boolean
```

Returns `false` for dates outside the coverage range, `true` otherwise.

---

### `.hijriYear(opts?)`

**Signature:**
```ts
hijriYear(opts?: ConversionOptions): number | null
```

Returns the Hijri year, or `null` if out of range.

---

### `.hijriMonth(opts?)`

**Signature:**
```ts
hijriMonth(opts?: ConversionOptions): number | null
```

Returns the Hijri month (1-12), or `null` if out of range.

---

### `.hijriDay(opts?)`

**Signature:**
```ts
hijriDay(opts?: ConversionOptions): number | null
```

Returns the Hijri day (1-30), or `null` if out of range.

---

### `.formatHijri(formatStr, opts?)`

Format the date using a mix of Hijri-specific tokens and standard Day.js tokens.

**Signature:**
```ts
formatHijri(formatStr: string, opts?: ConversionOptions): string
```

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `formatStr` | `string` | Format string containing Hijri tokens, Day.js tokens, or both |
| `opts` | `ConversionOptions` | Optional calendar selection |

Returns an empty string if the date is outside the supported range.

**Hijri tokens:**

| Token | Example | Description |
| --- | --- | --- |
| `iYYYY` | `1444` | 4-digit Hijri year |
| `iYY` | `44` | 2-digit Hijri year |
| `iMMMM` | `Ramadan` | Full month name |
| `iMMM` | `Ramadan` | Medium month name |
| `iMM` | `09` | Zero-padded month number |
| `iM` | `9` | Month number |
| `iDD` | `01` | Zero-padded day |
| `iD` | `1` | Day number |
| `iEEEE` | `Yawm al-Khamis` | Full weekday name |
| `iEEE` | `Kham` | Short weekday name |
| `iE` | `5` | Weekday number (1=Sun ... 7=Sat) |
| `ioooo` | `AH` | Era |
| `iooo` | `AH` | Era (same as ioooo) |

Standard Day.js tokens pass through to `.format()` after Hijri token substitution.

```ts
dayjs('2023-03-23').formatHijri('iYYYY-iMM-iDD');
// => '1444-09-01'

dayjs('2023-03-23').formatHijri('iD iMMMM iYYYY [at] HH:mm');
// => '1 Ramadan 1444 at 00:00'

dayjs('2023-03-23').formatHijri('iYYYY YYYY');
// => '1444 2023'
```

---

## Static Methods

### `dayjs.fromHijri(hy, hm, hd, opts?)`

Construct a Day.js instance from a Hijri date.

**Signature:**
```ts
dayjs.fromHijri(
  hy: number,
  hm: number,
  hd: number,
  opts?: ConversionOptions,
): dayjs.Dayjs
```

**Parameters:**

| Name | Type | Description |
| --- | --- | --- |
| `hy` | `number` | Hijri year |
| `hm` | `number` | Hijri month (1-12) |
| `hd` | `number` | Hijri day (1-30) |
| `opts.calendar` | `string` | Calendar engine id (default: `'uaq'`) |

**Throws:** `Error` if the Hijri date is invalid or outside the table range.

```ts
dayjs.fromHijri(1444, 9, 1).format('YYYY-MM-DD');
// => '2023-03-23'

dayjs.fromHijri(1444, 9, 1, { calendar: 'fcna' }).format('YYYY-MM-DD');
// => '2023-03-22'
```

---

## Type Exports

```ts
import type {
  HijriDate,        // { hy: number, hm: number, hd: number }
  ConversionOptions, // { calendar?: string }
  CalendarSystem,    // string alias for calendar ids
} from 'dayjs-hijri-plus';
```

---

## Registry Exports

These re-export from hijri-core, so consumers can register custom calendar engines without adding hijri-core as a direct dependency:

```ts
import { registerCalendar, getCalendar, listCalendars } from 'dayjs-hijri-plus';
import type { CalendarEngine } from 'dayjs-hijri-plus';

registerCalendar('my-cal', myEngine);
listCalendars(); // => ['uaq', 'fcna', 'my-cal']
```

---

[Home](Home) | [Architecture](Architecture)
