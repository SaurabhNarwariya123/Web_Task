require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const productRoutes = require("./src/routes/productRoutes");

const app = express();

connectDB();

app.use(cors({ origin: "*", credentials: false }));
app.use(express.json());

app.use("/api/products", productRoutes);

app.get("/health", (req, res) => res.json({ status: "ok" }));

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
