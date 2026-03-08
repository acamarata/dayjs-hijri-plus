# dayjs-hijri-plus

[![npm version](https://img.shields.io/npm/v/dayjs-hijri-plus.svg)](https://www.npmjs.com/package/dayjs-hijri-plus)
[![CI](https://github.com/acamarata/dayjs-hijri-plus/actions/workflows/ci.yml/badge.svg)](https://github.com/acamarata/dayjs-hijri-plus/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A Day.js plugin that adds Hijri calendar support. Converts Gregorian dates to and from Hijri, provides Hijri-aware formatting, and delegates all calendar logic to [hijri-core](https://github.com/acamarata/hijri-core). Keeps this package thin and testable.

Supports Umm al-Qura (UAQ) and FCNA/ISNA calendars out of the box. Custom calendar engines can be registered at runtime.

## Installation

```sh
pnpm add dayjs dayjs-hijri-plus hijri-core
```

Both `dayjs` and `hijri-core` are peer dependencies and must be installed alongside this plugin.

## Quick Start

```ts
import dayjs from 'dayjs';
import hijriPlugin from 'dayjs-hijri-plus';

dayjs.extend(hijriPlugin);

// Convert a Gregorian date to Hijri
const d = dayjs(new Date(2023, 2, 23));
const hijri = d.toHijri();
// => { hy: 1444, hm: 9, hd: 1 }  (1 Ramadan 1444 AH)

// Format using Hijri tokens mixed with standard Day.js tokens
d.formatHijri('iYYYY-iMM-iDD');        // => '1444-09-01'
d.formatHijri('iD iMMMM iYYYY');       // => '1 Ramadan 1444'
d.formatHijri('iD iMMMM iYYYY [at] HH:mm'); // => '1 Ramadan 1444 at 00:00'

// Individual Hijri components
d.hijriYear();   // => 1444
d.hijriMonth();  // => 9
d.hijriDay();    // => 1

// Construct a Day.js instance from a Hijri date
const eid = dayjs.fromHijri(1444, 10, 1);
eid.format('YYYY-MM-DD'); // => '2023-04-21'

// FCNA/ISNA calendar variant
d.toHijri({ calendar: 'fcna' }); // => { hy: 1444, hm: 9, hd: 2 } (varies by month)
```

## API

### dayjs.extend(hijriPlugin)

Register the plugin with your Day.js instance. Call once before using any plugin methods.

### Instance Methods

#### `.toHijri(opts?)`

Convert the Day.js date to a Hijri date object.

| Parameter | Type | Description |
| --- | --- | --- |
| `opts` | `ConversionOptions` | Optional. `{ calendar: 'uaq' \| 'fcna' \| string }` |

Returns `HijriDate | null`. Returns `null` if the date is outside the supported range (UAQ: AH 1318-1500 / 1900-2076 CE).

```ts
dayjs('2023-03-23').toHijri();
// => { hy: 1444, hm: 9, hd: 1 }
```

#### `.isValidHijri(opts?)`

Check whether the date maps to a valid Hijri date in the supported range.

Returns `boolean`.

#### `.hijriYear(opts?)`

Returns the Hijri year as a `number`, or `null` if out of range.

#### `.hijriMonth(opts?)`

Returns the Hijri month (1-12) as a `number`, or `null` if out of range.

#### `.hijriDay(opts?)`

Returns the Hijri day (1-30) as a `number`, or `null` if out of range.

#### `.formatHijri(formatStr, opts?)`

Format the date using a mix of Hijri tokens and standard Day.js tokens.

| Parameter | Type | Description |
| --- | --- | --- |
| `formatStr` | `string` | Format string. See token table below. |
| `opts` | `ConversionOptions` | Optional calendar selection |

Returns `string`. Returns an empty string if the date is out of range.

Hijri tokens are replaced first. The resulting string is then passed to Day.js `.format()`, so all standard tokens (YYYY, MM, DD, HH, mm, ss, etc.) resolve normally.

### Static Methods

#### `dayjs.fromHijri(hy, hm, hd, opts?)`

Construct a Day.js instance from a Hijri date.

| Parameter | Type | Description |
| --- | --- | --- |
| `hy` | `number` | Hijri year |
| `hm` | `number` | Hijri month (1-12) |
| `hd` | `number` | Hijri day (1-30) |
| `opts` | `ConversionOptions` | Optional calendar selection |

Returns a `dayjs.Dayjs` instance. Throws `Error` if the Hijri date is invalid or outside the table range.

## Format Tokens

All Hijri-specific tokens use the `i` prefix.

| Token | Example | Description |
| --- | --- | --- |
| `iYYYY` | `1444` | 4-digit Hijri year |
| `iYY` | `44` | 2-digit Hijri year |
| `iMMMM` | `Ramadan` | Full Hijri month name |
| `iMMM` | `Ramadan` | Medium Hijri month name |
| `iMM` | `09` | Zero-padded Hijri month number |
| `iM` | `9` | Hijri month number |
| `iDD` | `01` | Zero-padded Hijri day |
| `iD` | `1` | Hijri day number |
| `iEEEE` | `Yawm al-Khamis` | Full weekday name |
| `iEEE` | `Kham` | Short weekday name |
| `iE` | `5` | Weekday number (1=Sunday ... 7=Saturday) |
| `ioooo` | `AH` | Era (Anno Hegirae) |
| `iooo` | `AH` | Era (short form, same as ioooo) |

Standard Day.js tokens pass through untouched. Square-bracket escaping (`[literal text]`) also works as expected.

## Calendar Systems

Two calendars ship with hijri-core:

- **`uaq`** (default): Umm al-Qura, the official calendar of Saudi Arabia. Table-based, covers 1318-1500 AH (1900-2076 CE).
- **`fcna`**: Fiqh Council of North America calendar. Uses an astronomical calculation with fixed criteria, independent of moon sighting.

Select a calendar by passing `{ calendar: 'fcna' }` to any method. The default is `'uaq'` when no option is provided.

Custom calendar engines can be registered:

```ts
import { registerCalendar } from 'dayjs-hijri-plus';
import type { CalendarEngine } from 'dayjs-hijri-plus';

const myEngine: CalendarEngine = { ... };
registerCalendar('my-calendar', myEngine);

dayjs().toHijri({ calendar: 'my-calendar' });
```

See the [hijri-core CalendarEngine interface](https://github.com/acamarata/hijri-core) for the full contract.

## TypeScript

Full TypeScript support is included. The plugin augments the Day.js module to add types for all instance and static methods.

```ts
import type { HijriDate, ConversionOptions } from 'dayjs-hijri-plus';

const h: HijriDate = dayjs().toHijri()!;
const opts: ConversionOptions = { calendar: 'fcna' };
```

No `@types` package is needed.

## Architecture

A thin plugin wrapper over [hijri-core](https://github.com/acamarata/hijri-core). The plugin augments the Day.js prototype with Hijri methods, each delegating to the registered calendar engine. Zero global state — calendar selection is passed per call.

For more detail see the [Architecture wiki page](https://github.com/acamarata/dayjs-hijri-plus/wiki/Architecture).

## Documentation

Full API reference, architecture notes, and calendar system comparisons are on the [GitHub Wiki](https://github.com/acamarata/dayjs-hijri-plus/wiki).

## Related

- [hijri-core](https://github.com/acamarata/hijri-core): zero-dependency Hijri calendar engine this plugin wraps
- [luxon-hijri](https://github.com/acamarata/luxon-hijri): the same Hijri conversion for Luxon users
- [pray-calc](https://github.com/acamarata/pray-calc): Islamic prayer time calculation
- [nrel-spa](https://github.com/acamarata/nrel-spa): NREL Solar Position Algorithm in pure JavaScript

## Compatibility

- Node.js 20, 22, 24
- Day.js 1.x (peer dependency)
- ESM and CJS builds included
- TypeScript definitions bundled

## Acknowledgments

Calendar data and algorithms provided by [hijri-core](https://github.com/acamarata/hijri-core). The Umm al-Qura table is derived from data published by the King Abdulaziz City for Science and Technology (KACST). FCNA new moon calculations follow Jean Meeus, "Astronomical Algorithms," 2nd ed., Chapter 49.

## License

MIT. Copyright (c) 2026 Aric Camarata.
