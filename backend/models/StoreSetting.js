const mongoose = require("mongoose");

const storeSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
      default: "default",
    },
    isStoreOpen: {
      type: Boolean,
      default: true,
    },
    openingTime: {
      type: String,
      default: "08:00",
      trim: true,
    },
    closingTime: {
      type: String,
      default: "20:00",
      trim: true,
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    pickupFee: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.StoreSetting ||
  mongoose.model("StoreSetting", storeSettingSchema);
