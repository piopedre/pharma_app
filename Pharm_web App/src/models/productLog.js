const mongoose = require("mongoose");

const productLogSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    serial_voucher: {
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
      ref: "product",
    },
    signature: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "admin",
    },
    location: {
      type: String,
      required: true,
      uppercase: true,
    },
    pharmacy_unit: {
      type: String,
      required: true,
      uppercase: true,
    },
  },
  {
    timestamps: true,
  }
);
// produc
const ProductLog = mongoose.model("ProductLog", productLogSchema);
module.exports = ProductLog;
