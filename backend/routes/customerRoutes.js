const express = require("express");
const bcrypt = require("bcryptjs");
const Customer = require("../models/Customer");

const router = express.Router();

// ========================================
// CUSTOMER REGISTER
// ========================================
router.post("/register", async (req, res) => {
  try {
    const { profileImage, nic, email, fullName, password, address } = req.body;

    // Check required fields
    if (!nic || !email || !fullName || !password || !address) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    // Check existing customer
    const existingCustomer = await Customer.findOne({
      $or: [{ email: email.toLowerCase().trim() }, { nic: nic.trim() }],
    });

    if (existingCustomer) {
      return res.status(400).json({
        message: "Customer with this email or NIC already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create customer
    const customer = new Customer({
      profileImage: profileImage || "",
      nic: nic.trim(),
      email: email.toLowerCase().trim(),
      fullName: fullName.trim(),
      password: hashedPassword,
      address: address.trim(),
    });

    await customer.save();

    res.status(201).json({
      message: "Customer registered successfully!",
      customer: {
        id: customer._id,
        profileImage: customer.profileImage,
        nic: customer.nic,
        email: customer.email,
        fullName: customer.fullName,
        address: customer.address,
      },
    });
  } catch (error) {
    console.error("Customer registration error:", error);

    res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

// ========================================
// CUSTOMER LOGIN
// ========================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password.",
      });
    }

    // Find customer
    const customer = await Customer.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer account not found.",
      });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, customer.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Incorrect password.",
      });
    }

    // Login successful
    res.status(200).json({
      message: "Login successful!",
      customer: {
        id: customer._id,
        profileImage: customer.profileImage,
        nic: customer.nic,
        email: customer.email,
        fullName: customer.fullName,
        address: customer.address,
      },
    });
  } catch (error) {
    console.error("Customer login error:", error);

    res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

module.exports = router;
