const Property = require('./property-model');


async function calcLiquidity () {
  const { createdAt: lastDate } = await Property
    .findOne({
      createdAt: {
        $exists: true
      }
    })
    .sort({ createdAt:-1 });

  console.log('Today:', lastDate);

  const succ = await Property.find({
    createdAt: {
      $ne: lastDate
    },
    publicationDate: {
      $exists: true
    }
  })

  const promises = succ.map((property) => {
    if(property.rent10) {
      const delta = Date.now() - new Date(property.publicationDate);
      const duration = Math.floor( delta / (1000*60*60*24) );
      const distance = Math.sqrt( Math.pow(property.rent10, 2) + Math.pow(duration, 2) );

      return Property.update({ _id: property._id }, {$set: { duration, distance }});
    }
  })

  await Promise.all(promises)
  console.log(promises.length, ' properties updated!')
}

module.exports = calcLiquidity;
