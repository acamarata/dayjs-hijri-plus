# dayjs-hijri-plus

[![npm version](https://img.shields.io/npm/v/dayjs-hijri-plus.svg)](https://www.npmjs.com/package/dayjs-hijri-plus)
[![CI](https://github.com/acamarata/dayjs-hijri-plus/actions/workflows/ci.yml/badge.svg)](https://github.com/acamarata/dayjs-hijri-plus/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A Day.js plugin that adds Hijri calendar support. Converts Gregorian dates to and from Hijri, provides Hijri-aware formatting, and delegates all calendar logic to [hijri-core](https://github.com/acamarata/hijri-core).

Supports Umm al-Qura (UAQ) and FCNA/ISNA calendars. Custom engines can be registered at runtime.

## Installation

```sh
pnpm add dayjs dayjs-hijri-plus hijri-core
```

Both `dayjs` and `hijri-core` are peer dependencies.

## Quick Start

```ts
import dayjs from 'dayjs';
import hijriPlugin from 'dayjs-hijri-plus';

dayjs.extend(hijriPlugin);

const d = dayjs('2023-03-23');
d.toHijri();                              // { hy: 1444, hm: 9, hd: 1 }
d.formatHijri('iD iMMMM iYYYY');         // '1 Ramadan 1444'
d.formatHijri('iYYYY-iMM-iDD');          // '1444-09-01'

dayjs.fromHijri(1444, 10, 1).format('YYYY-MM-DD'); // '2023-04-21'
```

## Documentation

Full API reference, examples, and architecture notes are on the [GitHub Wiki](https://github.com/acamarata/dayjs-hijri-plus/wiki).

## Day boundaries and time zones

`.toHijri()` converts the calendar date the dayjs instance displays — the same date you would read off the screen — regardless of the host's system timezone or whether the dayjs `utc` plugin is active. A call like `dayjs('2025-03-01').toHijri()` always maps the 1st of March 2025, not whatever local instant that string resolves to in UTC.

Religious start-of-day at sunset is out of scope. Sunset-aware day boundaries require external prayer-time data and are not handled here.

## Related

- [hijri-core](https://github.com/acamarata/hijri-core): the zero-dependency Hijri calendar engine this plugin wraps
- [luxon-hijri](https://github.com/acamarata/luxon-hijri): the same conversion for Luxon users
- [pray-calc](https://github.com/acamarata/pray-calc): Islamic prayer time calculation

## License

MIT. Copyright (c) 2026 Aric Camarata.
