const axios = require('axios')
const Property = require('./property-model')
const base = 'https://www.bienici.com/realEstateAds-all.json';

async function call(query) {
  const encoded = encodeURIComponent(JSON.stringify(query));
  const url = `${base}?filters=${encoded}`;
  return axios.get(url);
}

async function insert(query, createdAt) {
  try {
    const succ = await call(query)
    const promises = succ.data.realEstateAds.map((property) => {
      if(property
        && property.id
        && property.publicationDate
        && property.publicationDate !== '1970-01-01T00:00:00.000Z'
        && property.reference
        && property.blurInfo
        && property.blurInfo.position.lat
        && (property.blurInfo.position.lon || property.blurInfo.position.lng)) {

          property.createdAt = createdAt;
          property.coordinates = [ property.blurInfo.position.lat, property.blurInfo.position.lon || property.blurInfo.position.lng ];

          return Property.updateOne({reference: property.reference}, property, { upsert: true });
      }
    })

    await Promise.all(promises)

    return succ;
  } catch(e) {
    console.log('error', e)
  }
}

async function crawl(filterType, propertyType, minPrice, maxPrice, createdAt) {
  let query = {
    minPrice, maxPrice, filterType,
    "from": 0,
    "propertyType":[ propertyType ],
    "sortBy":"relevance",
    "sortOrder":"desc",
    "onTheMarket":[ true ]
  }
  let screen = 'Importing'

  let succ = { data: {perPage: 60, total: maxPrice} }
  while (query.from < succ.data.total) {
    try {
      succ = await insert(query, createdAt)
      screen += '.'
      process.stdout.write((100 * succ.data.from / succ.data.total).toFixed(2) + ' %  '+screen+'\r');
      query.from += succ.data.perPage
    } catch(e) {
      console.log('error // last crawled', query.from)
      succ.data.perPage = 0
    }
  }

  return succ.data.total
}

module.exports = { crawl, call }
