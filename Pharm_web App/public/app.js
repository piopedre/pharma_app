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
  res.render("prescription_validation");
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
      res.render("add_stock", { categories });
    }
  }
  res.render("add_stock", { categories });
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
      res.render("edit_stock", { categories });
    }
  }
  res.render("edit_stock", { categories });
});
router.get("/pharma_app/delete_stock", (req, res) => {
  res.render("delete_stock");
});
router.get("/pharma_app/requistion", (req, res) => {
  res.render("requistion.hbs");
});
module.exports = router;
