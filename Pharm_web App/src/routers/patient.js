const express = require("express");
const router = new express.Router();
const Patient = require("../models/Patient");
const authenication = require("../authenication/authenication");

router.post("/patients", authenication, async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.status(200).send();
  } catch (error) {
    res.status(400).send();
  }
});
router.get("/patients", authenication, async (req, res) => {
  try {
    const patients = await Patient.find({});
    if (!patients) {
      throw new Error("no patients found");
    }
    res.status(200).send(patients);
  } catch (error) {
    res.status(404).send();
  }
});
module.exports = router;
