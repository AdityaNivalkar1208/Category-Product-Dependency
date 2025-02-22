const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const logger = require("../config/logger");

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    logger.info(`Product created successfully: ${product.name}`);
    res
      .status(201)
      .json({ message: "Product created successfully", data: product });
  } catch (error) {
    logger.error(`Failed to create product: ${error.message}`);
    res
      .status(500)
      .json({ message: "Failed to create product", error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  const { page = 1, size = 10 } = req.query;
  const offset = (page - 1) * size;

  try {
    const products = await Product.findAndCountAll({
      include: { model: Category, attributes: ["name"] },
      limit: parseInt(size),
      offset: parseInt(offset),
    });

    logger.info(`Fetched ${products.rows.length} products from page ${page}`);
    res.status(200).json({
      message: "Products fetched successfully",
      data: products.rows,
      total: products.count,
    });
  } catch (error) {
    logger.error(`Failed to fetch products: ${error.message}`);
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Product.update(req.body, { where: { id } });
    if (updated[0]) {
      logger.info(`Product with ID ${id} updated successfully`);
      res.status(200).json({ message: "Product updated successfully" });
    } else {
      logger.warn(`Product with ID ${id} not found`);
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    logger.error(`Failed to update product: ${error.message}`);
    res
      .status(500)
      .json({ message: "Failed to update product", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.destroy({ where: { id } });
    if (deleted) {
      logger.info(`Product with ID ${id} deleted successfully`);
      res.status(204).send();
    } else {
      logger.warn(`Product with ID ${id} not found`);
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    logger.error(`Failed to delete product: ${error.message}`);
    res
      .status(500)
      .json({ message: "Failed to delete product", error: error.message });
  }
};
