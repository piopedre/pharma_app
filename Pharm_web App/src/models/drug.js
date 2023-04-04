const mongoose = require("mongoose");

const drugSchema = new mongoose.Schema({
  drug_type: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  generic_name: {
    type: String,
    trim: true,
    uppercase: true,
  },
  strength: {
    type: String,
    trim: true,
    uppercase: true,
  },
  cost_price: {
    type: Number,
    required: true,
  },
  // pack size,
  // issue_quantity
  selling_price: {
    type: Number,
  },
  manufacturer_name: [],
  location: {
    type: String,
    trim: true,
    required: true,
    uppercase: true,
  },
  pharmacy_unit: {
    type: String,
    trim: true,
    required: true,
    uppercase: true,
  },
  expiry_date: {
    type: Date,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

drugSchema.statics.verifyDrug = async (body) => {
  const { drug_type, location, pharmacy_unit, name, strength } = body;

  if (drug_type === "Consumables") {
    const drugExists = await Drug.findOne({
      name,
      location,
      pharmacy_unit,
    });
    if (drugExists) {
      throw new Error("Drug already Exists");
    }
  } else {
    const drugExists = await Drug.findOne({
      name,
      strength,
      location,
      pharmacy_unit,
    });
    if (drugExists) {
      throw new Error("This drug already exists");
    }
  }
  return true;
};
drugSchema.methods.toEDIT = function () {
  const drug = this;
  const drugObject = drug.toObject();

  delete drugObject._id;
  return drugObject;
};
drugSchema.pre("save", async function (next) {
  const drug = this;
  if (drug.isModified("cost_price")) {
    drug.selling_price = drug.cost_price * 1.2;
  }
  next();
});

const Drug = mongoose.model("Drug", drugSchema);
module.exports = Drug;
