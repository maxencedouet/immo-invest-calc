const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Property = new Schema({
  createdAt: Date,
  coordinates: [Number],
  rent10: Number,
  propertyType: String,
  transactionType: String,
  id: String,
  city: String,
  minLoc: Number,
  loc10: String,
  loc10Array: Array,
  surfaceArea: String,
  postalCode: String,
  title: String,
  publicationDate: String,
  price: Number,
  duration: Number,
  distance: Number,

  blurInfo: Schema.Types.Mixed,
  adType: String,
  reference: String,
  description: String,
  modificationDate: String,
  newProperty: Boolean,
  accountType: String,
  available: Date,
  charges: Number,
  photos: [Schema.Types.Mixed],
  adCreatedByPro: Boolean,
  district: Schema.Types.Mixed,
  status: Schema.Types.Mixed,
  addressKnown: Boolean,
  descriptionTextLength: Number,
  userRelativeData: Schema.Types.Mixed,
  priceHasDecreased: Boolean,
  adTypeFR: String,
  nothingBehindForm: Boolean,
  with3dModel: Boolean,
  highlightMailContact: Boolean,
  enOfPromotedAsExclusive: Number,
  thresholdDate: Date
});

Property.index({ coordinates: "2dsphere"});

module.exports = mongoose.model('Property', Property)
