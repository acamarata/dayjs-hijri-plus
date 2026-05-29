# Security Policy

## Supported versions

| Version | Supported |
| --- | --- |
| 1.x (latest) | Yes |
| < 1.0 | No |

## Reporting a vulnerability

dayjs-hijri-plus is a pure calendar computation library. It accepts plain JavaScript `Date` objects and Day.js instances as input and returns plain objects or strings. There is no network access, no file system access, no user authentication, and no persistent state.

Security vulnerabilities are unlikely given the surface area. That said, if you find something:

1. **Do not open a public issue.** That exposes the vulnerability before a fix is available.
2. Email **aric.camarata@gmail.com** with the subject line "Security: dayjs-hijri-plus".
3. Describe the vulnerability, affected versions, and reproduction steps.
4. You will receive a response within 7 days.

## What counts as a security issue here

- An input that causes the library to execute arbitrary code
- A dependency with a known CVE that affects this package's behavior
- Prototype pollution via user-provided inputs

## What does not count

- Incorrect Hijri date calculations (that is a bug, not a security issue)
- Missing input validation that causes incorrect output but no code execution
