const express = require("express");
const authenication = require("../authenication/authenication");
const ProductSale = require("../models/ProductSale");
const router = new express.Router();

router.post("/productsales", authenication, async (req, res) => {
  const productSale = new ProductSale({
    ...req.body,
    pharmacist: req.admin._id,
  });
  try {
    await productSale.save();
    res.status(200).send();
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
    console.log(e.message);
    res.status(400).send();
  }
});
module.exports = router;
