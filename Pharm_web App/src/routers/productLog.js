const express = require("express");
const ProductLog = require("../models/productLog");
const authenication = require("../authenication/authenication");
const router = new express.Router();

router.post("/productlogs", authenication, async (req, res) => {
  const productlog = new ProductLog({
    ...req.body,
    signature: req.admin.id,
  });
  try {
    await productlog.save();
    res.status(201).send();
  } catch (error) {
    res.status(400).send();
  }
});

module.exports = router;
