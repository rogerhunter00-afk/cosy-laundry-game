const assert = require('assert');
const { state, assignJob } = require('../js/gameCore');

// Assign job to washer
state.upgrades.efficiency = 0;
const washer = { kind: 'washer', progress: 5 };
const order = { id: 1, label: 'Test Order' };
assignJob(washer, order, 100);
assert.deepStrictEqual(washer.job, {
  id: 1,
  label: 'Test Order',
  stage: 'wash',
  req: 100
});
assert.strictEqual(washer.progress, 0);

// Efficiency upgrade reduces required minutes
state.upgrades.efficiency = 2; // 20% reduction
const dryer = { kind: 'dryer', progress: 10 };
assignJob(dryer, order, 200);
assert.deepStrictEqual(dryer.job, {
  id: 1,
  label: 'Test Order',
  stage: 'dry',
  req: Math.round(200 * 0.8)
});
assert.strictEqual(dryer.progress, 0);

console.log('Machine assignment tests passed.');
