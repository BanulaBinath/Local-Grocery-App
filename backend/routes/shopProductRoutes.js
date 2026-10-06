const express = require("express");
const multer = require("multer");
const path = require("path");

const ShopProduct = require("../models/ShopProduct");

const router = express.Router();

// ========================================
// IMAGE UPLOAD CONFIGURATION
// ========================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + extension;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."));
    }
  },
});

// ==================================================
// GET ALL ACTIVE SHOP PRODUCTS (customers + staff)
// ==================================================
router.get("/", async (req, res) => {
  try {
    const { all } = req.query;

    const filter =
      all === "true"
        ? {}
        : { status: "active" };

    const products = await ShopProduct.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Shop products loaded successfully.",
      products,
    });
  } catch (error) {
    console.error("Get shop products error:", error);

    return res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

// ==================================================
// GET SINGLE PRODUCT
// ==================================================
router.get("/:productId", async (req, res) => {
  try {
    const product = await ShopProduct.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      message: "Product loaded successfully.",
      product,
    });
  } catch (error) {
    console.error("Get shop product error:", error);

    return res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

// ==================================================
// CREATE SHOP PRODUCT (Customer Staff)
// ==================================================
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      price,
      stockQuantity,
      unit,
      image,
      inStock,
      createdBy,
    } = req.body;

    if (!name || price === undefined || stockQuantity === undefined) {
      return res.status(400).json({
        message: "Name, price and stock quantity are required.",
      });
    }

    const product = new ShopProduct({
      name: String(name).trim(),
      category: category ? String(category).trim() : "General",
      description: description ? String(description).trim() : "",
      price: Number(price),
      stockQuantity: Number(stockQuantity),
      unit: unit ? String(unit).trim() : "pcs",
      image: req.file ? `/uploads/${req.file.filename}` : (image || ""),
      inStock:
        inStock === undefined
          ? Number(stockQuantity) > 0
          : Boolean(inStock),
      createdBy: createdBy || null,
    });

    await product.save();

    return res.status(201).json({
      message: "Product added successfully.",
      product,
    });
  } catch (error) {
    console.error("Create shop product error:", error);

    return res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

// ==================================================
// UPDATE SHOP PRODUCT
// ==================================================
router.put("/:productId", upload.single("image"), async (req, res) => {
  try {
    const product = await ShopProduct.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    const {
      name,
      category,
      description,
      price,
      stockQuantity,
      unit,
      image,
      inStock,
      status,
    } = req.body;

    if (name !== undefined) product.name = String(name).trim();
    if (category !== undefined) product.category = String(category).trim();
    if (description !== undefined) {
      product.description = String(description).trim();
    }
    if (price !== undefined) product.price = Number(price);
    if (stockQuantity !== undefined) {
      product.stockQuantity = Number(stockQuantity);
    }
    if (unit !== undefined) product.unit = String(unit).trim();
    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    } else if (image !== undefined && image !== "") {
      product.image = image;
    }
    if (inStock !== undefined) product.inStock = Boolean(inStock);
    if (status !== undefined) product.status = status;

    if (product.stockQuantity <= 0) {
      product.inStock = false;
    } else if (inStock === undefined) {
      product.inStock = true;
    }

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error("Update shop product error:", error);

    return res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

// ==================================================
// DELETE / DEACTIVATE SHOP PRODUCT
// ==================================================
router.delete("/:productId", async (req, res) => {
  try {
    const product = await ShopProduct.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    product.status = "inactive";
    product.inStock = false;
    await product.save();

    return res.status(200).json({
      message: "Product removed successfully.",
      product,
    });
  } catch (error) {
    console.error("Delete shop product error:", error);

    return res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

module.exports = router;
