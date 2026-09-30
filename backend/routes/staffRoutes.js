const express = require("express");
const bcrypt = require("bcryptjs");

const SupplierStaff = require("../models/SupplierStaff");
const CustomerStaff = require("../models/CustomerStaff");

const router = express.Router();

// ========================================
// GENERATE TEMPORARY PASSWORD
// ========================================
const generateTemporaryPassword = () => {
  const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

  let password = "";

  for (let i = 0; i < 10; i++) {
    password += characters[Math.floor(Math.random() * characters.length)];
  }

  return password;
};

// ========================================
// ADD SUPPLIER STAFF
// ========================================
router.post("/supplier", async (req, res) => {
  try {
    const { profileImage, nic, email, fullName, address, phoneNumber } =
      req.body;

    if (!nic || !email || !fullName || !address || !phoneNumber) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    const cleanNic = nic.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanAddress = address.trim();
    const cleanPhone = phoneNumber.trim();

    const existingSupplierStaff = await SupplierStaff.findOne({
      $or: [
        { nic: cleanNic },
        { email: cleanEmail },
        { phoneNumber: cleanPhone },
      ],
    });

    const existingCustomerStaff = await CustomerStaff.findOne({
      $or: [
        { nic: cleanNic },
        { email: cleanEmail },
        { phoneNumber: cleanPhone },
      ],
    });

    if (existingSupplierStaff || existingCustomerStaff) {
      return res.status(400).json({
        message:
          "A staff account with this NIC, email or phone number already exists.",
      });
    }

    const temporaryPassword = generateTemporaryPassword();

    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    const staff = new SupplierStaff({
      profileImage: profileImage || "",
      nic: cleanNic,
      email: cleanEmail,
      fullName: cleanName,
      address: cleanAddress,
      phoneNumber: cleanPhone,
      password: hashedPassword,
      role: "supplier_staff",
      mustChangePassword: true,
    });

    await staff.save();

    return res.status(201).json({
      message: "Supplier Staff account created successfully.",

      staff: {
        id: staff._id,
        profileImage: staff.profileImage,
        nic: staff.nic,
        email: staff.email,
        fullName: staff.fullName,
        address: staff.address,
        phoneNumber: staff.phoneNumber,
        role: staff.role,
        mustChangePassword: staff.mustChangePassword,
      },

      temporaryPassword,
    });
  } catch (error) {
    console.error("Add Supplier Staff error:", error);

    return res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

// ========================================
// ADD CUSTOMER STAFF
// ========================================
router.post("/customer", async (req, res) => {
  try {
    const { profileImage, nic, email, fullName, address, phoneNumber } =
      req.body;

    if (!nic || !email || !fullName || !address || !phoneNumber) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    const cleanNic = nic.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const cleanAddress = address.trim();
    const cleanPhone = phoneNumber.trim();

    const existingSupplierStaff = await SupplierStaff.findOne({
      $or: [
        { nic: cleanNic },
        { email: cleanEmail },
        { phoneNumber: cleanPhone },
      ],
    });

    const existingCustomerStaff = await CustomerStaff.findOne({
      $or: [
        { nic: cleanNic },
        { email: cleanEmail },
        { phoneNumber: cleanPhone },
      ],
    });

    if (existingSupplierStaff || existingCustomerStaff) {
      return res.status(400).json({
        message:
          "A staff account with this NIC, email or phone number already exists.",
      });
    }

    const temporaryPassword = generateTemporaryPassword();

    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    const staff = new CustomerStaff({
      profileImage: profileImage || "",
      nic: cleanNic,
      email: cleanEmail,
      fullName: cleanName,
      address: cleanAddress,
      phoneNumber: cleanPhone,
      password: hashedPassword,
      role: "customer_staff",
      mustChangePassword: true,
    });

    await staff.save();

    return res.status(201).json({
      message: "Customer Staff account created successfully.",

      staff: {
        id: staff._id,
        profileImage: staff.profileImage,
        nic: staff.nic,
        email: staff.email,
        fullName: staff.fullName,
        address: staff.address,
        phoneNumber: staff.phoneNumber,
        role: staff.role,
        mustChangePassword: staff.mustChangePassword,
      },

      temporaryPassword,
    });
  } catch (error) {
    console.error("Add Customer Staff error:", error);

    return res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

// ========================================
// GET ALL SUPPLIER STAFF
// ========================================
router.get("/supplier", async (req, res) => {
  try {
    const staff = await SupplierStaff.find(
      {},
      {
        password: 0,
      },
    ).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      staff,
    });
  } catch (error) {
    console.error("Get Supplier Staff error:", error);

    return res.status(500).json({
      message: "Server error. Could not load supplier staff.",
    });
  }
});

// ========================================
// EDIT SUPPLIER STAFF PROFILE
// ========================================
router.put("/supplier/:staffId", async (req, res) => {
  try {
    const { staffId } = req.params;

    const { fullName, email, address, phoneNumber, nic } = req.body;

    if (!fullName || !email || !address || !phoneNumber || !nic) {
      return res.status(400).json({
        message:
          "Full name, email, NIC, address and phone number are required.",
      });
    }

    const staff = await SupplierStaff.findById(staffId);

    if (!staff) {
      return res.status(404).json({
        message: "Supplier Staff account not found.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const cleanNic = nic.trim();
    const cleanPhone = phoneNumber.trim();

    const supplierDuplicate = await SupplierStaff.findOne({
      _id: { $ne: staffId },
      $or: [
        { email: cleanEmail },
        { nic: cleanNic },
        { phoneNumber: cleanPhone },
      ],
    });

    const customerDuplicate = await CustomerStaff.findOne({
      $or: [
        { email: cleanEmail },
        { nic: cleanNic },
        { phoneNumber: cleanPhone },
      ],
    });

    if (supplierDuplicate || customerDuplicate) {
      return res.status(400).json({
        message:
          "Another staff account already uses this email, NIC or phone number.",
      });
    }

    staff.fullName = fullName.trim();
    staff.email = cleanEmail;
    staff.nic = cleanNic;
    staff.address = address.trim();
    staff.phoneNumber = cleanPhone;

    await staff.save();

    return res.status(200).json({
      message: "Profile updated successfully.",

      staff: {
        id: staff._id,
        profileImage: staff.profileImage || "",
        nic: staff.nic,
        email: staff.email,
        fullName: staff.fullName,
        address: staff.address,
        phoneNumber: staff.phoneNumber,
        role: staff.role,
        mustChangePassword: staff.mustChangePassword,
      },
    });
  } catch (error) {
    console.error("Update Supplier Staff profile error:", error);

    return res.status(500).json({
      message: "Server error. Could not update profile.",
    });
  }
});

// ========================================
// EDIT CUSTOMER STAFF PROFILE
// ========================================
router.put("/customer/:staffId", async (req, res) => {
  try {
    const { staffId } = req.params;

    const { fullName, email, address, phoneNumber, nic } = req.body;

    if (!fullName || !email || !address || !phoneNumber || !nic) {
      return res.status(400).json({
        message:
          "Full name, email, NIC, address and phone number are required.",
      });
    }

    const staff = await CustomerStaff.findById(staffId);

    if (!staff) {
      return res.status(404).json({
        message: "Customer Staff account not found.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const cleanNic = nic.trim();
    const cleanPhone = phoneNumber.trim();

    const supplierDuplicate = await SupplierStaff.findOne({
      $or: [
        { email: cleanEmail },
        { nic: cleanNic },
        { phoneNumber: cleanPhone },
      ],
    });

    const customerDuplicate = await CustomerStaff.findOne({
      _id: { $ne: staffId },
      $or: [
        { email: cleanEmail },
        { nic: cleanNic },
        { phoneNumber: cleanPhone },
      ],
    });

    if (supplierDuplicate || customerDuplicate) {
      return res.status(400).json({
        message:
          "Another staff account already uses this email, NIC or phone number.",
      });
    }

    staff.fullName = fullName.trim();
    staff.email = cleanEmail;
    staff.nic = cleanNic;
    staff.address = address.trim();
    staff.phoneNumber = cleanPhone;

    await staff.save();

    return res.status(200).json({
      message: "Profile updated successfully.",

      staff: {
        id: staff._id,
        profileImage: staff.profileImage || "",
        nic: staff.nic,
        email: staff.email,
        fullName: staff.fullName,
        address: staff.address,
        phoneNumber: staff.phoneNumber,
        role: staff.role,
        mustChangePassword: staff.mustChangePassword,
      },
    });
  } catch (error) {
    console.error("Update Customer Staff profile error:", error);

    return res.status(500).json({
      message: "Server error. Could not update profile.",
    });
  }
});

// ========================================
// CHANGE SUPPLIER STAFF PASSWORD
// ========================================
router.put("/supplier/:staffId/password", async (req, res) => {
  try {
    const { staffId } = req.params;

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters.",
      });
    }

    const staff = await SupplierStaff.findById(staffId);

    if (!staff) {
      return res.status(404).json({
        message: "Supplier Staff account not found.",
      });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, staff.password);

    if (!passwordMatch) {
      return res.status(400).json({
        message: "Current password is incorrect.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    staff.password = hashedPassword;
    staff.mustChangePassword = false;

    await staff.save();

    return res.status(200).json({
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change Supplier Staff password error:", error);

    return res.status(500).json({
      message: "Server error. Could not change password.",
    });
  }
});

// ========================================
// CHANGE CUSTOMER STAFF PASSWORD
// ========================================
router.put("/customer/:staffId/password", async (req, res) => {
  try {
    const { staffId } = req.params;

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters.",
      });
    }

    const staff = await CustomerStaff.findById(staffId);

    if (!staff) {
      return res.status(404).json({
        message: "Customer Staff account not found.",
      });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, staff.password);

    if (!passwordMatch) {
      return res.status(400).json({
        message: "Current password is incorrect.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    staff.password = hashedPassword;
    staff.mustChangePassword = false;

    await staff.save();

    return res.status(200).json({
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change Customer Staff password error:", error);

    return res.status(500).json({
      message: "Server error. Could not change password.",
    });
  }
});

module.exports = router;
