const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    // ========================================
    // SUPPLIER
    // ========================================

    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },

    // ========================================
    // PRODUCT INFORMATION
    // ========================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    // ========================================
    // PRICE
    // ========================================

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    // ========================================
    // STOCK
    // ========================================

    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    // ========================================
    // UNIT
    // ========================================

    unit: {
      type: String,
      required: true,
      trim: true,
    },

    // ========================================
    // PRODUCT IMAGE
    // ========================================

    image: {
      type: String,
      default: "",
    },

    // ========================================
    // PRODUCT STATUS
    // ========================================

    status: {
      type: String,
      enum: ["active", "inactive", "out_of_stock"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);
