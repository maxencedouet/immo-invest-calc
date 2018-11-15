const Property = require('./property-model')
const METERS_PER_MILE = 1609.34
const grubbs = require('grubbs');
const distance = 5

async function calc(property, number) {
  const { coordinates, description, price, _id, propertyType, surfaceArea } = property;
  const { createdAt: lastDate } = await Property
    .findOne({
      createdAt: {
        $exists: true
      }
    })
    .sort({ createdAt:-1 });

  if(!coordinates) { return }

  const query = {
    createdAt: lastDate,
    propertyType,
    transactionType: 'rent',
    coordinates: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates
        }
      }
    }
  }

  if(propertyType == 'flat' && surfaceArea) {
    query.surfaceArea = {
      $lte: 1.1 * surfaceArea,
      $gte: 0.9 * surfaceArea
    }
  }

  const succ = await Property
    .find(query)
    .limit(5) || []

  // succ.splice(0, 1)

  const prices = succ.map((x)=> x.price);
  const { gPass } = grubbs.test(prices)[0]
  const rawGrubPrices = gPass.map((x, i)=>{ if(x) { return prices[i] } })
  const grubPrices = rawGrubPrices.filter((x)=>x !== undefined)
  const sum = grubPrices.reduce((previous, current) => current += previous);
  const loc = (sum / grubPrices.length);

  const minLoc = Math.min(...prices)
  const rent = Math.floor(price / minLoc);

  const payload = {}
  payload['rent' + number] = rent
  payload['loc' + number + 'Array'] = prices
  payload['minLoc'] = minLoc

  await Property.updateOne({ _id }, payload)
}

async function calcRentability(propertyType, number) {
  const properties = await Property.find({
    propertyType,
    transactionType: 'buy'
  });

  // SLOW BUT STEP-BY-STEP
  // let i = 0
  // while(i < properties.length) {
  //   await calc(properties[i], number)
  //   process.stdout.write(i + '/' + properties.length + '\r');
  //   i++
  // }

  let screen = 'Updating Avg'
  const logging = setInterval(()=>{
    screen += '.'
    process.stdout.write(screen+'\r');
  }, 1000)
  const promises = properties.map((property)=>calc(property, number))
  await Promise.all(promises)
  clearInterval(logging)

  console.log(properties.length + ' properties updated !')
}

module.exports = calcRentability
