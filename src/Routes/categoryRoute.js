const express = require("express");
const router = express.Router();
const categoryController = require("../Controller/categoryController");

router
  .route("/")
  .get(categoryController.getCategories)
  .post(categoryController.createCategory);

module.exports = router;