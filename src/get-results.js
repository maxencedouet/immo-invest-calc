const Property = require('./property-model');
const { isJsonString } = require('./support-functions');


const fake = [
  {
    id: 1,
    price: 1.1
  },
  {
    id: 2,
    price: 1.2
  }
]

async function query(input) {
    if(!isJsonString(input)) { return []}

    const query = JSON.parse(input);
    // const properties = await Property.find(query);

    return fake;
}


async function getRentability(propertyType) {
  const transactionType = 'type'
  const id = { $exists: true }
  const duration = { $gte: 0, $lte: 250 }
  const query = { propertyType, transactionType, id, duration }

  const succ = await Property.find(query)
  .sort({ distance: 1 })
  .limit(20)

  return succ
}


module.exports = { getRentability, query }
