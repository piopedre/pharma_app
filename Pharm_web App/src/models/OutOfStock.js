const mongoose = require("mongoose");

const outOfStockSchema = new mongoose.Schema({
  productName: {
    type: String,
    uppercase: true,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});
const OutOfStock = mongoose.model("OutOfStock", outOfStockSchema);
module.exports = OutOfStock;
