const Property = require('./property-model')
const Table = require('cli-table');

async function pretty(succ) {
  const base = 'https://www.bienici.com/annonce/'

  const table = new Table({
      head: ['URL', 'Price', 'm2', 'Price/m2', 'minLoc', 'Payback', 'Duration', 'Ditance']
    , colWidths: [110, 8, 8, 10, 8, 8, 10, 50, 10]
  });

  //should filter bad minLoc
  const [...temp] = succ.map((x, i)=>{
    const data = [
      `${base}vente/${x.city}/parking-box/${x.id}`,
      x.price,
      (x.surfaceArea || 'NC'),
      (Math.floor(x.price/x.surfaceArea) || 'NC'),
      Math.floor(x.minLoc), Math.floor(x.rent10),
      x.duration,
      x.distance
    ]
    table.push(data)
  })

  return table;
}

async function getRentability(propertyType) {
  console.log('calculating')
  const succ = await Property.find(
    {
      propertyType,
      transactionType: 'buy',
      id: { $exists: true},
      duration: { $gte: 0, $lte: 250 }
    }
  )
  .sort({ distance: 1 })
  .limit(20)

  return succ
}

module.exports = { getRentability, pretty }
