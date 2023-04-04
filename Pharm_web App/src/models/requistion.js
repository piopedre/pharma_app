const mongoose = require("mongoose");
const requistionSchema = new mongoose.Schema({
  pharmacy_unit: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  serial_number: {
    type: String,
  },
  requisting_pharmacist: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "admin",
  },
  requistions: [],
  requistion_process: {
    type: Boolean,
    required: true,
    default: true,
  },
  issuance: {
    type: Boolean,
    default: false,
    required: true,
  },
  reception: {
    type: Boolean,
    default: false,
    required: true,
  },
});

requistionSchema.pre("save", async function (next) {
  const requiste = this;
  requiste.serial_number = `${requiste.pharmacy_unit}to${requiste.location}-store-${requiste.date}`;
  next();
});

const Requistion = mongoose.model("Requistion", requistionSchema);
module.exports = Requistion;
