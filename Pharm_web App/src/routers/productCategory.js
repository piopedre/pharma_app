const express = require("express");
const router = new express.Router();
const ProductCategory = require("../models/productCategory");

router.post("/product/new_category", async (req, res) => {
  try {
    const category = new ProductCategory(req.body);
    await category.save();
    res.status(201).send();
  } catch (e) {
    res.status(400).send();
  }
});
router.get("/product/categories", async (req, res) => {
  try {
    const categories = await ProductCategory.find({});
    if (!categories.length) {
      return res.status(404).send();
    }
    res.status(200).send(categories);
  } catch (e) {
    res.status(500).send();
  }
});
module.exports = router;
