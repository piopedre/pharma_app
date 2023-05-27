const mongoose = require("mongoose");

const productSalesSchema = new mongoose.Schema(
  {
    receipt_number: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    patient: {
      type: String,
      default: "UNREGISTERED",
    },
    date: {
      type: Date,
      default: new Date(),
    },
    location: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    products: [
      {
        product: {
          name: {
            type: String,
            required: true,
          },
          quantity: {
            type: String,
            required: true,
          },
          amount: {
            type: Number,
            required: true,
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ProductSale = mongoose.model("ProductSale", productSalesSchema);
module.exports = ProductSale;
