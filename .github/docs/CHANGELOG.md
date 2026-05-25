# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.0] - 2026-02-25

### Added

- Day.js plugin with `.toHijri()`, `.fromHijri()`, `.hijriYear()`, `.hijriMonth()`, `.hijriDay()`, `.isValidHijri()`, and `.formatHijri()` methods
- Umm al-Qura (UAQ) calendar support via hijri-core
- FCNA/ISNA calendar support via hijri-core
- Full TypeScript definitions including module augmentation for Day.js types
- Dual CJS/ESM build with separate type declaration files
- Re-exports of `registerCalendar`, `getCalendar`, and `listCalendars` from hijri-core for custom calendar registration
