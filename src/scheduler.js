const cron = require('node-cron');
const importProperties = require('./import-properties');
const calcPayback = require('./calc-payback')
const calcDuration = require('./calc-duration')

async function batch (type, createdAt) {
  console.log('Batch ', type, ' launched !')
  await importProperties('rent', type, createdAt)
  await importProperties('buy', type, createdAt)
  console.log('Batch ', type, ' finished !')
}

async function calcBatch (type) {
  await calcPayback(type, 10)
  await calcDuration(type, 10)
}

async function scheduler() {
  cron.schedule('0 * * * *', async () => {
    const createdAt = Date.now();
    await batch('parking', createdAt);
    await batch('flat', createdAt);
  });

  cron.schedule('30 * * * *', async () => {
    console.log('cron started')
    await calcBatch('parking')
    await calcBatch('flat')
  });

  //always on
  setInterval(()=>{}, 10000)
}

module.exports = { scheduler, batch };
