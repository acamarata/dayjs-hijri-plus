[**dayjs-hijri-plus v1.0.1**](../README.md)

***

[dayjs-hijri-plus](../README.md) / listCalendars

# Function: listCalendars()

> **listCalendars**(): `string`[]

Defined in: node\_modules/.pnpm/hijri-core@1.0.0/node\_modules/hijri-core/dist/index.d.mts:27

Re-exported registry API from hijri-core.
Register, retrieve, or list custom calendar engines without adding
hijri-core as a direct dependency.

## Returns

`string`[]

## Example

```ts
import { registerCalendar, listCalendars } from 'dayjs-hijri-plus';
registerCalendar('my-cal', myEngine);
listCalendars(); // ['uaq', 'fcna', 'my-cal']
```
