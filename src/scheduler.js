const cron = require('node-cron');
const importProperties = require('./import-properties');
const calcRentability = require('./calc-rentability')
const calcLiquidity = require('./calc-liquidity')

async function batch (type, createdAt) {
  await importProperties('rent', type, createdAt)
  await importProperties('buy', type, createdAt)
  await calcRentability(type, 10)
  await calcLiquidity(type, 10)
}

async function scheduler() {
  cron.schedule('* 6 * * * *', async () => {
    const createdAt = Date.now();
    await batch('parking', createdAt);
    await batch('flat', createdAt);
  });
}

module.exports = scheduler;
