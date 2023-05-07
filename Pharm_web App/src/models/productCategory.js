const mongoose = require("mongoose");

const productCategorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      uppercase: true,
      trim: true,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);
const productCategory = mongoose.model(
  "ProductCategory",
  productCategorySchema
);
module.exports = productCategory;
