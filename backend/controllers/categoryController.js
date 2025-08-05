const Category = require("../models/Category");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find(); // Fetch all categories from the database
    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if the category already exists
    let category = await Category.findOne({ name });
    if (!category) {
      // Create a new category if it doesn't exist
      category = new Category({ name });
      category = await category.save();
    }

    res.status(201).send(category); // Return the existing or newly created category
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = { getCategories, addCategory };