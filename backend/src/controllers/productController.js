const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const { uploadToCloudinary } = require("../middleware/upload");

// GET /api/products
// Query params: page, limit, search, startDate, endDate, minPrice, maxPrice
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      startDate,
      endDate,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const allowedSortFields = { name: 1, price: 1, createdAt: 1 };
    const sortField = allowedSortFields[sortBy] ? sortBy : "createdAt";
    const sortDir = sortOrder === "asc" ? 1 : -1;

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ [sortField]: sortDir }).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        from: total === 0 ? 0 : skip + 1,
        to: Math.min(skip + limitNum, total),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/products
const createProduct = async (req, res) => {
  const uploadedPublicIds = [];
  try {
    const { name, price } = req.body;

    const imageUrls = await Promise.all(
      (req.files || []).map(async (file) => {
        const result = await uploadToCloudinary(file.buffer);
        uploadedPublicIds.push(result.public_id);
        return result.secure_url;
      })
    );

    const product = await Product.create({ name, price, images: imageUrls });
    res.status(201).json(product);
  } catch (error) {
    // cleanup uploaded images if DB save fails
    if (uploadedPublicIds.length) {
      await Promise.allSettled(
        uploadedPublicIds.map((id) => cloudinary.uploader.destroy(id))
      );
    }
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.images.length) {
      const publicIds = product.images.map((url) => {
        const parts = url.split("/");
        const withoutExt = parts[parts.length - 1].split(".")[0];
        const folder = parts[parts.length - 2];
        return `${folder}/${withoutExt}`;
      });
      await Promise.allSettled(
        publicIds.map((id) => cloudinary.uploader.destroy(id))
      );
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, deleteProduct };
