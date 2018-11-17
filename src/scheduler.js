const cron = require('node-cron');
const importProperties = require('./import-properties');
const calcPayback = require('./calc-payback')
const calcDuration = require('./calc-duration')

async function batch (type, createdAt) {
  await importProperties('rent', type, createdAt)
  await importProperties('buy', type, createdAt)
  await calcPayback(type, 10)
  await calcDuration(type, 10)
}

async function scheduler() {
  cron.schedule('0 * * * *', async () => {
    try {
      const createdAt = Date.now();
      await batch('parking', createdAt);
      await batch('flat', createdAt);
    } catch(e) {
      console.log('The server account the error: ', e)
    }
  });
}

module.exports = scheduler;
