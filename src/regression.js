const Property = require('./property-model');
const { call } = require('./crawler')

async function get(filterType, propertyType, minPrice, maxPrice) {
    const from = 0;
    const sortBy = 'price'
    const sortOrder = 'desc'
    const onTheMarket = [true]
    propertyType = [propertyType]
    const query = { minPrice, maxPrice, filterType, from, propertyType, sortBy, sortOrder, onTheMarket }
    return call(query);
}

function getRegPrice(x0, y0, x1, y1, limit) {
  const a = ( y1 - y0 ) / ( x1 - x0 )
  const b = y1 - a * x1
  return (limit - b) / a;
}

async function getPrice(filterType, propertyType, limit, minPrice, maxPrice) {
  const maxIterations = 50;
  const interval = 0.1;

  let i = 0;
  let lastX = 0;
  let lastY = 0;
  let lastXs = []
  let lastYs = []

  let data, x, y, price;
  const upperInterval = limit * (1 + interval);
  const underInterval = limit * (1 - interval);

  while ( i < maxIterations ) {
    ({ data } = await get(filterType, propertyType, minPrice, price))
    x = data.realEstateAds[0].price

    if(x.length > 0) {
      console.log('Carreful !!!!', x, lastX)
      x = x[0] || x[1] || lastX || 1
    }
    y = data.total

    console.log('nb', x, y)

    if( y == lastY || (upperInterval > y && underInterval < y )) {
      i = maxIterations
    } else {
      if(data.total > limit) {
        price = getRegPrice(minPrice, 0, x, y, limit)
      } else {
        if(lastY < limit) {
          const lastUpYIndex = lastYs.indexOf((y) => { return y > limit })

          // price = getRegPrice(x, y, lastX, lastY, limit)
        } else {
          price = getRegPrice(x, y, lastX, lastY, limit)
        }
      }

      if(price > maxPrice) {
        y = 0
        i = maxIterations
      } else {
        lastX = x; lastY = y;
        lastXs.push(x); lastYs.push(y)
        i++
      }
    }
  }

  return { price: x, total: y}
}

async function regression(filterType, propertyType, limit) {
  let succ = { total: 2000, price: 0 };
  let prices = [0];

  ({ data } = await get(filterType, propertyType))
  maxPrice = data.realEstateAds[0].price
  total = data.total
  price = getRegPrice(0, 0, maxPrice, total, limit)

  while(succ.total > 10) {
    succ = await getPrice(filterType, propertyType, limit, succ.price, maxPrice);
    prices.push(succ.price);
    console.log(prices)
  }
  return prices;
}


module.exports = regression;
