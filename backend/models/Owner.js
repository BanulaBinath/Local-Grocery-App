const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      default: "owner",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Owner", ownerSchema);
