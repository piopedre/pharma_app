const mongoose = require("mongoose");
const ProductLog = require("./ProductLog");

const productSchema = new mongoose.Schema(
  {
    productCategory: {
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
    costPrice: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
    },
    fgPrice: {
      type: Number,
      default: 0,
    },
    nhiaPrice: {
      type: Number,
    },
    nnpcPrice: {
      type: Number,
    },
    quantity: {
      type: Number,
      required: true,
    },
    displayQuantity: {
      type: String,
    },
    unitOfIssue: {
      type: Number,
      required: true,
      min: 1,
    },
    packSize: {
      type: Number,
      required: true,
      min: 1,
    },
    minimumQuantity: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      trim: true,
      required: true,
      uppercase: true,
    },
    unit: {
      type: String,
      trim: true,
      required: true,
      uppercase: true,
    },
    expiryDate: {
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
  if (product.isModified("costPrice")) {
    const sellingPrice = (product.costPrice * 1.3).toFixed(2);
    product.sellingPrice = sellingPrice;
    product.nnpcPrice = (sellingPrice * 1.2).toFixed(2);
  }
  if (product.isModified("fgPrice")) {
    const sellingPrice = (+product.costPrice * 1.3).toFixed(2);
    const tenPercent = (0.1 * product.fgPrice).toFixed(2);
    if (product.fgPrice === 0) {
      product.nhiaPrice = sellingPrice;
    } else if (sellingPrice > +product.fgPrice) {
      product.nhiaPrice = (
        sellingPrice -
        product.fgPrice +
        +tenPercent
      ).toFixed(2);
    } else {
      product.nhiaPrice = tenPercent;
    }
  }

  if (product.isModified("quantity") || product.isModified("packSize")) {
    product.displayQuantity = `${Math.floor(
      product.quantity / product.packSize
    )} * ${product.packSize}`;
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
