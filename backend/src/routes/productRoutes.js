const express = require("express");
const router = express.Router();
const { upload } = require("../middleware/upload");
const {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
} = require("../controllers/productController");

const handleUploadError = (err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "Each image must be under 4MB" });
  }
  if (err.message) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
};

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post(
  "/",
  (req, res, next) =>
    upload.array("images", 4)(req, res, (err) => {
      if (err) return handleUploadError(err, req, res, next);
      next();
    }),
  createProduct
);
router.delete("/:id", deleteProduct);

module.exports = router;
