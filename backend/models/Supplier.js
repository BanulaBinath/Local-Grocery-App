const mongoose = require("mongoose");

// ========================================
// SUPPLIER SCHEMA
// ========================================

const supplierSchema = new mongoose.Schema(
  {
    // ========================================
    // PROFILE IMAGE
    // ========================================

    profileImage: {
      type: String,
      default: "",
    },

    // ========================================
    // NIC
    // ========================================

    nic: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // ========================================
    // EMAIL
    // ========================================

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // ========================================
    // FULL NAME
    // ========================================

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    // ========================================
    // PASSWORD
    // ========================================

    password: {
      type: String,
      required: true,
    },

    // ========================================
    // ADDRESS
    // ========================================

    address: {
      type: String,
      required: true,
      trim: true,
    },

    // ========================================
    // BUSINESS NAME
    // ========================================

    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    // ========================================
    // BUSINESS REGISTRATION NUMBER
    // ========================================

    businessRegistrationNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // ========================================
    // STATUS
    // ========================================

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },

  {
    timestamps: true,
  },
);

// ========================================
// EXPORT SUPPLIER MODEL
// ========================================

module.exports = mongoose.model("Supplier", supplierSchema);
