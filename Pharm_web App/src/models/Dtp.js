const mongoose = require("mongoose");

const dtpSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Patient",
  },
  dtp: {
    type: String,
    required: true,
  },
  intervention: {
    type: String,
    required: true,
  },
  pharmacist: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Admin",
  },
});

const Dtp = mongoose.model("Dtp", dtpSchema);
module.exports = Dtp;
