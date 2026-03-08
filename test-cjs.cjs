'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const dayjs = require('dayjs');
const { default: plugin } = require('./dist/index.cjs');

dayjs.extend(plugin);

const D_RAMADAN_1444 = new Date(2023, 2, 23, 12);
const D_MUHARRAM_1446 = new Date(2024, 6, 7, 12);

describe('CJS: plugin registration', () => {
  it('registers on dayjs', () => {
    const d = dayjs(D_RAMADAN_1444);
    assert.equal(typeof d.toHijri, 'function');
    assert.equal(typeof d.formatHijri, 'function');
    assert.equal(typeof dayjs.fromHijri, 'function');
  });
});

describe('CJS: toHijri', () => {
  it('2023-03-23 -> 1 Ramadan 1444', () => {
    const h = dayjs(D_RAMADAN_1444).toHijri();
    assert.deepEqual(h, { hy: 1444, hm: 9, hd: 1 });
  });

  it('2024-07-07 -> 1 Muharram 1446', () => {
    const h = dayjs(D_MUHARRAM_1446).toHijri();
    assert.deepEqual(h, { hy: 1446, hm: 1, hd: 1 });
  });
});

describe('CJS: fromHijri', () => {
  it('1444/9/1 -> 2023-03-23', () => {
    const d = dayjs.fromHijri(1444, 9, 1);
    assert.equal(d.format('YYYY-MM-DD'), '2023-03-23');
  });

  it('throws for out-of-range date', () => {
    assert.throws(() => dayjs.fromHijri(1301, 1, 1), /Invalid or out-of-range/);
  });
});

describe('CJS: formatHijri', () => {
  it('iYYYY-iMM-iDD', () => {
    const result = dayjs(D_RAMADAN_1444).formatHijri('iYYYY-iMM-iDD');
    assert.equal(result, '1444-09-01');
  });

  it('iMMMM -> Ramadan', () => {
    const result = dayjs(D_RAMADAN_1444).formatHijri('iMMMM');
    assert.equal(result, 'Ramadan');
  });
});

describe('CJS: isValidHijri', () => {
  it('true for in-range date', () => {
    assert.equal(dayjs(D_RAMADAN_1444).isValidHijri(), true);
  });
});
