const express = require("express");
const ProductLog = require("../models/ProductLog");
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

router.get("/productlogsbyproduct/:id", authenication, async (req, res) => {
  const product = req.params.id;
  try {
    const productlog = await ProductLog.find({ product })
      .populate("signature")
      .exec();
    if (!productlog) {
      return res.status(404).send();
    }
    res.status(200).send(productlog);
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
