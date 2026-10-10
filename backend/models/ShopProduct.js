const mongoose = require("mongoose");

const shopProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      default: "General",
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    unit: {
      type: String,
      required: true,
      trim: true,
      default: "pcs",
    },

    image: {
      type: String,
      default: "",
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomerStaff",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports =
  mongoose.models.ShopProduct ||
  mongoose.model("ShopProduct", shopProductSchema);
