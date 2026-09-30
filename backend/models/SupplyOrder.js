const mongoose = require("mongoose");

const supplyOrderSchema = new mongoose.Schema(
  {
    supplierStaffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SupplierStaff",
      required: true,
    },

    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    productImage: {
      type: String,
      default: "",
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unit: {
      type: String,
      required: true,
      trim: true,
    },

    pricePerUnit: {
      type: Number,
      required: true,
      min: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    pickupLocation: {
      type: String,
      required: true,
      trim: true,
    },

    pickupDate: {
      type: String,
      required: true,
      trim: true,
    },

    pickupTime: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "ready_for_pickup",
        "completed",
      ],
      default: "pending",
    },

    note: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent OverwriteModelError
module.exports =
  mongoose.models.SupplyOrder ||
  mongoose.model("SupplyOrder", supplyOrderSchema);
