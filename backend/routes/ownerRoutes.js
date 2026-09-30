const express = require("express");
const bcrypt = require("bcryptjs");

const Owner = require("../models/Owner");
const Supplier = require("../models/Supplier");

const router = express.Router();

// ========================================
// CREATE OWNER ACCOUNT
// ========================================
router.post("/create", async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Check required fields
    if (!email || !password || !fullName) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    // Check existing owner
    const existingOwner = await Owner.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingOwner) {
      return res.status(400).json({
        message: "Owner account already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create owner
    const owner = new Owner({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      fullName: fullName.trim(),
      role: "owner",
    });

    await owner.save();

    res.status(201).json({
      message: "Owner account created successfully.",
      owner: {
        id: owner._id,
        email: owner.email,
        fullName: owner.fullName,
        role: owner.role,
      },
    });
  } catch (error) {
    console.error("Owner creation error:", error);

    res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

// ========================================
// GET PENDING SUPPLIERS
// ========================================
router.get("/suppliers/pending", async (req, res) => {
  try {
    const suppliers = await Supplier.find({
      status: "pending",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      suppliers,
    });
  } catch (error) {
    console.error("Get pending suppliers error:", error);

    res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

// ========================================
// GET ALL SUPPLIERS
// ========================================
router.get("/suppliers", async (req, res) => {
  try {
    const suppliers = await Supplier.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      suppliers,
    });
  } catch (error) {
    console.error("Get suppliers error:", error);

    res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

// ========================================
// APPROVE SUPPLIER
// ========================================
router.put("/suppliers/:id/approve", async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found.",
      });
    }

    supplier.status = "approved";

    await supplier.save();

    res.status(200).json({
      message: "Supplier approved successfully.",
      supplier: {
        id: supplier._id,
        fullName: supplier.fullName,
        email: supplier.email,
        businessName: supplier.businessName,
        businessRegistrationNo: supplier.businessRegistrationNo,
        status: supplier.status,
      },
    });
  } catch (error) {
    console.error("Approve supplier error:", error);

    res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

// ========================================
// REJECT SUPPLIER
// ========================================
router.put("/suppliers/:id/reject", async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found.",
      });
    }

    supplier.status = "rejected";

    await supplier.save();

    res.status(200).json({
      message: "Supplier rejected successfully.",
      supplier: {
        id: supplier._id,
        fullName: supplier.fullName,
        email: supplier.email,
        businessName: supplier.businessName,
        businessRegistrationNo: supplier.businessRegistrationNo,
        status: supplier.status,
      },
    });
  } catch (error) {
    console.error("Reject supplier error:", error);

    res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

module.exports = router;
