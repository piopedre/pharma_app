const mongoose = require("mongoose");

const holdSchema = new mongoose.Schema({
  products: [],
});

const HoldSale = mongoose.model("HoldSale", holdSchema);
module.exports = HoldSale;
