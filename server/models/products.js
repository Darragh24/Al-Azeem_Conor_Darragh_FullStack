const mongoose = require(`mongoose`);

let productPhotosSchema = new mongoose.Schema({
  filename: { type: String },
});

let productsSchema = new mongoose.Schema(
  {
    name: { type: String },
    colour: { type: String },
    price: { type: Number },
    size: { type: String },
    photos: [productPhotosSchema],
  },
  {
    collection: `products`,
  }
);

module.exports = mongoose.model(`products`, productsSchema);
