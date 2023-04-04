const express = require("express");
const authenication = require("../authenication/authenication");
const Requistion = require("../models/requistion");
const router = new express.Router();

router.post("/requistion", authenication, async (req, res) => {
  const requistion = new Requistion({
    ...req.body,
    requsiting_pharmacist: req.admin.id,
  });
  try {
    await requistion.save();
    res.status(201).send();
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
