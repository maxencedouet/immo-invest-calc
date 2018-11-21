const Property = require('./property-model');
const { isJsonString } = require('./support-functions');


async function query(input) {
    if(!isJsonString(input)) { return []}
    const query = JSON.parse(input);
    console.log(input)
    const results = await Property.aggregate(query)
    results.slice(0, 50)
    return results
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
