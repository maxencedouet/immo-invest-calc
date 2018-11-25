const axios = require('axios')
const Property = require('./property-model')

const base = 'https://www.bienici.com/realEstateAds-all.json';


async function call(query) {
  const encoded = encodeURIComponent(JSON.stringify(query));
  const url = `${base}?filters=${encoded}`;
  let succ;
  let next = false;
  while (!next) {
      try {
          succ = await axios.get(url)
          next = true;
      } catch(e) {
          console.log('err')
      }
  }
  return succ;
}


async function insert(query, createdAt) {
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
}


async function crawl(filterType, propertyType, minPrice, maxPrice, createdAt) {
  const from = 0;
  const sortBy = 'relevance';
  const sortOrder = 'desc';
  const onTheMarket = [ true ]
  propertyType = [ propertyType ]
  const query = { propertyType, minPrice, maxPrice, filterType, from, sortBy, sortOrder, onTheMarket }

  const perPage = 60;
  const total = maxPrice;
  let succ = { data: {perPage, total} }

  while (query.from < succ.data.total) {
    try {
      console.log(query.from, succ.data.total)
      succ = await insert(query, createdAt)
      query.from += succ.data.perPage
    } catch(e) {
      console.log('error // last crawled', query.from, e)
      succ.data.perPage = 0
      query.from = succ.data.total
      // return succ.data.total
    }
  }
  console.log('fuck')
  return succ.data.total
}


module.exports = { crawl, call }
