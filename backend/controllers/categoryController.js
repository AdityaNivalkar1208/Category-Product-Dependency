const Category = require("../models/categoryModel");
const logger = require("../config/logger");

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    logger.info(`Category created successfully: ${category.name}`);
    res
      .status(201)
      .json({ message: "Category created successfully", data: category });
  } catch (error) {
    logger.error(`Failed to create category: ${error.message}`);
    res
      .status(500)
      .json({ message: "Failed to create category", error: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    logger.info(`Fetched ${categories.length} categories`);
    res
      .status(200)
      .json({ message: "Categories fetched successfully", data: categories });
  } catch (error) {
    logger.error(`Failed to fetch categories: ${error.message}`);
    res
      .status(500)
      .json({ message: "Failed to fetch categories", error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Category.update(req.body, { where: { id } });
    if (updated[0]) {
      logger.info(`Category with ID ${id} updated successfully`);
      res.status(200).json({ message: "Category updated successfully" });
    } else {
      logger.warn(`Category with ID ${id} not found`);
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    logger.error(`Failed to update category: ${error.message}`);
    res
      .status(500)
      .json({ message: "Failed to update category", error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.destroy({ where: { id } });
    if (deleted) {
      logger.info(`Category with ID ${id} deleted successfully`);
      res.status(204).send();
    } else {
      logger.warn(`Category with ID ${id} not found`);
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    logger.error(`Failed to delete category: ${error.message}`);
    res
      .status(500)
      .json({ message: "Failed to delete category", error: error.message });
  }
};
