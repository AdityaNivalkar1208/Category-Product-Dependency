const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const logger = require("../config/logger");

class ProductService {
  async createProduct(productData) {
    try {
      const product = await Product.create(productData);
      logger.info(`Product created successfully: ${product.name}`);
      return product;
    } catch (error) {
      logger.error(
        `Service error - Failed to create product: ${error.message}`
      );
      throw error;
    }
  }

  async getAllProducts(page = 1, size = 10) {
    try {
      const offset = (page - 1) * size;
      const products = await Product.findAndCountAll({
        include: {
          model: Category,
          attributes: ["name"],
        },
        limit: parseInt(size),
        offset: parseInt(offset),
      });

      logger.info(
        `Service fetched ${products.rows.length} products from page ${page}`
      );
      return {
        products: products.rows,
        total: products.count,
        currentPage: page,
        pageSize: size,
        totalPages: Math.ceil(products.count / size),
      };
    } catch (error) {
      logger.error(
        `Service error - Failed to fetch products: ${error.message}`
      );
      throw error;
    }
  }

  async updateProduct(id, updateData) {
    try {
      const [updated] = await Product.update(updateData, {
        where: { id },
        returning: true,
      });

      if (!updated) {
        logger.warn(`Service - Product with ID ${id} not found`);
        throw new Error("Product not found");
      }

      logger.info(`Service - Product with ID ${id} updated successfully`);
      return updated;
    } catch (error) {
      logger.error(
        `Service error - Failed to update product: ${error.message}`
      );
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const deleted = await Product.destroy({ where: { id } });

      if (!deleted) {
        logger.warn(`Service - Product with ID ${id} not found`);
        throw new Error("Product not found");
      }

      logger.info(`Service - Product with ID ${id} deleted successfully`);
      return deleted;
    } catch (error) {
      logger.error(
        `Service error - Failed to delete product: ${error.message}`
      );
      throw error;
    }
  }
}

module.exports = new ProductService();
