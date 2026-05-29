# Contributing to dayjs-hijri-plus

Thanks for your interest in contributing. This is a small, focused library and contributions are welcome.

## Getting started

```bash
git clone https://github.com/acamarata/dayjs-hijri-plus.git
cd dayjs-hijri-plus
pnpm install
pnpm build
pnpm test
```

All tests should pass before you start.

## What to work on

Check the [open issues](https://github.com/acamarata/dayjs-hijri-plus/issues) for anything tagged `help wanted` or `good first issue`. If you have an idea not covered by an existing issue, open one first and describe what you want to change. That avoids duplicate work.

## Code style

- TypeScript strict mode. No `any` without a comment explaining why.
- Functional, stateless exports. No classes. No side effects.
- Each function: one purpose. If you can describe it with "and", split it.
- Run `pnpm run format` before committing. CI will fail on formatting issues.
- Run `pnpm run lint` before committing. Fix all warnings, not just errors.

## Tests

- Add tests for any new function or changed behavior.
- Tests live in `test.mjs` (ESM) and `test-cjs.cjs` (CommonJS). Both must pass.
- Use the native Node.js `node:test` runner. No Jest, no Vitest.
- Test known Hijri dates. The `1 Ramadan 1444 = 23 March 2023` pair is a good anchor.

## Pull requests

- Keep PRs small and focused. One concern per PR.
- Write a clear description of what changed and why.
- Reference the issue number if one exists (`Fixes #42`).
- CI must be green before merge. This includes test, lint, typecheck, and pack-check.

## Calendar correctness

The underlying calendar data and algorithms live in [hijri-core](https://github.com/acamarata/hijri-core), not here. If you find a date conversion error, it likely belongs there. Open an issue in hijri-core first.

## License

By contributing, you agree that your work will be licensed under MIT. Copyright remains with Aric Camarata.
