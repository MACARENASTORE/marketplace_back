const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  stock: { type: Number, required: true, min: 0 },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ratings: { type: Number, default: 0 },
  image: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
