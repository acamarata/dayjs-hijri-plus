# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- `.toHijri()` now converts the calendar date the dayjs instance displays (via `Date.UTC(year, month, date)`) instead of passing the raw instant to hijri-core. Fixes wrong-Hijri-day results around UTC-midnight instants on hosts east or west of UTC. Lock-step with the unreleased hijri-core `fix/utc-day-boundary` fix.

## [1.0.2] - 2026-05-30

### Changed
- Trim README to concise quick-start format; remove verbose API prose in favor of wiki

## [1.0.1] - 2026-05-28

### Changed
- Flatten exports map to ADR-015 standard (import/require/types at top level)
- Add "./package.json" export condition
- Add coverage script (c8 --reporter=lcov)
- Migrate CI from pnpm/action-setup to corepack enable

## [1.0.0] - 2026-05-28

### Added
- Initial release
