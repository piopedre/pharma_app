const express = require("express");
const router = new express.Router();
const axios = require("axios");
router.get("/pharma_app/register", (req, res) => {
  res.render("register");
});

router.get("/pharma_app/login", async (req, res) => {
  res.render("login");
});

router.get("/pharma_app/dashboard", (req, res) => {
  res.render("dashboard");
});
router.get("/pharma_app/profile", (req, res) => {
  res.render("profile");
});
router.get("/pharma_app/prescription_validation", (req, res) => {
  res.render("prescription-validation");
});
router.get("/pharma_app/add_stock", async (req, res) => {
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
router.get("/pharma_app/edit_stock", async (req, res) => {
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
router.get("/pharma_app/delete_stock", (req, res) => {
  res.render("delete-product");
});
router.get("/pharma_app/requistion", (req, res) => {
  res.render("requistion.hbs");
});
router.get("/pharma_app/product_inventory", (req, res) => {
  res.render("product-inventory");
});
module.exports = router;
