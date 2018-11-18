const Property = require('./property-model')
const grubbs = require('grubbs');
const { filterOutliers } = require('./support-functions')

const METERS_PER_MILE = 1609.34
const distance = 5


async function calc(property, number) {
  const { coordinates, description, price, _id, propertyType, surfaceArea } = property;

  const createdAt = { $exists: true }
  const { createdAt: lastDate } = await Property
    .findOne({ createdAt })
    .sort({ createdAt: -1 });

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

  const rents = await Property
    .find(query)
    .limit(5) || []

  const rentsPrices = filterOutliers(rents.map((x)=> x.price));

  const minRentPrice = Math.min(...rentsPrices)
  const rent = Math.floor(price / minRentPrice);

  const payload = {
    payback: rent
  }

  await Property.updateOne({ _id }, payload)
}


async function calcPayback(propertyType, number) {
  const transactionType = 'buy'

  const properties = await Property.find({ propertyType, transactionType });

  const promises = properties.map((property) => calc(property, number))
  await Promise.all(promises)

  console.log('Payback added on ', properties.length + ' properties !')
}


async function slowCalc(properties) {
  let i = 0
  while(i < properties.length) {
    await calc(properties[i], number)
    process.stdout.write(i + '/' + properties.length + '\r');
    i++
  }
}


module.exports = calcPayback
