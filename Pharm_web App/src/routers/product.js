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
    console.log(e.message);
    res.status(400).send();
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
    res.status(500).send();
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
    "productCategory",
    "costPrice",
    "quantity",
    "fgPrice",
    "unitOfIssue",
    "packSize",
    "minimumQuantity",
    "expiryDate",
  ];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send();
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
    res.status(400).send();
  }
});
router.patch("/product/quantity/:id", authenication, async (req, res) => {
  const update = req.body;
  if (!update.quantity) {
    return res.status(400).send("Updating an element that is not available");
  }
  const _id = req.params.id;
  try {
    const product = await Product.findById(_id);
    if (!product) {
      return res.status(404).send();
    }
    product.quantity -= update.quantity;
    await product.save();
    res.status(200).send(product);
  } catch (e) {
    res.send(400).send();
  }
});
router.delete("/products/:id", authenication, async (req, res) => {
  const _id = req.params.id;

  try {
    const product = await Product.findById(_id);
    if (!product) {
      return res.status(404).send();
    }
    product.remove();
    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
