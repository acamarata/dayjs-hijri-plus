# dayjs-hijri-plus — PRI (Per-Repo Instructions)

**PPI:** `~/Sites/acamarata/.claude/CLAUDE.md`

## What This Is

A Day.js plugin that adds Hijri calendar support. Converts Gregorian dates to and from
Hijri, provides Hijri-aware formatting, and delegates all calendar logic to hijri-core.
Supports Umm al-Qura (UAQ) and FCNA/ISNA calendars out of the box. Custom calendar
engines can be registered at runtime.

**npm:** `dayjs-hijri-plus@1.0.0`
**Language:** TypeScript
**License:** MIT

## Key Technical Details

- Peer dependencies: `dayjs@^1.0.0`, `hijri-core@^1.0.0`
- Plugin pattern: call `dayjs.extend(hijriPlugin)` once at startup
- Instance methods added: `toHijri()`, `formatHijri()`, `hijriYear()`, `hijriMonth()`, `hijriDay()`
- Static factory added: `dayjs.fromHijri(hy, hm, hd, options?)`
- Hijri format tokens: `iYYYY`, `iMM`, `iDD`, `iD`, `iMMMM` — non-Hijri tokens pass through to dayjs
- Options argument selects calendar: `{ calendar: 'uaq' }` (default) or `{ calendar: 'fcna' }`
- Dual CJS/ESM build via tsup
- Zero runtime dependencies (peer deps are provided by the consumer)

## Architecture

`src/index.ts` is the plugin entry point — exports the default plugin function and any
types. `src/types.ts` holds shared type definitions. Built to `dist/` (gitignored) with
`.cjs` and `.mjs` outputs plus dual type declarations.

## Commands

- `pnpm install` — install dev deps
- `pnpm build` — tsup build
- `pnpm test` — run test.mjs + test-cjs.cjs
- `pnpm run typecheck` — tsc --noEmit

## Important Notes

- This is a plugin for Day.js — call `dayjs.extend(hijriPlugin)` before using any methods
- hijri-core provides the actual calendar engine — this package is a thin adapter
- Changes to hijri-core's API may require updates here
- dayjs is a peer dep — the consumer's installed dayjs instance is used (no bundled copy)
