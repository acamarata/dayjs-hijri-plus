import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import dayjs from 'dayjs';
import plugin from './dist/index.mjs';

dayjs.extend(plugin);

const D_RAMADAN_1444 = new Date(2023, 2, 23, 12);   // 1 Ramadan 1444
const D_MUHARRAM_1446 = new Date(2024, 6, 7, 12);   // 1 Muharram 1446

describe('plugin registration', () => {
  it('registers on dayjs', () => {
    const d = dayjs(D_RAMADAN_1444);
    assert.equal(typeof d.toHijri, 'function');
    assert.equal(typeof d.formatHijri, 'function');
    assert.equal(typeof d.isValidHijri, 'function');
    assert.equal(typeof d.hijriYear, 'function');
    assert.equal(typeof d.hijriMonth, 'function');
    assert.equal(typeof d.hijriDay, 'function');
    assert.equal(typeof dayjs.fromHijri, 'function');
  });
});

describe('toHijri', () => {
  it('2023-03-23 -> 1 Ramadan 1444', () => {
    const h = dayjs(D_RAMADAN_1444).toHijri();
    assert.deepEqual(h, { hy: 1444, hm: 9, hd: 1 });
  });

  it('2024-07-07 -> 1 Muharram 1446', () => {
    const h = dayjs(D_MUHARRAM_1446).toHijri();
    assert.deepEqual(h, { hy: 1446, hm: 1, hd: 1 });
  });
});

describe('fromHijri', () => {
  it('1444/9/1 -> 2023-03-23', () => {
    const d = dayjs.fromHijri(1444, 9, 1);
    assert.equal(d.format('YYYY-MM-DD'), '2023-03-23');
  });

  it('1446/1/1 -> 2024-07-07', () => {
    const d = dayjs.fromHijri(1446, 1, 1);
    assert.equal(d.format('YYYY-MM-DD'), '2024-07-07');
  });

  it('throws for out-of-range UAQ date', () => {
    assert.throws(() => dayjs.fromHijri(1301, 1, 1), /Invalid or out-of-range/);
  });
});

describe('accessors', () => {
  it('hijriYear/hijriMonth/hijriDay on 1 Ramadan 1444', () => {
    const d = dayjs(D_RAMADAN_1444);
    assert.equal(d.hijriYear(), 1444);
    assert.equal(d.hijriMonth(), 9);
    assert.equal(d.hijriDay(), 1);
  });
});

describe('formatHijri', () => {
  it('iYYYY-iMM-iDD on 1 Ramadan 1444', () => {
    const result = dayjs(D_RAMADAN_1444).formatHijri('iYYYY-iMM-iDD');
    assert.equal(result, '1444-09-01');
  });

  it('iMMMM -> Ramadan', () => {
    const result = dayjs(D_RAMADAN_1444).formatHijri('iMMMM');
    assert.equal(result, 'Ramadan');
  });

  it('iEEEE on 2023-03-23 (Thursday)', () => {
    const result = dayjs(D_RAMADAN_1444).formatHijri('iEEEE');
    assert.equal(result, 'Yawm al-Khamis');
  });

  it('ioooo -> AH', () => {
    const result = dayjs(D_RAMADAN_1444).formatHijri('ioooo');
    assert.equal(result, 'AH');
  });

  it('passthrough: iYYYY YYYY contains both Hijri and Gregorian year', () => {
    const result = dayjs(D_RAMADAN_1444).formatHijri('iYYYY YYYY');
    assert.ok(result.includes('1444'), `Expected Hijri year 1444 in: ${result}`);
    assert.ok(result.includes('2023'), `Expected Gregorian year 2023 in: ${result}`);
  });
});

describe('FCNA calendar', () => {
  it('toHijri returns a valid HijriDate', () => {
    const h = dayjs(D_RAMADAN_1444).toHijri({ calendar: 'fcna' });
    assert.notEqual(h, null);
    assert.equal(typeof h.hy, 'number');
    assert.equal(typeof h.hm, 'number');
    assert.equal(typeof h.hd, 'number');
  });
});

describe('isValidHijri', () => {
  it('returns true for in-range date', () => {
    const valid = dayjs(D_RAMADAN_1444).isValidHijri();
    assert.equal(valid, true);
  });
});
