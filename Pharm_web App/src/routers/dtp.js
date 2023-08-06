const express = require("express");
const Dtp = require("../models/Dtp");
const router = new express.Router();
const authenication = require("../authenication/authenication");

router.post("/add_dtp", authenication, async (req, res) => {
  try {
    const dtp = new Dtp({
      pharmacist: req.admin.id,
      ...req.body,
    });
    await dtp.save();
    res.status(201).send();
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

module.exports = router;
