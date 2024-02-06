const mongoose = require(`mongoose`);

let productsSchema = new mongoose.Schema(
  {
    name: { type: String },
    colour: { type: String },
    price: { type: Number },
    size: { type: String },
  },
  {
    collection: `products`,
  }
);

module.exports = mongoose.model(`products`, productsSchema);
