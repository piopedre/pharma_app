const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema(
  {
    receipt_number: {
      type: String,
      required: true,
      unique: true,
    },
    receipt_amount: {
      type: Number,
      required: true,
    },
    // patient receipt ownership
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Patient",
    },
    // receipt to drug sold
  },
  {
    timestamps: true,
  }
);
// drug receipt ownership
receiptSchema.virtual("drugSales", {
  ref: "DrugSale",
  localField: "_id",
  foreignField: "receipt",
});
