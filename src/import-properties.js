const regression = require('./regression');
const { crawl } = require('./crawler')

async function importProperties (filterType, propertyType, createdAt) {
  const array = await regression(filterType, propertyType, 2000);
  console.log(array)
  let i = 0;
  let result = 0;
  while(i < (array.length - 1) ) {
    const imported = await crawl(filterType, propertyType, array[i], array[i+1], createdAt);
    console.log('Batch ' + (i+1) + ' /' + (array.length-1) + ' imported ' + imported + ' properties')
    result += imported
    i++
  }
  return 'Process finished ! We imported ' + result + 'properties.'
}

module.exports = importProperties
