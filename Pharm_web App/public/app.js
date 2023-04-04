const express = require("express");
const router = new express.Router();
router.get("/pharma_app/register", (req, res) => {
  res.render("register");
});
// router.post("/pharma_app/admin/register", async (req, res) => {
//   res.send("notification");
// });
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
  res.render("prescriptionValidation");
});
router.get("/pharma_app/add_stock", (req, res) => {
  res.render("add_stock");
});
router.get("/pharma_app/edit_stock", (req, res) => {
  res.render("edit_stock");
});
router.get("/pharma_app/delete_stock", (req, res) => {
  res.render("delete_stock");
});
router.get("/pharma_app/requistion", (req, res) => {
  res.render("requistion.hbs");
});
module.exports = router;
