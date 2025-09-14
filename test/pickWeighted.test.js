const assert = require('assert');

function pickWeighted(arr, key) {
  if (arr.length === 0) return null;
  const total = arr.reduce((a, b) => a + b[key], 0);
  if (total === 0) return null;
  let r = Math.random() * total;
  for (const it of arr) { r -= it[key]; if (r <= 0) return it; }
  return arr[arr.length - 1];
}

assert.strictEqual(pickWeighted([], 'weight'), null, 'empty array returns null');
assert.strictEqual(pickWeighted([{weight:0}, {weight:0}], 'weight'), null, 'zero weight returns null');

console.log('All pickWeighted edge case tests passed.');
