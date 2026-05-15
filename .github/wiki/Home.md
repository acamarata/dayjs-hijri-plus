# dayjs-hijri-plus

A Day.js plugin for Hijri calendar conversion and formatting. All calendar logic is delegated to [hijri-core](https://github.com/acamarata/hijri-core), making this package a thin, well-typed adapter with no calendar arithmetic of its own.

## Install

```sh
pnpm add dayjs dayjs-hijri-plus hijri-core
```

## Quick Usage

```ts
import dayjs from 'dayjs';
import hijriPlugin from 'dayjs-hijri-plus';

dayjs.extend(hijriPlugin);

dayjs('2023-03-23').toHijri();
// => { hy: 1444, hm: 9, hd: 1 }

dayjs('2023-03-23').formatHijri('iD iMMMM iYYYY');
// => '1 Ramadan 1444'

dayjs.fromHijri(1444, 10, 1).format('YYYY-MM-DD');
// => '2023-04-21'
```

## Contents

- [API Reference](API-Reference): all methods, parameters, return types
- [Architecture](Architecture): design decisions, delegation model, format token resolution

---

Part of the [acamarata](https://github.com/acamarata) JavaScript library collection.
