const express = require("express");
const router = new express.Router();
const authenication = require("../authenication/authenication");
const Drug = require("../models/drug");

router.post("/drugs/add_drug", authenication, async (req, res) => {
  try {
    const verifyDrug = await Drug.verifyDrug(req.body);
    // check if drug exists first
    if (verifyDrug) {
      const drug = new Drug(req.body);
      await drug.save();
      res.status(201).send("Drug Added");
    }
  } catch (e) {
    res.status(400).send(e.message);
  }
});
router.get("/drugs/search", authenication, async (req, res) => {
  const search = req.query;
  const keys = Object.keys(search);
  if (keys.length > 0) {
    keys.forEach((key) => {
      if (!search[key] || search[key] === "All") {
        delete search[key];
      }
    });
  }
  try {
    const drug = await Drug.find(search);

    if (!drug.length) {
      return res.status(404).send();
    }
    res.status(200).send(drug);
  } catch (e) {
    res.status(400).send("Error processing request");
  }
});
router.get("/drugs/:id", authenication, async (req, res) => {
  const _id = req.params.id;
  try {
    const drug = await Drug.findById(_id);
    if (!drug) {
      return res.status(404).send();
    }
    res.status(200).send(drug);
  } catch (e) {
    res.status(400).send();
  }
});
router.patch("/drugs/:id", authenication, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "drug_type",
    "cost_price",
    "quantity",
    "batch_number",
    "expiry_date",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send("Updating an element that is not available");
  }
  const _id = req.params.id;
  try {
    const drug = await Drug.findById(_id);
    if (!drug) {
      return res.status(404).send();
    }
    updates.forEach((update) => (drug[update] = req.body[update]));
    await drug.save();
    res.status(200).send(drug.toEDIT());
  } catch (e) {
    res.status(400).send("Error adding a drug");
  }
});
router.delete("/drugs/:id", authenication, async (req, res) => {
  const _id = req.params.id;

  try {
    const drug = await Drug.findById(_id);
    if (!drug) {
      return res.status(404).send("drug not found");
    }
    drug.remove();
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
