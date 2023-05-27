const express = require("express");
const authenication = require("../authenication/authenication");
const ProductSale = require("../models/ProductSale");
const router = new express.Router();

router.post("/productsales", authenication, async (req, res) => {
  const productSale = new ProductSale(req.body);
  try {
    await productSale.save();
    res.status(200).send();
  } catch (e) {
    console.log(e.message);
    res.status(400).send();
  }
});
module.exports = router;
