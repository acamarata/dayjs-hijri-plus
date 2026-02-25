import type { HijriDate, ConversionOptions } from 'hijri-core';
export type { HijriDate, ConversionOptions };

/** A registered calendar identifier. The built-in values are 'uaq' and 'fcna'. */
export type CalendarSystem = string;

/**
 * Options passed to plugin methods. Inherits `calendar` from ConversionOptions
 * so callers can switch between 'uaq' (default) and 'fcna'.
 */
export interface HijriPluginOptions extends ConversionOptions {
  // calendar?: string  (inherited — 'uaq' | 'fcna' | any registered calendar id)
}
