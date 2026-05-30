# Formatting Examples

## Hijri format token reference

| Token | Output | Example |
|---|---|---|
| `iYYYY` | Full Hijri year | `1444` |
| `iYY` | 2-digit Hijri year | `44` |
| `iMMMM` | Full month name | `Ramadan` |
| `iMMM` | Abbreviated month name | `Ramadan` |
| `iMM` | 2-digit month number | `09` |
| `iM` | Month number | `9` |
| `iDD` | 2-digit day | `01` |
| `iD` | Day number | `1` |
| `iEEEE` | Full weekday name | `Yawm al-Khamis` |
| `iEEE` | Short weekday name | `Kham` |
| `iE` | Weekday number | `5` (1=Sunday) |
| `ioooo` | Era | `AH` |

Tokens not prefixed with `i` pass through to Day.js `.format()` as Gregorian tokens.

## Common format patterns

```typescript
import dayjs from 'dayjs';
import hijriPlugin from 'dayjs-hijri-plus';

dayjs.extend(hijriPlugin);

const d = dayjs('2023-03-23');

// Day Month Year (long)
d.formatHijri('iD iMMMM iYYYY');
// '1 Ramadan 1444'

// Numeric date
d.formatHijri('iDD/iMM/iYYYY');
// '01/09/1444'

// Short month name
d.formatHijri('iD iMMM iYYYY');
// '1 Ramadan 1444'

// Combined Gregorian and Hijri
d.formatHijri('YYYY-MM-DD (iD iMMMM iYYYY)');
// '2023-03-23 (1 Ramadan 1444)'

// ISO-style Hijri
d.formatHijri('iYYYY-iMM-iDD');
// '1444-09-01'
```

## Hijri month names

```typescript
// iMMMM returns the standard transliteration for each month
for (let m = 1; m <= 12; m++) {
  const d = dayjs.fromHijri(1444, m, 1);
  console.log(d.formatHijri('iM iMMMM'));
}
// 1 Muharram
// 2 Safar
// 3 Rabi' al-Awwal
// ...
// 9 Ramadan
// ...
// 12 Dhu al-Hijjah
```

## React component example

```tsx
import dayjs from 'dayjs';
import hijriPlugin from 'dayjs-hijri-plus';

dayjs.extend(hijriPlugin);

interface HijriDateDisplayProps {
  date: Date;
}

function HijriDateDisplay({ date }: HijriDateDisplayProps) {
  const d = dayjs(date);
  const gregorianIso = d.format('YYYY-MM-DD');
  const hijriFormatted = d.formatHijri('iD iMMMM iYYYY');

  return (
    <time dateTime={gregorianIso}>
      {hijriFormatted || gregorianIso}
    </time>
  );
}

// Usage: <HijriDateDisplay date={new Date('2023-03-23')} />
// Renders: <time datetime="2023-03-23">1 Ramadan 1444</time>
```
