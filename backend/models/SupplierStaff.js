const mongoose = require("mongoose");

const supplierStaffSchema = new mongoose.Schema(
  {
    profileImage: {
      type: String,
      default: "",
    },

    nic: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "supplier_staff",
    },

    mustChangePassword: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    permissions: {
      manageSupplyOrders: {
        type: Boolean,
        default: true,
      },
      manageMessages: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("SupplierStaff", supplierStaffSchema);
