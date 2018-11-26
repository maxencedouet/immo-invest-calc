const cron = require('node-cron');
const importProperties = require('./import-properties');
const calcPayback = require('./calc-payback')
const calcDuration = require('./calc-duration')
const axios = require('axios');

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
    setTimeout(()=>{
        setInterval(()=>{
            axios.get('https://warren.now.sh/q')
        }, 10000)
    }, 60000);

    cron.schedule('0 9 * * *', async () => {
        const createdAt = Date.now();
        await batch('flat', createdAt);
        await batch('parking', createdAt);
        console.log('cron started')
        await calcBatch('flat')
        await calcBatch('parking')
    });
}

module.exports = { scheduler, batch };
