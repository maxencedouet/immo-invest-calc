const Table = require('cli-table');

function isJsonString(str) {
  try {
    JSON.parse(str)
  } catch(e) {
    return false
  }
  return true
}

function filterOutliers(input) {
  const { gPass } = grubbs.test(input)[0]
  const rawGrubPrices = gPass.map((x, i)=>{ if(x) { return prices[i] } })
  return rawGrubPrices.filter((x)=>x !== undefined)
}


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


module.exports = { filterOutliers, pretty, isJsonString }
