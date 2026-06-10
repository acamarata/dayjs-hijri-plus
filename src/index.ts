import type { PluginFunc } from "dayjs";
import { toHijri, toGregorian, hmLong, hmMedium, hwLong, hwShort, hwNumeric } from "hijri-core";
import type { ConversionOptions, HijriDate } from "./types";

// Augment Day.js to expose plugin methods on the instance type.
declare module "dayjs" {
  interface Dayjs {
    /**
     * Convert the Day.js date to a Hijri date.
     *
     * @param opts - Optional calendar selection. Defaults to `{ calendar: 'uaq' }`.
     * @returns `{ hy, hm, hd }` on success, or `null` if the date is outside the
     *   supported range (UAQ: 1318-1500 AH / approximately 1900-2076 CE).
     * @example
     * dayjs('2023-03-23').toHijri();
     * // => { hy: 1444, hm: 9, hd: 1 }
     */
    toHijri(opts?: ConversionOptions): HijriDate | null;

    /**
     * Check whether the date maps to a valid Hijri date in the supported range.
     *
     * Equivalent to `d.toHijri(opts) !== null`.
     *
     * @param opts - Optional calendar selection.
     * @returns `true` if the date is in range, `false` otherwise.
     * @example
     * dayjs('2023-03-23').isValidHijri(); // true
     * dayjs('1800-01-01').isValidHijri(); // false
     */
    isValidHijri(opts?: ConversionOptions): boolean;

    /**
     * Return the Hijri year of the date.
     *
     * @param opts - Optional calendar selection.
     * @returns The Hijri year as a `number`, or `null` if out of range.
     * @example
     * dayjs('2023-03-23').hijriYear(); // 1444
     */
    hijriYear(opts?: ConversionOptions): number | null;

    /**
     * Return the Hijri month (1-12) of the date.
     *
     * Month 1 = Muharram, month 9 = Ramadan, month 12 = Dhu al-Hijjah.
     *
     * @param opts - Optional calendar selection.
     * @returns The Hijri month in the range 1-12, or `null` if out of range.
     * @example
     * dayjs('2023-03-23').hijriMonth(); // 9 (Ramadan)
     */
    hijriMonth(opts?: ConversionOptions): number | null;

    /**
     * Return the Hijri day of month (1-30) of the date.
     *
     * @param opts - Optional calendar selection.
     * @returns The Hijri day in the range 1-30, or `null` if out of range.
     * @example
     * dayjs('2023-03-23').hijriDay(); // 1
     */
    hijriDay(opts?: ConversionOptions): number | null;

    /**
     * Format the date using a mix of Hijri tokens (`i`-prefixed) and standard
     * Day.js tokens.
     *
     * Hijri tokens are replaced first. The resulting string is then passed to
     * Day.js `.format()`, so all standard tokens (YYYY, MM, DD, HH, mm, ss, etc.)
     * resolve normally.
     *
     * @param formatStr - Format string containing Hijri tokens, Day.js tokens, or both.
     * @param opts - Optional calendar selection.
     * @returns The formatted string, or an empty string if the date is out of range.
     * @example
     * dayjs('2023-03-23').formatHijri('iD iMMMM iYYYY');
     * // => '1 Ramadan 1444'
     *
     * dayjs('2023-03-23').formatHijri('iYYYY-iMM-iDD');
     * // => '1444-09-01'
     *
     * dayjs('2023-03-23').formatHijri('iD iMMMM iYYYY [at] HH:mm');
     * // => '1 Ramadan 1444 at 00:00'
     */
    formatHijri(formatStr: string, opts?: ConversionOptions): string;
  }
}

// Augment the dayjs factory to expose the fromHijri static method.
// Using the function declaration form (same pattern as dayjs timezone plugin)
// because dayjs does not export an IStatic interface for module augmentation.
// import('dayjs').Dayjs is used explicitly to satisfy the tsup DTS emitter.
declare module "dayjs" {
  /**
   * Construct a Day.js instance from a Hijri date.
   *
   * The result is built from an ISO date string (`YYYY-MM-DD`) to avoid
   * UTC midnight converting to the previous local day in western timezones.
   *
   * @param hy - Hijri year.
   * @param hm - Hijri month (1-12).
   * @param hd - Hijri day (1-30).
   * @param opts - Optional calendar selection. Defaults to `{ calendar: 'uaq' }`.
   * @returns A `dayjs.Dayjs` instance at midnight local time on the corresponding
   *   Gregorian date.
   * @throws {Error} If the Hijri date is invalid or outside the table range.
   * @example
   * dayjs.fromHijri(1444, 9, 1).format('YYYY-MM-DD');
   * // => '2023-03-23'
   *
   * dayjs.fromHijri(1444, 10, 1).format('YYYY-MM-DD');
   * // => '2023-04-21'  (Eid al-Fitr 1444)
   */
  function fromHijri(
    hy: number,
    hm: number,
    hd: number,
    opts?: ConversionOptions,
  ): import("dayjs").Dayjs;
}

// Hijri-specific format tokens, ordered longest-first to prevent partial matches.
// After replacement, the remaining string is passed to Day.js .format() for
// standard tokens (YYYY, MM, DD, HH, mm, ss, etc.).
const HIJRI_TOKEN_RE = /iYYYY|iYY|iMMMM|iMMM|iMM|iM|iDD|iD|iEEEE|iEEE|iE|ioooo|iooo/g;

/**
 * Wrap a plain string value in Day.js bracket-escape syntax so that
 * `.format()` treats every character as a literal.
 *
 * Day.js uses `[...]` for literal text. A `]` inside such a section would
 * close it prematurely, so we split on `]` and re-join with `][` (which
 * closes the current literal section, outputs a raw `]` (Day.js passes
 * unrecognised characters through untouched), then opens a new one).
 *
 * @param value - Plain string to escape.
 * @returns The bracket-escaped string.
 */
function lit(value: string): string {
  return "[" + value.split("]").join("]][") + "]";
}

/**
 * Day.js plugin that adds Hijri calendar support.
 *
 * Register once with `dayjs.extend(hijriPlugin)`. After that, all `dayjs()`
 * instances expose `.toHijri()`, `.isValidHijri()`, `.hijriYear()`,
 * `.hijriMonth()`, `.hijriDay()`, and `.formatHijri()`. The static factory
 * `dayjs.fromHijri(hy, hm, hd)` is also added.
 *
 * All calendar arithmetic is delegated to hijri-core. This plugin adds no
 * conversion logic of its own.
 *
 * @example
 * import dayjs from 'dayjs';
 * import hijriPlugin from 'dayjs-hijri-plus';
 *
 * dayjs.extend(hijriPlugin);
 *
 * dayjs('2023-03-23').toHijri();
 * // => { hy: 1444, hm: 9, hd: 1 }
 */
const plugin: PluginFunc = (_option, dayjsClass, dayjsFactory) => {
  // ------------------------------------------------------------------ //
  //  Instance methods                                                    //
  // ------------------------------------------------------------------ //

  dayjsClass.prototype.toHijri = function (opts?: ConversionOptions): HijriDate | null {
    // Build a UTC-noon Date from the calendar date this instance displays so
    // that hijri-core's UTC-day contract reads the correct day regardless of
    // the host timezone or whether the dayjs utc plugin is active.
    // dayjs .month() is 0-based, matching Date.UTC's month parameter.
    return toHijri(new Date(Date.UTC(this.year(), this.month(), this.date())), opts);
  };

  dayjsClass.prototype.isValidHijri = function (opts?: ConversionOptions): boolean {
    return this.toHijri(opts) !== null;
  };

  dayjsClass.prototype.hijriYear = function (opts?: ConversionOptions): number | null {
    return this.toHijri(opts)?.hy ?? null;
  };

  dayjsClass.prototype.hijriMonth = function (opts?: ConversionOptions): number | null {
    return this.toHijri(opts)?.hm ?? null;
  };

  dayjsClass.prototype.hijriDay = function (opts?: ConversionOptions): number | null {
    return this.toHijri(opts)?.hd ?? null;
  };

  dayjsClass.prototype.formatHijri = function (
    formatStr: string,
    opts?: ConversionOptions,
  ): string {
    const hijri = this.toHijri(opts);
    if (!hijri) return "";

    // Day.js .day() returns 0 (Sunday) ... 6 (Saturday), matching the index
    // layout of hwLong, hwShort, and hwNumeric from hijri-core.
    const dow = this.day();

    const replaced = formatStr.replace(HIJRI_TOKEN_RE, (token) => {
      switch (token) {
        case "iYYYY":
          return lit(String(hijri.hy).padStart(4, "0"));
        case "iYY":
          return lit(String(hijri.hy % 100).padStart(2, "0"));
        case "iMMMM":
          // Non-null: hijri.hm is a valid Hijri month 1-12; hm-1 is always within hmLong bounds.
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return lit(hmLong[hijri.hm - 1]!);
        case "iMMM":
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return lit(hmMedium[hijri.hm - 1]!);
        case "iMM":
          return lit(String(hijri.hm).padStart(2, "0"));
        case "iM":
          return lit(String(hijri.hm));
        case "iDD":
          return lit(String(hijri.hd).padStart(2, "0"));
        case "iD":
          return lit(String(hijri.hd));
        case "iEEEE":
          // Non-null: dow is always 0-6 (day of week), within hwLong bounds.
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return lit(hwLong[dow]!);
        case "iEEE":
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return lit(hwShort[dow]!);
        case "iE":
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return lit(String(hwNumeric[dow]!));
        case "ioooo":
        case "iooo":
          return lit("AH");
        default:
          return token;
      }
    });

    // Pass the processed string to Day.js .format() so standard tokens
    // (YYYY, MM, DD, HH, mm, ss, etc.) resolve correctly. Hijri values are
    // already wrapped in bracket-escaped literals and pass through untouched.
    return this.format(replaced);
  };

  // ------------------------------------------------------------------ //
  //  Static method: dayjs.fromHijri(hy, hm, hd, opts?)                 //
  // ------------------------------------------------------------------ //

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (dayjsFactory as any).fromHijri = (
    hy: number,
    hm: number,
    hd: number,
    opts?: ConversionOptions,
  ) => {
    let greg: Date | null;
    try {
      greg = toGregorian(hy, hm, hd, opts);
    } catch {
      throw new Error(`Invalid or out-of-range Hijri date: ${hy}/${hm}/${hd}`);
    }
    if (!greg) {
      throw new Error(`Invalid or out-of-range Hijri date: ${hy}/${hm}/${hd}`);
    }
    // Construct from an ISO date string (YYYY-MM-DD) so the result is the
    // Gregorian calendar day that corresponds to the Hijri date, at local
    // midnight in whatever timezone the consumer uses. Passing a raw Date
    // object to dayjsFactory() would interpret it as a UTC instant and could
    // land on the previous local day for hosts west of UTC.
    const y = greg.getUTCFullYear();
    const mo = String(greg.getUTCMonth() + 1).padStart(2, "0");
    const dy = String(greg.getUTCDate()).padStart(2, "0");
    return dayjsFactory(`${y}-${mo}-${dy}`);
  };
};

export default plugin;

/**
 * Re-exported from hijri-core for consumers who import from dayjs-hijri-plus.
 * Avoids requiring hijri-core as a direct dependency just to use these types.
 */
export type { HijriDate, ConversionOptions } from "./types";

/**
 * Re-exported CalendarEngine interface from hijri-core.
 * Use this type to implement custom calendar engines for `registerCalendar`.
 */
export type { CalendarEngine } from "hijri-core";

/**
 * Re-exported registry API from hijri-core.
 * Register, retrieve, or list custom calendar engines without adding
 * hijri-core as a direct dependency.
 *
 * @example
 * import { registerCalendar, listCalendars } from 'dayjs-hijri-plus';
 * registerCalendar('my-cal', myEngine);
 * listCalendars(); // ['uaq', 'fcna', 'my-cal']
 */
export { registerCalendar, getCalendar, listCalendars } from "hijri-core";
