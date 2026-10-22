import test from 'node:test';
import assert from 'node:assert/strict';
import { nextTabIndex } from '../src/lib/tabs.js';

test('arrow keys move between tabs and wrap at both ends', () => {
  assert.equal(nextTabIndex('ArrowRight', 0, 5), 1);
  assert.equal(nextTabIndex('ArrowDown', 4, 5), 0);
  assert.equal(nextTabIndex('ArrowLeft', 0, 5), 4);
  assert.equal(nextTabIndex('ArrowUp', 3, 5), 2);
});

test('Home and End jump to the first and last tab, other keys are ignored', () => {
  assert.equal(nextTabIndex('Home', 3, 5), 0);
  assert.equal(nextTabIndex('End', 1, 5), 4);
  assert.equal(nextTabIndex('Enter', 2, 5), null);
});
