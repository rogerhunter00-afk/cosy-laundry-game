const assert = require('assert');
const { pickWeighted } = require('../js/utils');

assert.strictEqual(pickWeighted([], 'weight'), null, 'empty array returns null');
assert.strictEqual(pickWeighted([{weight:0}, {weight:0}], 'weight'), null, 'zero weight returns null');

console.log('All pickWeighted edge case tests passed.');
