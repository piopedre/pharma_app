const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    product_category: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    product_name: {
      type: String,
      uppercase: true,
      unique: true,
    },
    cost_price: {
      type: Number,
      required: true,
    },
    selling_price: {
      type: Number,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit_of_issue: {
      type: Number,
      required: true,
    },
    pack_size: {
      type: Number,
      required: true,
    },
    minimum_quantity: {
      type: Number,
      required: true,
    },
    manufacturer_name: [],
    location: {
      type: String,
      trim: true,
      required: true,
      uppercase: true,
    },
    pharmacy_unit: {
      type: String,
      trim: true,
      required: true,
      uppercase: true,
    },
    expiry_date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.methods.toEDIT = function () {
  const drug = this;
  const drugObject = drug.toObject();

  delete drugObject._id;
  return drugObject;
};
productSchema.pre("save", async function (next) {
  const drug = this;
  if (drug.isModified("cost_price")) {
    drug.selling_price = Math.ceil(drug.cost_price * 1.3);
  }
  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
