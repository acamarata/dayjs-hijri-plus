import assert from 'node:assert/strict';
import dayjs from 'dayjs';
import plugin from './dist/index.mjs';

dayjs.extend(plugin);

let passed = 0;
let total = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    console.log(`[${name}]... PASS`);
    passed++;
  } catch (err) {
    console.error(`[${name}]... FAIL: ${err.message}`);
    process.exit(1);
  }
}

// Use noon to avoid UTC midnight boundary issues across timezones.
const D_RAMADAN_1444 = new Date(2023, 2, 23, 12);   // 1 Ramadan 1444
const D_MUHARRAM_1446 = new Date(2024, 6, 7, 12);   // 1 Muharram 1446

test('plugin registers on dayjs', () => {
  const d = dayjs(D_RAMADAN_1444);
  assert.equal(typeof d.toHijri, 'function');
  assert.equal(typeof d.formatHijri, 'function');
  assert.equal(typeof d.isValidHijri, 'function');
  assert.equal(typeof d.hijriYear, 'function');
  assert.equal(typeof d.hijriMonth, 'function');
  assert.equal(typeof d.hijriDay, 'function');
  assert.equal(typeof dayjs.fromHijri, 'function');
});

test('toHijri: 2023-03-23 -> 1 Ramadan 1444', () => {
  const h = dayjs(D_RAMADAN_1444).toHijri();
  assert.deepEqual(h, { hy: 1444, hm: 9, hd: 1 });
});

test('toHijri: 2024-07-07 -> 1 Muharram 1446', () => {
  const h = dayjs(D_MUHARRAM_1446).toHijri();
  assert.deepEqual(h, { hy: 1446, hm: 1, hd: 1 });
});

test('fromHijri: 1444/9/1 -> 2023-03-23 (UTC)', () => {
  const d = dayjs.fromHijri(1444, 9, 1);
  // toGregorian returns midnight UTC; compare using UTC accessors to be timezone-safe.
  const iso = d.toDate().toISOString();
  assert.ok(iso.startsWith('2023-03-23'), `Expected 2023-03-23, got ${iso}`);
});

test('fromHijri: 1446/1/1 -> 2024-07-07 (UTC)', () => {
  const d = dayjs.fromHijri(1446, 1, 1);
  const iso = d.toDate().toISOString();
  assert.ok(iso.startsWith('2024-07-07'), `Expected 2024-07-07, got ${iso}`);
});

test('hijriYear/hijriMonth/hijriDay accessors on 1 Ramadan 1444', () => {
  const d = dayjs(D_RAMADAN_1444);
  assert.equal(d.hijriYear(), 1444);
  assert.equal(d.hijriMonth(), 9);
  assert.equal(d.hijriDay(), 1);
});

test('formatHijri: iYYYY-iMM-iDD on 1 Ramadan 1444', () => {
  const result = dayjs(D_RAMADAN_1444).formatHijri('iYYYY-iMM-iDD');
  assert.equal(result, '1444-09-01');
});

test('formatHijri: iMMMM -> Ramadan', () => {
  const result = dayjs(D_RAMADAN_1444).formatHijri('iMMMM');
  assert.equal(result, 'Ramadan');
});

test('formatHijri: iEEEE on 2023-03-23 (Thursday)', () => {
  const result = dayjs(D_RAMADAN_1444).formatHijri('iEEEE');
  // 2023-03-23 is a Thursday; hwLong[4] = 'Yawm al-Khamis'
  assert.equal(result, 'Yawm al-Khamis');
});

test('formatHijri: ioooo -> AH', () => {
  const result = dayjs(D_RAMADAN_1444).formatHijri('ioooo');
  assert.equal(result, 'AH');
});

test('FCNA calendar: toHijri returns a valid HijriDate', () => {
  const h = dayjs(D_RAMADAN_1444).toHijri({ calendar: 'fcna' });
  assert.notEqual(h, null);
  assert.equal(typeof h.hy, 'number');
  assert.equal(typeof h.hm, 'number');
  assert.equal(typeof h.hd, 'number');
});

test('isValidHijri returns true for in-range date', () => {
  const valid = dayjs(D_RAMADAN_1444).isValidHijri();
  assert.equal(valid, true);
});

test('fromHijri throws for out-of-range UAQ date', () => {
  // 1301 is before the UAQ table begins (coverage starts at 1318)
  assert.throws(() => dayjs.fromHijri(1301, 1, 1), /Invalid or out-of-range/);
});

test('formatHijri passthrough: iYYYY YYYY contains both Hijri and Gregorian year', () => {
  const result = dayjs(D_RAMADAN_1444).formatHijri('iYYYY YYYY');
  // Should contain '1444' (Hijri) and '2023' (Gregorian)
  assert.ok(result.includes('1444'), `Expected Hijri year 1444 in: ${result}`);
  assert.ok(result.includes('2023'), `Expected Gregorian year 2023 in: ${result}`);
});

console.log(`\n${passed}/${total} tests passed`);
