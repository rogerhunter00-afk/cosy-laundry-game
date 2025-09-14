const assert = require('assert');
const { pickWeighted } = require('../js/utils');

assert.strictEqual(pickWeighted([], 'weight'), null, 'empty array returns null');
assert.strictEqual(pickWeighted([{weight:0}, {weight:0}], 'weight'), null, 'zero weight returns null');
const mixed = [{weight:2}, {weight:'a'}, {weight:-1}];
assert.strictEqual(pickWeighted(mixed, 'weight'), mixed[0], 'invalid weights skipped');
assert.strictEqual(
  pickWeighted([{weight:'x'}, {missing:1}, {weight:-5}], 'weight'),
  null,
  'all invalid weights return null'
);

console.log('All pickWeighted edge case tests passed.');
