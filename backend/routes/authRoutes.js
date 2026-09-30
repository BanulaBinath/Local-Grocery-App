const express = require("express");
const bcrypt = require("bcryptjs");

const Customer = require("../models/Customer");
const Supplier = require("../models/Supplier");
const Owner = require("../models/Owner");
const SupplierStaff = require("../models/SupplierStaff");
const CustomerStaff = require("../models/CustomerStaff");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ========================================
    // VALIDATION
    // ========================================

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // ========================================
    // CUSTOMER
    // ========================================

    const customer = await Customer.findOne({
      email: cleanEmail,
    });

    if (customer) {
      const passwordMatch = await bcrypt.compare(password, customer.password);

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Incorrect password.",
        });
      }

      return res.status(200).json({
        message: "Login successful!",
        role: "customer",

        user: {
          id: customer._id,
          profileImage: customer.profileImage || "",
          nic: customer.nic,
          email: customer.email,
          fullName: customer.fullName,
          address: customer.address,
        },
      });
    }

    // ========================================
    // SUPPLIER
    // ========================================

    const supplier = await Supplier.findOne({
      email: cleanEmail,
    });

    if (supplier) {
      const passwordMatch = await bcrypt.compare(password, supplier.password);

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Incorrect password.",
        });
      }

      if (supplier.status !== "approved") {
        return res.status(403).json({
          message: "Your supplier account has not been approved yet.",
        });
      }

      return res.status(200).json({
        message: "Login successful!",
        role: "supplier",

        user: {
          id: supplier._id,
          profileImage: supplier.profileImage || "",
          nic: supplier.nic,
          email: supplier.email,
          fullName: supplier.fullName,
          address: supplier.address,
          businessName: supplier.businessName,
          businessRegistrationNo: supplier.businessRegistrationNo,
          status: supplier.status,
        },
      });
    }

    // ========================================
    // OWNER
    // ========================================

    const owner = await Owner.findOne({
      email: cleanEmail,
    });

    if (owner) {
      const passwordMatch = await bcrypt.compare(password, owner.password);

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Incorrect password.",
        });
      }

      return res.status(200).json({
        message: "Login successful!",
        role: "owner",

        user: {
          id: owner._id,
          profileImage: owner.profileImage || "",
          nic: owner.nic,
          email: owner.email,
          fullName: owner.fullName,
          address: owner.address,
        },
      });
    }

    // ========================================
    // SUPPLIER STAFF
    // ========================================

    const supplierStaff = await SupplierStaff.findOne({
      email: cleanEmail,
    });

    if (supplierStaff) {
      const passwordMatch = await bcrypt.compare(
        password,
        supplierStaff.password,
      );

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Incorrect password.",
        });
      }

      return res.status(200).json({
        message: "Login successful!",
        role: "supplier_staff",

        user: {
          id: supplierStaff._id,
          profileImage: supplierStaff.profileImage || "",
          nic: supplierStaff.nic,
          email: supplierStaff.email,
          fullName: supplierStaff.fullName,
          address: supplierStaff.address,
          phoneNumber: supplierStaff.phoneNumber,
          role: supplierStaff.role,
          mustChangePassword: supplierStaff.mustChangePassword,
        },
      });
    }

    // ========================================
    // CUSTOMER STAFF
    // ========================================

    const customerStaff = await CustomerStaff.findOne({
      email: cleanEmail,
    });

    if (customerStaff) {
      const passwordMatch = await bcrypt.compare(
        password,
        customerStaff.password,
      );

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Incorrect password.",
        });
      }

      return res.status(200).json({
        message: "Login successful!",
        role: "customer_staff",

        user: {
          id: customerStaff._id,
          profileImage: customerStaff.profileImage || "",
          nic: customerStaff.nic,
          email: customerStaff.email,
          fullName: customerStaff.fullName,
          address: customerStaff.address,
          phoneNumber: customerStaff.phoneNumber,
          role: customerStaff.role,
          mustChangePassword: customerStaff.mustChangePassword,
        },
      });
    }

    // ========================================
    // ACCOUNT NOT FOUND
    // ========================================

    return res.status(404).json({
      message: "Account not found.",
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

module.exports = router;
