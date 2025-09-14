const assert = require('assert');
const { state, ORDER_TYPES, generateOrder } = require('../js/gameCore');

function withMockedRandom(values, fn) {
  const orig = Math.random;
  let i = 0;
  Math.random = () => {
    const v = values[i];
    i++;
    return v;
  };
  try {
    fn();
  } finally {
    Math.random = orig;
  }
}

// Test rush order generation and state bookkeeping
state.orders = [];
state.orderBook = {};
state.day = 1;
state.minutes = 0;
withMockedRandom([0, 0, 0], () => {
  const order = generateOrder();
  assert.strictEqual(order.type, ORDER_TYPES[0].key);
  assert.strictEqual(order.priority, 'Rush');
  assert.strictEqual(order.pay, Math.round(ORDER_TYPES[0].pay * 1.5));
  assert.ok(state.orders.includes(order), 'order added to state.orders');
  assert.strictEqual(state.orderBook[order.id], order, 'order stored in orderBook');
  assert.strictEqual(order.deadline, state.minutes + 240, 'rush orders have shorter deadlines');
});

// Day multiplier affects payouts and requirements
state.orders = [];
state.orderBook = {};
state.day = 3; // 20% increase
state.minutes = 60;
withMockedRandom([0, 0, 0.5], () => {
  const order = generateOrder();
  const mult = 1 + (state.day - 1) * 0.1;
  assert.strictEqual(order.priority, 'Normal');
  assert.strictEqual(order.pay, Math.round(ORDER_TYPES[0].pay * mult));
  assert.strictEqual(order.washerMin, Math.round(ORDER_TYPES[0].washerMin * mult));
  assert.strictEqual(order.dryerMin, Math.round(ORDER_TYPES[0].dryerMin * mult));
  assert.strictEqual(order.foldMin, Math.round(ORDER_TYPES[0].foldMin * mult));
});

console.log('Order generation tests passed.');
