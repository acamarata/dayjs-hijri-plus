import type { PluginFunc } from 'dayjs';
import {
  toHijri,
  toGregorian,
  hmLong,
  hmMedium,
  hwLong,
  hwShort,
  hwNumeric,
} from 'hijri-core';
import type { ConversionOptions, HijriDate } from './types';

// Augment Day.js to expose plugin methods on the instance type.
declare module 'dayjs' {
  interface Dayjs {
    /** Convert to a Hijri date. Returns null if outside the supported range. */
    toHijri(opts?: ConversionOptions): HijriDate | null;

    /** Check whether the date maps to a valid Hijri date in the supported range. */
    isValidHijri(opts?: ConversionOptions): boolean;

    /** Hijri year component, or null if out of range. */
    hijriYear(opts?: ConversionOptions): number | null;

    /** Hijri month component (1-12), or null if out of range. */
    hijriMonth(opts?: ConversionOptions): number | null;

    /** Hijri day component (1-30), or null if out of range. */
    hijriDay(opts?: ConversionOptions): number | null;

    /**
     * Format the date using Hijri tokens (i-prefixed) and standard Day.js tokens.
     * Returns an empty string if the date is outside the supported range.
     */
    formatHijri(formatStr: string, opts?: ConversionOptions): string;
  }
}

// Augment the dayjs factory to expose the fromHijri static method.
// Using the function declaration form (same pattern as dayjs timezone plugin)
// because dayjs does not export an IStatic interface for module augmentation.
// import('dayjs').Dayjs is used explicitly to satisfy the tsup DTS emitter.
declare module 'dayjs' {
  function fromHijri(hy: number, hm: number, hd: number, opts?: ConversionOptions): import('dayjs').Dayjs;
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
 * unrecognised characters through untouched), then opens a new one.
 */
function lit(value: string): string {
  return '[' + value.split(']').join(']][') + ']';
}

const plugin: PluginFunc = (_option, dayjsClass, dayjsFactory) => {
  // ------------------------------------------------------------------ //
  //  Instance methods                                                    //
  // ------------------------------------------------------------------ //

  dayjsClass.prototype.toHijri = function (opts?: ConversionOptions): HijriDate | null {
    return toHijri(this.toDate(), opts);
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
    if (!hijri) return '';

    // Day.js .day() returns 0 (Sunday) ... 6 (Saturday), matching the index
    // layout of hwLong, hwShort, and hwNumeric from hijri-core.
    const dow = this.day();

    const replaced = formatStr.replace(HIJRI_TOKEN_RE, (token) => {
      switch (token) {
        case 'iYYYY': return lit(String(hijri.hy).padStart(4, '0'));
        case 'iYY':   return lit(String(hijri.hy % 100).padStart(2, '0'));
        case 'iMMMM': return lit(hmLong[hijri.hm - 1]);
        case 'iMMM':  return lit(hmMedium[hijri.hm - 1]);
        case 'iMM':   return lit(String(hijri.hm).padStart(2, '0'));
        case 'iM':    return lit(String(hijri.hm));
        case 'iDD':   return lit(String(hijri.hd).padStart(2, '0'));
        case 'iD':    return lit(String(hijri.hd));
        case 'iEEEE': return lit(hwLong[dow]);
        case 'iEEE':  return lit(hwShort[dow]);
        case 'iE':    return lit(String(hwNumeric[dow]));
        case 'ioooo':
        case 'iooo':  return lit('AH');
        default:      return token;
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
    // Construct from ISO date string to avoid timezone offset issues.
    // dayjsFactory(Date) interprets the Date in local time; a UTC-midnight Date
    // in western timezones would resolve to the previous local day.
    const y = greg.getUTCFullYear();
    const mo = String(greg.getUTCMonth() + 1).padStart(2, '0');
    const dy = String(greg.getUTCDate()).padStart(2, '0');
    return dayjsFactory(`${y}-${mo}-${dy}`);
  };
};

export default plugin;

// Re-export hijri-core types for consumers who import from dayjs-hijri-plus.
export type { HijriDate, ConversionOptions, CalendarSystem } from './types';
export type { CalendarEngine } from 'hijri-core';

// Re-export the registry API so callers can register custom calendar engines
// without adding hijri-core as a direct dependency.
export { registerCalendar, getCalendar, listCalendars } from 'hijri-core';
