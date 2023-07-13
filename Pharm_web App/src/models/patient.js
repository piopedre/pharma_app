const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  sex: {
    type: String,
    required: true,
    uppercase: true,
  },
  fileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  contact: {
    type: String,
    maxLength: 12,
  },
});

const Patient = mongoose.model("patient", patientSchema);
module.exports = Patient;
