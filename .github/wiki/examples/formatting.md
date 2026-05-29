# Formatting Examples

## Hijri format token reference

| Token | Output | Example |
|---|---|---|
| `iYYYY` | Full Hijri year | `1444` |
| `iYY` | 2-digit Hijri year | `44` |
| `iMMMM` | Full month name | `Ramadan` |
| `iMMM` | Abbreviated month name | `Ram` |
| `iMM` | 2-digit month number | `09` |
| `iM` | Month number | `9` |
| `iDD` | 2-digit day | `01` |
| `iD` | Day number | `1` |

Tokens not prefixed with `i` are passed through to Day.js as Gregorian tokens.

## Common format patterns

```typescript
import dayjs from 'dayjs';
import hijri from 'dayjs-hijri-plus';

dayjs.extend(hijri);

const d = dayjs('2023-03-23');

// Day Month Year (long)
d.format('iD iMMMM iYYYY');
// '1 Ramadan 1444'

// Numeric date
d.format('iDD/iMM/iYYYY');
// '01/09/1444'

// Short month name
d.format('iD iMMM iYYYY');
// '1 Ram 1444'

// Combined Gregorian and Hijri
d.format('YYYY-MM-DD (iD iMMMM iYYYY)');
// '2023-03-23 (1 Ramadan 1444)'

// ISO-style Hijri
d.format('iYYYY-iMM-iDD');
// '1444-09-01'
```

## Hijri month names

```typescript
const months = [
  'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', "Dhu al-Qa'dah", "Dhu al-Hijjah"
];

// iMMMM returns the standard transliteration for each month
for (let m = 1; m <= 12; m++) {
  const d = dayjs.fromHijri(1444, m, 1);
  console.log(d.format('iM iMMMM'));
}
// 1 Muharram
// 2 Safar
// ...
// 9 Ramadan
// ...
// 12 Dhu al-Hijjah
```

## React component example

```tsx
import dayjs from 'dayjs';
import hijri from 'dayjs-hijri-plus';

dayjs.extend(hijri);

interface HijriDateProps {
  date: Date;
}

function HijriDate({ date }: HijriDateProps) {
  const d = dayjs(date);
  const gregorian = d.format('YYYY-MM-DD');
  const hijriFormatted = d.format('iD iMMMM iYYYY');

  return (
    <time dateTime={gregorian}>
      {hijriFormatted}
    </time>
  );
}

// Usage: <HijriDate date={new Date('2023-03-23')} />
// Renders: <time datetime="2023-03-23">1 Ramadan 1444</time>
```
