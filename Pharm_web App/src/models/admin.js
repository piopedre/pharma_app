const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema({
  title: {
    type: String,
    uppercase: true,
    default: "Pharm",
  },
  first_name: {
    type: String,
    required: true,
    trim: true,
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
    // please if the mail actually exists add to validate
  },
  phone_number: {
    type: String,
    unique: true,
    required: true,
    minLength: 11,
    maxLength: 11,
  },
  avatar: {
    type: Buffer,
  },
  password: {
    type: String,
    required: true,
    minLength: 7,
  },
  tokens: [
    {
      token: {
        type: String,
      },
    },
  ],
});
// admin requistion relationship
adminSchema.virtual("requistions", {
  ref: "Requistion",
  localField: "_id",
  foreignField: "requisting_pharmacist",
});
// admin productLog relationship
adminSchema.virtual("productLogs", {
  ref: "ProductLog",
  localField: "_id",
  foreignField: "signature",
});
adminSchema.methods.generateToken = async function () {
  const admin = this;
  const token = jwt.sign({ _id: admin.id.toString() }, process.env.ADMINKEY, {
    expiresIn: "1h",
  });
  if (!token) {
    throw new Error("Unable to authenicate");
  }
  admin.tokens = [];
  admin.tokens = admin.tokens.concat({ token });
  await admin.save();
  return token;
};
adminSchema.methods.toJSON = function () {
  const admin = this;
  const adminObject = admin.toObject();
  delete adminObject.password;
  delete adminObject.tokens;
  delete adminObject.avatar;
  // delete adminObject._id;
  return adminObject;
};
adminSchema.statics.findAdmin = async (body) => {
  const { username, password } = body;
  const admin = await Admin.findOne({ username });
  if (!admin) {
    throw new Error("Unable to login");
  }
  const passwordVerified = await bcrypt.compare(password, admin.password);
  if (!passwordVerified) {
    throw new Error("Unable to login");
  }

  return admin;
};

adminSchema.pre("save", async function (next) {
  const admin = this;
  if (admin.isModified("password")) {
    const salt = await bcrypt.genSalt(8);
    admin.password = await bcrypt.hash(admin.password, salt);
  }
  if (admin.isModified("first_name")) {
    admin.first_name =
      admin.first_name[0].toUpperCase() + admin.first_name.slice(1);
  }
  next();
});

const Admin = mongoose.model("admin", adminSchema);

module.exports = Admin;
