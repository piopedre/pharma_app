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
    console.log(error.message);
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
    console.log(e.message);
    res.status(400).send();
  }
});

module.exports = router;
