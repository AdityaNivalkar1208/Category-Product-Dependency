const express = require("express");
const bodyParser = require("body-parser");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const basicAuth = require("./Middlewares/basicAuth");

const app = express();

const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(bodyParser.json());

app.use("/api/categories", basicAuth, categoryRoutes);
app.use("/api/products", basicAuth, productRoutes);

module.exports = app;
