'use strict';

const assert = require('node:assert/strict');
const dayjs = require('dayjs');
const { default: plugin } = require('./dist/index.cjs');

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

const D_RAMADAN_1444 = new Date(2023, 2, 23, 12);
const D_MUHARRAM_1446 = new Date(2024, 6, 7, 12);

test('plugin registers (CJS)', () => {
  const d = dayjs(D_RAMADAN_1444);
  assert.equal(typeof d.toHijri, 'function');
  assert.equal(typeof d.formatHijri, 'function');
  assert.equal(typeof dayjs.fromHijri, 'function');
});

test('toHijri (CJS): 2023-03-23 -> 1 Ramadan 1444', () => {
  const h = dayjs(D_RAMADAN_1444).toHijri();
  assert.deepEqual(h, { hy: 1444, hm: 9, hd: 1 });
});

test('toHijri (CJS): 2024-07-07 -> 1 Muharram 1446', () => {
  const h = dayjs(D_MUHARRAM_1446).toHijri();
  assert.deepEqual(h, { hy: 1446, hm: 1, hd: 1 });
});

test('fromHijri (CJS): 1444/9/1 -> 2023-03-23', () => {
  const d = dayjs.fromHijri(1444, 9, 1);
  assert.equal(d.format('YYYY-MM-DD'), '2023-03-23');
});

test('formatHijri (CJS): iYYYY-iMM-iDD', () => {
  const result = dayjs(D_RAMADAN_1444).formatHijri('iYYYY-iMM-iDD');
  assert.equal(result, '1444-09-01');
});

test('formatHijri (CJS): iMMMM -> Ramadan', () => {
  const result = dayjs(D_RAMADAN_1444).formatHijri('iMMMM');
  assert.equal(result, 'Ramadan');
});

test('isValidHijri (CJS): true for in-range date', () => {
  assert.equal(dayjs(D_RAMADAN_1444).isValidHijri(), true);
});

test('fromHijri (CJS): throws for out-of-range date', () => {
  assert.throws(() => dayjs.fromHijri(1301, 1, 1), /Invalid or out-of-range/);
});

console.log(`\n${passed}/${total} tests passed`);
