const mongoose = require("mongoose");
const ProductLog = require("./ProductLog");

const productSchema = new mongoose.Schema(
  {
    product_category: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      uppercase: true,
      unique: true,
      trim: true,
    },
    cost_price: {
      type: Number,
      required: true,
    },
    selling_price: {
      type: Number,
    },
    fg_price: {
      type: Number,
      default: 0,
    },
    nhia_price: {
      type: Number,
    },
    nnpc_price: {
      type: Number,
    },
    quantity: {
      type: Number,
      required: true,
    },
    display_quantity: {
      type: String,
    },
    unit_of_issue: {
      type: Number,
      required: true,
      min: 1,
    },
    pack_size: {
      type: Number,
      required: true,
      min: 1,
    },
    minimum_quantity: {
      type: Number,
      required: true,
    },
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
  },
  {
    timestamps: true,
  }
);
//product and productLog relationship
productSchema.virtual("productLog", {
  ref: "ProductLog",
  localField: "_id",
  foreignField: "product",
});
productSchema.pre("save", async function (next) {
  const product = this;
  if (product.isModified("cost_price")) {
    const selling_price = (product.cost_price * 1.3).toFixed(2);
    product.selling_price = selling_price;
    product.nnpc_price = (selling_price * 1.2).toFixed(2);
  }
  if (product.isModified("fg_price")) {
    const selling_price = (+product.cost_price * 1.3).toFixed(2);
    const tenPercent = (0.1 * product.fg_price).toFixed(2);
    if (product.fg_price === 0) {
      product.nhia_price = selling_price;
    } else if (selling_price > +product.fg_price) {
      product.nhia_price = (
        selling_price -
        product.fg_price +
        +tenPercent
      ).toFixed(2);
    } else {
      product.nhia_price = tenPercent;
    }
  }

  if (product.isModified("quantity") || product.isModified("pack_size")) {
    product.display_quantity = `${Math.floor(
      product.quantity / product.pack_size
    )} * ${product.pack_size}`;
  }
  next();
});
productSchema.pre("remove", async function (next) {
  const product = this;
  await ProductLog.deleteMany({ product: product._id });
  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
