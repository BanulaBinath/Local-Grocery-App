const express = require("express");
const path = require("path");
const fs = require("fs");

const ShopProduct = require("../models/ShopProduct");

const router = express.Router();

// ========================================
// ENSURE UPLOADS DIR EXISTS
// ========================================
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ========================================
// HELPER: Save base64 image to disk
// Returns the server path like /uploads/filename.jpg
// ========================================
function saveBase64Image(base64Data, mimeType) {
  let ext = "jpg";
  if (mimeType) {
    if (mimeType.includes("png")) ext = "png";
    else if (mimeType.includes("webp")) ext = "webp";
    else if (mimeType.includes("gif")) ext = "gif";
  }
  const filename = `product-${Date.now()}-${Math.round(Math.random() * 1e8)}.${ext}`;
  const filepath = path.join(uploadsDir, filename);

  // Strip data URI prefix if present (e.g. "data:image/jpeg;base64,")
  const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, "");
  fs.writeFileSync(filepath, Buffer.from(cleanBase64, "base64"));

  return `/uploads/${filename}`;
}

// ==================================================
// GET ALL ACTIVE SHOP PRODUCTS (customers + staff)
// ==================================================
router.get("/", async (req, res) => {
  try {
    const { all } = req.query;
    const filter = all === "true" ? {} : { status: "active" };
    const products = await ShopProduct.find(filter).sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Shop products loaded successfully.",
      products,
    });
  } catch (error) {
    console.error("Get shop products error:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ==================================================
// GET SINGLE PRODUCT
// ==================================================
router.get("/:productId", async (req, res) => {
  try {
    const product = await ShopProduct.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    return res.status(200).json({
      message: "Product loaded successfully.",
      product,
    });
  } catch (error) {
    console.error("Get shop product error:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ==================================================
// CREATE SHOP PRODUCT (JSON + optional base64 image)
// ==================================================
router.post("/", async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      price,
      stockQuantity,
      unit,
      image,
      imageBase64,
      imageMime,
      inStock,
      createdBy,
    } = req.body;

    if (!name || price === undefined || stockQuantity === undefined) {
      return res.status(400).json({
        message: "Name, price and stock quantity are required.",
      });
    }

    // Handle image
    let imagePath = image || "";
    if (imageBase64) {
      imagePath = saveBase64Image(imageBase64, imageMime || "image/jpeg");
    }

    const product = new ShopProduct({
      name: String(name).trim(),
      category: category ? String(category).trim() : "General",
      description: description ? String(description).trim() : "",
      price: Number(price),
      stockQuantity: Number(stockQuantity),
      unit: unit ? String(unit).trim() : "pcs",
      image: imagePath,
      inStock: inStock === undefined ? Number(stockQuantity) > 0 : Boolean(inStock),
      createdBy: createdBy || null,
    });

    await product.save();

    return res.status(201).json({
      message: "Product added successfully.",
      product,
    });
  } catch (error) {
    console.error("Create shop product error:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ==================================================
// UPDATE SHOP PRODUCT (JSON + optional base64 image)
// ==================================================
router.put("/:productId", async (req, res) => {
  try {
    const product = await ShopProduct.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const {
      name,
      category,
      description,
      price,
      stockQuantity,
      unit,
      image,
      imageBase64,
      imageMime,
      inStock,
      status,
    } = req.body;

    if (name !== undefined) product.name = String(name).trim();
    if (category !== undefined) product.category = String(category).trim();
    if (description !== undefined) product.description = String(description).trim();
    if (price !== undefined) product.price = Number(price);
    if (stockQuantity !== undefined) product.stockQuantity = Number(stockQuantity);
    if (unit !== undefined) product.unit = String(unit).trim();
    if (status !== undefined) product.status = status;

    // Image: base64 takes priority
    if (imageBase64) {
      product.image = saveBase64Image(imageBase64, imageMime || "image/jpeg");
    } else if (image !== undefined && image !== "") {
      product.image = image;
    }

    // Auto update inStock based on quantity
    if (product.stockQuantity <= 0) {
      product.inStock = false;
    } else if (inStock !== undefined) {
      product.inStock = Boolean(inStock);
    } else {
      product.inStock = true;
    }

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error("Update shop product error:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ==================================================
// DELETE / DEACTIVATE SHOP PRODUCT
// ==================================================
router.delete("/:productId", async (req, res) => {
  try {
    const product = await ShopProduct.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
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
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
