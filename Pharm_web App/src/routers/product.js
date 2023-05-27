const express = require("express");
const router = new express.Router();
const authenication = require("../authenication/authenication");
const Product = require("../models/Product");

router.post("/products/add_product", authenication, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send(product);
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.get("/products/search", authenication, async (req, res) => {
  const search = req.query;
  const keys = Object.keys(search);
  if (keys.length > 0) {
    keys.forEach((key) => {
      if (!search[key] || search[key] === "All") {
        delete search[key];
      }
    });
  }
  try {
    const product = await Product.find(search);

    if (!product.length) {
      return res.status(404).send();
    }
    res.status(200).send(product);
  } catch (e) {
    res.status(500).send("Error processing request");
  }
});
router.get("/products/:id", authenication, async (req, res) => {
  const _id = req.params.id;
  try {
    const product = await Product.findById(_id);
    if (!product) {
      return res.status(404).send();
    }
    res.status(200).send(product);
  } catch (e) {
    res.status(500).send();
  }
});
router.patch("/products/:id", authenication, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "name",
    "product_category",
    "cost_price",
    "quantity",
    "unit_of_issue",
    "pack_size",
    "minimum_quantity",
    "expiry_date",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send("Updating an element that is not available");
  }
  const _id = req.params.id;
  try {
    const product = await Product.findById(_id);
    if (!product) {
      return res.status(404).send();
    }
    updates.forEach((update) => (product[update] = req.body[update]));
    await product.save();
    res.status(200).send(product);
  } catch (e) {
    res.status(400).send("Error adding a product");
  }
});
router.delete("/products/:id", authenication, async (req, res) => {
  const _id = req.params.id;

  try {
    const product = await Product.findById(_id);
    if (!product) {
      return res.status(404).send("product not found");
    }
    product.remove();
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
