const express = require("express");
const multer = require("multer");
const path = require("path");

const Product = require("../models/Product");
const Supplier = require("../models/Supplier");

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

    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + extension;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: function (req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."));
    }
  },
});

// ========================================
// ADD PRODUCT
// ========================================

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      supplierId,
      name,
      category,
      description,
      price,
      stockQuantity,
      unit,
    } = req.body;

    if (
      !supplierId ||
      !name ||
      !category ||
      price === undefined ||
      stockQuantity === undefined ||
      !unit
    ) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    const supplier = await Supplier.findById(supplierId);

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found.",
      });
    }

    if (supplier.status !== "approved") {
      return res.status(403).json({
        message: "Only approved suppliers can add products.",
      });
    }

    // Stock 0 = out_of_stock
    // Stock > 0 = active
    const productStatus = Number(stockQuantity) > 0 ? "active" : "out_of_stock";

    // ========================================
    // IMAGE PATH
    // ========================================

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    const product = new Product({
      supplierId,
      name: name.trim(),
      category: category.trim(),
      description: description ? description.trim() : "",
      price: Number(price),
      stockQuantity: Number(stockQuantity),
      unit: unit.trim(),
      image: imagePath,
      status: productStatus,
    });

    await product.save();

    res.status(201).json({
      message: "Product added successfully.",
      product,
    });
  } catch (error) {
    console.error("Add product error:", error);

    res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

// ========================================
// GET SUPPLIER PRODUCTS
// ========================================

router.get("/supplier/:supplierId", async (req, res) => {
  try {
    const { supplierId } = req.params;

    const products = await Product.find({
      supplierId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      products,
    });
  } catch (error) {
    console.error("Get supplier products error:", error);

    res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

// ========================================
// GET SINGLE PRODUCT
// ========================================

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    res.status(200).json({
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

// ========================================
// UPDATE PRODUCT
// ========================================

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const {
      supplierId,
      name,
      category,
      description,
      price,
      stockQuantity,
      unit,
      image,
      status,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    // ========================================
    // CHECK SUPPLIER OWNERSHIP
    // ========================================

    if (supplierId && product.supplierId.toString() !== supplierId.toString()) {
      return res.status(403).json({
        message: "You are not allowed to update this product.",
      });
    }

    if (name !== undefined) {
      product.name = name.trim();
    }

    if (category !== undefined) {
      product.category = category.trim();
    }

    if (description !== undefined) {
      product.description = description.trim();
    }

    if (price !== undefined) {
      product.price = Number(price);
    }

    if (stockQuantity !== undefined) {
      product.stockQuantity = Number(stockQuantity);
    }

    if (unit !== undefined) {
      product.unit = unit.trim();
    }

    // ========================================
    // IMAGE
    // ========================================

    // New image uploaded
    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }
    // Keep existing image when no new image
    else if (image !== undefined && image !== "") {
      product.image = image;
    }

    // ========================================
    // STATUS
    // ========================================

    if (status !== undefined) {
      product.status = status;
    }

    // Stock 0 = out_of_stock
    if (Number(product.stockQuantity) <= 0) {
      product.stockQuantity = 0;
      product.status = "out_of_stock";
    } else if (product.status === "out_of_stock") {
      product.status = "active";
    }

    await product.save();

    res.status(200).json({
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

// ========================================
// TOGGLE ACTIVE / INACTIVE
// ========================================

router.put("/:id/status", async (req, res) => {
  try {
    const { supplierId, status } = req.body;

    if (!supplierId) {
      return res.status(400).json({
        message: "Supplier ID is required.",
      });
    }

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        message: "Invalid product status.",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    if (product.supplierId.toString() !== supplierId.toString()) {
      return res.status(403).json({
        message: "You are not allowed to update this product.",
      });
    }

    if (status === "active" && Number(product.stockQuantity) <= 0) {
      return res.status(400).json({
        message: "This product cannot be activated because it is out of stock.",
      });
    }

    product.status = status;

    await product.save();

    res.status(200).json({
      message:
        status === "active"
          ? "Product activated successfully."
          : "Product deactivated successfully.",
      product,
    });
  } catch (error) {
    console.error("Toggle product status error:", error);

    res.status(500).json({
      message: "Server error. Could not update product status.",
    });
  }
});

// ========================================
// DELETE PRODUCT
// ========================================

router.delete("/:id", async (req, res) => {
  try {
    const { supplierId } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    if (supplierId && product.supplierId.toString() !== supplierId.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this product.",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

module.exports = router;
