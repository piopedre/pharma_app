const mongoose = require("mongoose");

const productLogSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    serialVoucher: {
      type: String,
    },
    movement: {
      type: String,
      required: true,
      uppercase: true,
    },
    received: {
      type: Number,
    },
    issued: {
      type: Number,
    },
    balance: {
      type: Number,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    signature: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Admin",
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
  },
  {
    timestamps: true,
  }
);
const ProductLog = mongoose.model("ProductLog", productLogSchema);
module.exports = ProductLog;
