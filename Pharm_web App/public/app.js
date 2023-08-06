const express = require("express");
const router = new express.Router();
const axios = require("axios");
router.get("/pharma-app/register", (req, res) => {
  res.render("register");
});

router.get("/pharma-app/login", async (req, res) => {
  res.render("login");
});

router.get("/pharma-app/dashboard", (req, res) => {
  res.render("dashboard");
});
router.get("/pharma-app/profile", (req, res) => {
  res.render("profile");
});
router.get("/pharma-app/prescription-validation", (req, res) => {
  res.render("prescription-validation");
});
router.get("/pharma-app/add-stock", async (req, res) => {
  let categories;
  try {
    const request = await axios.get("http://localhost:3000/product/categories");
    if (!request.ok) {
      categories = [];
    }
    categories = request.data;
  } catch (error) {
    if (!error.statusCode === 200) {
      res.render("add-product", { categories });
    }
  }
  res.render("add-product", { categories });
});
router.get("/pharma-app/edit-stock", async (req, res) => {
  let categories;
  try {
    const request = await axios.get("http://localhost:3000/product/categories");
    if (!request.ok) {
      categories = [];
    }
    categories = request.data;
  } catch (error) {
    if (!error.statusCode === 200) {
      res.render("edit-product", { categories });
    }
  }
  res.render("edit-product", { categories });
});
router.get("/pharma-app/delete-stock", (req, res) => {
  res.render("delete-product");
});
router.get("/pharma-app/requistion", (req, res) => {
  res.render("requistion.hbs");
});
router.get("/pharma-app/product-inventory", (req, res) => {
  res.render("product-inventory");
});
router.get("/pharma-app/patient-counselling", (req, res) => {
  res.render("patient-counselling");
});
router.get("/pharma-app/edit-product-sales", (req, res) => {
  res.render("edit-product-sales");
});
module.exports = router;
