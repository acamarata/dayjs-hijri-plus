[**dayjs-hijri-plus v1.0.1**](../README.md)

***

[dayjs-hijri-plus](../README.md) / default

# Variable: default

> `const` **default**: `PluginFunc`

Defined in: [src/index.ts:164](https://github.com/acamarata/dayjs-hijri-plus/blob/599c7481510f5ea625b79c98a7030b9c8d90e4f7/src/index.ts#L164)

Day.js plugin that adds Hijri calendar support.

Register once with `dayjs.extend(hijriPlugin)`. After that, all `dayjs()`
instances expose `.toHijri()`, `.isValidHijri()`, `.hijriYear()`,
`.hijriMonth()`, `.hijriDay()`, and `.formatHijri()`. The static factory
`dayjs.fromHijri(hy, hm, hd)` is also added.

All calendar arithmetic is delegated to hijri-core. This plugin adds no
conversion logic of its own.

## Example

```ts
import dayjs from 'dayjs';
import hijriPlugin from 'dayjs-hijri-plus';

dayjs.extend(hijriPlugin);

dayjs('2023-03-23').toHijri();
// => { hy: 1444, hm: 9, hd: 1 }
```
