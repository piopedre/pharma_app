const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  title: {
    type: String,
    uppercase: true,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
    trim: true,
    // make it title case
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  date_of_birth: {
    type: Number,
  },
  sex: {
    type: String,
    required: true,
  },
  patient_number: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  phone_number: {
    type: String,
    unique: true,
    required: true,
    minLength: 11,
    maxLength: 11,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
    // please if the mail actually exists add to validate
  },
  avatar: {
    type: Buffer,
  },
});
// patient drug ownership
patientSchema.virtual("drugsales", {
  ref: "DrugSales",
  localField: "_id",
  foreignField: "patient",
});
// patient to receipt ownership
patientSchema.virtual("receipts", {
  ref: "Receipt",
  localField: "_id",
  foreignField: "owner",
});

const Patient = mongoose.model("patient", patientSchema);
module.exports = Patient;
