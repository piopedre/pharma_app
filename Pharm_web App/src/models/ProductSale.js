const mongoose = require("mongoose");

const productSalesSchema = new mongoose.Schema(
  {
    receiptNumber: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    pharmacist: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Admin",
    },
    patient: {
      name: {
        type: String,
      },
      fileNumber: {
        type: String,
      },
    },
    pricing: {
      type: String,
      required: true,
      uppercase: true,
    },
    date: {
      type: Date,
      default: new Date(),
    },
    location: {
      type: String,
      required: true,
      uppercase: true,
    },
    unit: {
      type: String,
      required: true,
      uppercase: true,
    },

    products: [],
  },
  {
    timestamps: true,
  }
);

const ProductSale = mongoose.model("ProductSale", productSalesSchema);
module.exports = ProductSale;
