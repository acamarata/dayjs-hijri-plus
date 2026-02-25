# Architecture

## Design Philosophy

dayjs-hijri-plus contains no Hijri calendar arithmetic. Every conversion delegates to [hijri-core](https://github.com/acamarata/hijri-core), which provides a pluggable engine registry with UAQ and FCNA built in.

This separation is deliberate. Calendar algorithms are complex, have known edge cases, and require dedicated testing. Keeping them in hijri-core means both this plugin and future adapters (for Temporal, date-fns, etc.) share a single, well-tested core.

## Plugin Structure

```
src/
  index.ts   Plugin entry: registers methods on dayjsClass and dayjsFactory
  types.ts   Type definitions and module augmentation for dayjs
```

The plugin follows the standard Day.js `PluginFunc` signature:

```ts
const plugin: PluginFunc = (_option, dayjsClass, dayjsFactory) => { ... };
```

- `dayjsClass.prototype.*`: instance methods (`.toHijri`, `.formatHijri`, etc.)
- `(dayjsFactory as any).fromHijri`: static method added to the factory function

## Peer Dependencies

Both `dayjs` and `hijri-core` are peer dependencies. This means:

1. The host application controls which version of `dayjs` is used. No version conflict possible.
2. The host application controls which version of `hijri-core` is used. If hijri-core ships updated tables covering new years, the plugin benefits automatically.
3. The plugin itself has zero runtime dependencies in `node_modules`, only peer resolutions.

## Format Token Resolution

`formatHijri` works in two passes:

**Pass 1:** Replace Hijri tokens using a single regex sweep over the format string.

```ts
const HIJRI_TOKEN_RE = /iYYYY|iYY|iMMMM|iMMM|iMM|iM|iDD|iD|iEEEE|iEEE|iE|ioooo|iooo/g;
```

Tokens are listed longest-first in the alternation. This prevents `iYY` from matching before `iYYYY`, and `iMM` from matching before `iMMMM`. The regex engine tries alternatives left-to-right at each position, so ordering is the only safeguard needed.

**Pass 2:** The modified string is passed to `this.format(result)`. Day.js resolves all remaining tokens (YYYY, MM, DD, HH, mm, ss, etc.) and square-bracket escapes (`[literal]`).

This means Hijri tokens and Gregorian tokens can coexist in the same format string. For example, `'iYYYY YYYY'` produces `'1444 2023'`.

## Weekday Alignment

Day.js `.day()` returns `0` for Sunday through `6` for Saturday, the same convention as `Date.prototype.getDay()`.

The weekday arrays exported by hijri-core (`hwLong`, `hwShort`, `hwNumeric`) use the same index layout: index `0` = Sunday, index `6` = Saturday. So `hwLong[this.day()]` always yields the correct weekday name with no offset arithmetic.

## fromHijri Error Handling

`dayjs.fromHijri` calls `toGregorian` from hijri-core. If the Hijri date is invalid or outside the table range, `toGregorian` returns `null`. The plugin converts that into a thrown `Error` with the specific Hijri components included in the message, so callers get a useful diagnostic rather than a null-dereference downstream.

## Calendar Extension

The registry is global within a process. Registering a custom calendar once makes it available to all plugin method calls:

```ts
import { registerCalendar } from 'dayjs-hijri-plus';

registerCalendar('tabular', tabularEngine);

dayjs('2023-03-23').toHijri({ calendar: 'tabular' });
```

Custom engines must implement the `CalendarEngine` interface from hijri-core:

```ts
interface CalendarEngine {
  readonly id: string;
  toHijri(date: Date): HijriDate | null;
  toGregorian(hy: number, hm: number, hd: number): Date | null;
  isValid(hy: number, hm: number, hd: number): boolean;
  daysInMonth(hy: number, hm: number): number;
}
```

## Build

The package ships a dual CJS/ESM build via tsup. Both `dayjs` and `hijri-core` are marked as `external`, so they are never bundled. Consumers provide them via peer dependency resolution.

Output:

| File | Format |
| --- | --- |
| `dist/index.cjs` | CommonJS (Node `require`) |
| `dist/index.mjs` | ESM (`import`) |
| `dist/index.d.ts` | TypeScript declarations for CJS |
| `dist/index.d.mts` | TypeScript declarations for ESM |

---

[Home](Home) | [API Reference](API-Reference)
