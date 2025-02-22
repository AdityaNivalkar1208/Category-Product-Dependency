const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Category = require("./categoryModel");

const Product = sequelize.define(
  "Product",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    categoryId: {
      type: DataTypes.INTEGER,
      references: { model: Category, key: "id" },
    },
  },
  { timestamps: true }
);

Product.belongsTo(Category, { foreignKey: "categoryId" });

module.exports = Product;
