const express = require("express");
const authenication = require("../authenication/authenication");
const ProductSale = require("../models/ProductSale");
const router = new express.Router();

router.post("/productsales", authenication, async (req, res) => {
  const productSale = new ProductSale({
    ...req.body,
    assessment: req.admin._id,
  });
  try {
    await productSale.save();
    res.status(201).send();
  } catch (e) {
    res.status(400).send();
  }
});
router.get("/productsales/search", authenication, async (req, res) => {
  const search = req.query;
  search.start_date = new Date(search.start_date);
  if (!search.end_date.includes("-")) {
    const dateNumber = new Date(+search.end_date);
    const parsedDate = `${dateNumber.getFullYear()}-${
      dateNumber.getMonth() + 1
    }-${dateNumber.getDate()}`;
    search.end_date = new Date(parsedDate);
  } else {
    search.end_date = new Date(search.end_date);
  }

  const { pricing, location, unit, start_date, end_date } = search;
  try {
    if (pricing === "") {
      const sales = await ProductSale.find({
        location,
        unit,
        date: { $gte: start_date, $lt: end_date },
      });
      if (!sales.length) {
        return res.status(404).send();
      }
      return res.status(200).send(sales);
    }
    const sales = await ProductSale.find({
      pricing,
      location,
      unit,
      date: { $gte: start_date, $lt: end_date },
    });
    if (!sales.length) {
      return res.status(404).send();
    }
    res.status(200).send(sales);
  } catch (e) {
    res.status(400).send();
  }
});
router.patch("/productsales/:id", authenication, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["products", "counsellor"];
  const isValid = updates.every((update) => allowedUpdates.includes(update));
  const _id = req.params.id;
  if (!isValid) {
    return res.status(400).send();
  }
  try {
    const productSale = await ProductSale.findOne({ _id });
    if (!productSale) {
      return res.status(404).send();
    }
    if (req.body["counsellor"]) {
      productSale.counsellor = req.admin.id;
      await productSale.save();
    }
    if (req.body["products"]) {
      productSale.products = req.body["products"];
      await productSale.save();
    }
    res.status(200).send(productSale);
  } catch (error) {
    res.status(400).send();
  }
});
module.exports = router;
