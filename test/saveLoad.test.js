const assert = require('assert');
const { state, saveGame, loadGame } = require('../js/gameCore');

// Ensure clean storage
localStorage.clear();

// Prepare state and save
state.money = 2500;
state.orders = [{ id: 42, label: 'Order' }];
state.orderBook = { 42: state.orders[0] };
saveGame();
assert.ok(localStorage.getItem('cozyLaundryEnhanced'), 'state saved to localStorage');

// Mutate state and load
state.money = 0;
state.orders = [];
state.orderBook = {};
state.running = true;
const loaded = loadGame();
assert.strictEqual(loaded, true);
assert.strictEqual(state.money, 2500);
assert.strictEqual(state.orders.length, 1);
assert.strictEqual(state.orderBook[42].id, 42);
assert.strictEqual(state.running, false, 'loading stops the game');

console.log('Save/load tests passed.');
