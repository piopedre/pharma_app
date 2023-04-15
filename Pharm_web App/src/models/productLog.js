const mongoose = require("mongoose");

const drugsalesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    strength: {
      type: String,
      required: true,
    },
    quantity_sold: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    pharmacy_unit: {
      type: String,
      required: true,
    },
    // drug Patient ownership
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Patient",
    },
    // drug receipt ownership
    receipt: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Receipt",
    },
  },
  {
    timestamps: true,
  }
);
const DrugSale = mongoose.model("drug-sale", drugsalesSchema);
module.exports = DrugSale;
