const mongoose = require("mongoose");
const requistionSchema = new mongoose.Schema(
  {
    pharmacy_unit: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    location: {
      type: String,
      required: true,
      uppercase: true,
    },
    date: {
      type: Date,
      default: new Date(),
    },
    serial_number: {
      type: String,
      required: true,
    },
    requisting_pharmacist: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Admin",
    },
    number_of_items_requisted: {
      type: Number,
      required: true,
    },
    cost_of_requistion: {
      type: Number,
      required: true,
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
  },
  {
    timestamps: true,
  }
);

// requistionSchema.pre("save", async function (next) {
//   const requiste = this;
//   requiste.serial_number = `${requiste.pharmacy_unit}to${requiste.location}-store-${requiste.date}`;
//   next();
// });

const Requistion = mongoose.model("Requistion", requistionSchema);
module.exports = Requistion;
