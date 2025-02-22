const Category = require("../models/categoryModel");
const logger = require("../config/logger");

class CategoryService {
  async createCategory(categoryData) {
    try {
      const category = await Category.create(categoryData);
      logger.info(`Service - Category created successfully: ${category.name}`);
      return category;
    } catch (error) {
      logger.error(
        `Service error - Failed to create category: ${error.message}`
      );
      throw error;
    }
  }

  async getAllCategories() {
    try {
      const categories = await Category.findAll();
      logger.info(`Service fetched ${categories.length} categories`);
      return categories;
    } catch (error) {
      logger.error(
        `Service error - Failed to fetch categories: ${error.message}`
      );
      throw error;
    }
  }

  async updateCategory(id, updateData) {
    try {
      const [updated] = await Category.update(updateData, {
        where: { id },
        returning: true,
      });

      if (!updated) {
        logger.warn(`Service - Category with ID ${id} not found`);
        throw new Error("Category not found");
      }

      logger.info(`Service - Category with ID ${id} updated successfully`);
      return updated;
    } catch (error) {
      logger.error(
        `Service error - Failed to update category: ${error.message}`
      );
      throw error;
    }
  }

  async deleteCategory(id) {
    try {
      const deleted = await Category.destroy({ where: { id } });

      if (!deleted) {
        logger.warn(`Service - Category with ID ${id} not found`);
        throw new Error("Category not found");
      }

      logger.info(`Service - Category with ID ${id} deleted successfully`);
      return deleted;
    } catch (error) {
      logger.error(
        `Service error - Failed to delete category: ${error.message}`
      );
      throw error;
    }
  }
}

module.exports = new CategoryService();
