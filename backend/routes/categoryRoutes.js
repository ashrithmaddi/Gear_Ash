const express = require("express");
const { getCategories, addCategory } = require("../controllers/categoryController");

const router = express.Router();

router.get("/", getCategories); // Route to fetch all categories
router.post("/add", addCategory); // Route to add a new category

module.exports = router;
