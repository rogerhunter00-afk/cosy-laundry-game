const { pickWeighted } = require('./utils');

const ORDER_TYPES = [
  { key:'towels', label:'Hotel Towels', pay: 45, washerMin: 90, dryerMin: 80, foldMin: 50, weight: 1.2 },
  { key:'sheets', label:'Bed Sheets', pay: 65, washerMin: 110, dryerMin: 100, foldMin: 80, weight: 1.0 },
  { key:'scrubs', label:'Medical Scrubs', pay: 75, washerMin: 95, dryerMin: 90, foldMin: 70, weight: 0.8 },
  { key:'duvets', label:'Duvets & Comforters', pay: 120, washerMin: 180, dryerMin: 160, foldMin: 100, weight: 0.4 },
  { key:'uniforms', label:'Work Uniforms', pay: 55, washerMin: 85, dryerMin: 75, foldMin: 60, weight: 0.9 },
  { key:'delicates', label:'Delicate Items', pay: 85, washerMin: 120, dryerMin: 110, foldMin: 90, weight: 0.5 }
];

const state = {
  version: 11,
  day: 1,
  minutes: 6 * 60,
  running: false,
  speed: 1,
  baseRate: 0.7,
  money: 1500,
  energyPct: 100,
  energyCostToday: 0,
  totalEarnings: 0,
  reputation: 0,
  doneToday: 0,
  breakdownsToday: 0,
  totalCompleted: 0,
  customerSatisfaction: 100,
  orders: [],
  orderBook: {},
  completedOrders: [],
  tiles: { w: 40, h: 24, size: 64 },
  entities: [],
  upgrades: {
    efficiency: 0,
    powerSaving: 0,
    reliability: 0,
    reputation: 0,
    automation: 0
  }
};

function generateOrder() {
  const type = pickWeighted(ORDER_TYPES, 'weight');
  if (!type) return null;
  const id = Math.floor(1000 + Math.random() * 9000);

  let priority = 'Normal';
  let payMultiplier = 1;
  const rnd = Math.random();
  if (rnd < 0.1) { priority = 'Rush'; payMultiplier = 1.5; }
  else if (rnd < 0.3) { priority = 'Urgent'; payMultiplier = 1.2; }

  const dayMultiplier = 1 + (state.day - 1) * 0.1;

  const order = {
    id,
    type: type.key,
    label: type.label,
    priority,
    pay: Math.round(type.pay * payMultiplier * dayMultiplier),
    stage: 'queue',
    washerMin: Math.round(type.washerMin * dayMultiplier),
    dryerMin: Math.round(type.dryerMin * dayMultiplier),
    foldMin: Math.round(type.foldMin * dayMultiplier),
    createdAt: state.minutes,
    deadline: state.minutes + (priority === 'Rush' ? 240 : priority === 'Urgent' ? 360 : 480)
  };

  state.orders.push(order);
  state.orderBook[id] = order;
  return order;
}

function assignJob(entity, order, req) {
  const stage = entity.kind.includes('washer') ? 'wash'
              : entity.kind.includes('dryer') ? 'dry'
              : 'fold';
  entity.job = {
    id: order.id,
    label: order.label,
    stage,
    req: Math.round(req * (1 - state.upgrades.efficiency * 0.1))
  };
  entity.progress = 0;
}

function saveGame() {
  const {
    version, day, minutes, speed, baseRate, money, energyPct, energyCostToday,
    totalEarnings, reputation, doneToday, breakdownsToday, totalCompleted,
    customerSatisfaction, orders, orderBook, completedOrders, tiles, entities, upgrades
  } = state;
  const saveData = {
    version, day, minutes, speed, baseRate, money, energyPct, energyCostToday,
    totalEarnings, reputation, doneToday, breakdownsToday, totalCompleted,
    customerSatisfaction, orders, orderBook, completedOrders, tiles, entities, upgrades,
    savedAt: Date.now()
  };
  localStorage.setItem('cozyLaundryEnhanced', JSON.stringify(saveData));
}

function loadGame() {
  const saved = localStorage.getItem('cozyLaundryEnhanced');
  if (!saved) return false;
  const data = JSON.parse(saved);
  Object.assign(state, { ...state, ...data, running: false });
  return true;
}

// simple in-memory localStorage for non-browser environments
if (typeof localStorage === 'undefined') {
  let store = {};
  global.localStorage = {
    getItem(key) { return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null; },
    setItem(key, value) { store[key] = String(value); },
    removeItem(key) { delete store[key]; },
    clear() { store = {}; }
  };
}

module.exports = {
  state,
  ORDER_TYPES,
  generateOrder,
  assignJob,
  saveGame,
  loadGame
};
