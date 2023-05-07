const express = require("express");
const authenication = require("../authenication/authenication");
const Requistion = require("../models/requistion");
const router = new express.Router();

router.post("/requistion", authenication, async (req, res) => {
  const requistion = new Requistion({
    ...req.body,
    requisting_pharmacist: req.admin.id,
  });
  try {
    await requistion.save();
    res.status(201).send();
  } catch (e) {
    console.log(e.message);
    res.status(400).send(e.message);
  }
});
router.get("/last_requistion", authenication, async (req, res) => {
  try {
    const requistion = (await Requistion.find({})).splice(-1);
    if (!requistion.length) {
      return res.status(404).send();
    }
    res.status(200).send(requistion);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
