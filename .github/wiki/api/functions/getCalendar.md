[**dayjs-hijri-plus v1.0.1**](../README.md)

***

[dayjs-hijri-plus](../README.md) / getCalendar

# Function: getCalendar()

> **getCalendar**(`name`): [`CalendarEngine`](../interfaces/CalendarEngine.md)

Defined in: node\_modules/.pnpm/hijri-core@1.0.0/node\_modules/hijri-core/dist/index.d.mts:26

Re-exported registry API from hijri-core.
Register, retrieve, or list custom calendar engines without adding
hijri-core as a direct dependency.

## Parameters

### name

`string`

## Returns

[`CalendarEngine`](../interfaces/CalendarEngine.md)

## Example

```ts
import { registerCalendar, listCalendars } from 'dayjs-hijri-plus';
registerCalendar('my-cal', myEngine);
listCalendars(); // ['uaq', 'fcna', 'my-cal']
```
