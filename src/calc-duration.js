const Property = require('./property-model');


async function getLastDate() {
  const createdAt = { $exists: true }
  const { createdAt: lastDate } = await Property
    .findOne({ createdAt })
    .sort({ createdAt: -1 });
  return lastDate;
}

async function getProperties(lastDate) {
  const createdAt = { $ne: lastDate }
  const publicationDate = { $exists: true }
  return Property.find({ createdAt, publicationDate })
}

async function calcDuration () {
  const lastDate = await getLastDate();
  const properties = await getProperties(lastDate);

  const promises = properties.map((property) => {
    if(property.payback) {
      const ms = Date.now() - new Date(property.publicationDate);
      const duration = Math.floor( ms / (1000*60*60*24) );
      const distance = Math.sqrt( Math.pow(property.payback, 2) + Math.pow(duration, 2) );
      return Property.update({ _id: property._id }, { $set: { duration, distance } });
    }
  })

  await Promise.all(promises);

  console.log('Duration added on ', promises.length, ' properties !')
}


module.exports = calcDuration;
