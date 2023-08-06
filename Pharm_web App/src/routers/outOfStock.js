const express = require("express");
const router = new express.Router();
const OutOfStock = require("../models/OutOfStock");
const authenication = require("../authenication/authenication");

router.post("/add_os", authenication, async (req, res) => {
  try {
    const outOfStock = new OutOfStock(req.body);
    outOfStock.save();
    res.status(201).send();
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});
module.exports = router;
