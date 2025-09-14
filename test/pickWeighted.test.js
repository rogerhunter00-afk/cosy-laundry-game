const assert = require('assert');
const { pickWeighted } = require('../js/utils');

// Basic edge cases
assert.strictEqual(pickWeighted([], 'weight'), null, 'empty array returns null');
assert.strictEqual(pickWeighted([{ weight: 0 }, { weight: 0 }], 'weight'), null, 'zero weight returns null');

// Negative weights
assert.strictEqual(pickWeighted([{ weight: -1 }], 'weight'), null, 'negative weight returns null');
const mixedNegative = [{ weight: 2 }, { weight: -2 }];
assert.strictEqual(pickWeighted(mixedNegative, 'weight'), mixedNegative[0], 'negative weights are skipped');

// Missing weights
const missing = [{ weight: 1 }, { value: 2 }];
assert.strictEqual(pickWeighted(missing, 'weight'), missing[0], 'items missing weight are skipped');

// Invalid weights (NaN, Infinity, strings, non-positive)
const invalid = [
  { weight: 1 },
  { weight: NaN },
  { weight: Infinity },
  { weight: -Infinity },
  { weight: '2' },
  { weight: -1 },
  { weight: 0 },
];
assert.strictEqual(pickWeighted(invalid, 'weight'), invalid[0], 'invalid weights are skipped');

// All invalid weights
const allInvalid = [{}, { weight: 'x' }, { weight: NaN }];
assert.strictEqual(pickWeighted(allInvalid, 'weight'), null, 'all invalid weights return null');

// Deterministic behavior via mock Math.random
const originalRandom = Math.random;
Math.random = () => 0; // always pick first
const items = [{ id: 1, weight: 1 }, { id: 2, weight: 1 }];
assert.strictEqual(pickWeighted(items, 'weight'), items[0], 'mock random 0 picks first item');
Math.random = () => 0.999999; // almost 1 => pick last
assert.strictEqual(pickWeighted(items, 'weight'), items[1], 'mock random near 1 picks last item');
Math.random = originalRandom;

// Selection probabilities approximate weight ratios
function createLCG(seed) {
  const m = 0x80000000;
  const a = 1103515245;
  const c = 12345;
  let state = seed;
  return function () {
    state = (a * state + c) % m;
    return state / m;
  };
}

const rand = createLCG(42);
Math.random = rand;
const weightedItems = [{ name: 'a', weight: 1 }, { name: 'b', weight: 3 }];
const counts = { a: 0, b: 0 };
const trials = 10000;
for (let i = 0; i < trials; i++) {
  const result = pickWeighted(weightedItems, 'weight');
  counts[result.name]++;
}
Math.random = originalRandom;
const expectedA = trials * (1 / 4);
const expectedB = trials * (3 / 4);
assert.ok(Math.abs(counts.a - expectedA) / trials < 0.02, 'selection probability for a approximates weight ratio');
assert.ok(Math.abs(counts.b - expectedB) / trials < 0.02, 'selection probability for b approximates weight ratio');

console.log('All pickWeighted tests passed.');
