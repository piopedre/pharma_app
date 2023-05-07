const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    product_category: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      uppercase: true,
      unique: true,
      trim: true,
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
    display_quantity: {
      type: String,
    },
    unit_of_issue: {
      type: Number,
      required: true,
      min: 1,
    },
    pack_size: {
      type: Number,
      required: true,
      min: 1,
    },
    minimum_quantity: {
      type: Number,
      required: true,
    },
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
//product and productLog relationship
productSchema.virtual("productLog", {
  ref: "ProductLog",
  localField: "_id",
  foreignField: "product",
});
productSchema.pre("save", async function (next) {
  const product = this;
  if (product.isModified("cost_price")) {
    product.selling_price = Math.ceil(product.cost_price * 1.3);
  }
  if (product.isModified("quantity")) {
    product.display_quantity = `${Math.ceil(
      product.quantity / product.pack_size
    )} * ${product.pack_size}`;
  }
  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
