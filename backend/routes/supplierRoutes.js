const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Supplier = require("../models/Supplier");

const router = express.Router();

/* =========================
   IMAGE UPLOAD CONFIG
========================= */

const uploadDirectory = path.join(__dirname, "../uploads/suppliers");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const fileName =
      "supplier-" +
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      extension;

    cb(null, fileName);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."));
    }
  },
});

/* =========================
   SUPPLIER REGISTER
========================= */

router.post("/register", async (req, res) => {
  try {
    const {
      profileImage,
      nic,
      email,
      fullName,
      password,
      address,
      businessName,
      businessRegistrationNo,
    } = req.body;

    if (
      !nic ||
      !email ||
      !fullName ||
      !password ||
      !address ||
      !businessName ||
      !businessRegistrationNo
    ) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    const existingSupplier = await Supplier.findOne({
      $or: [
        { email: email.toLowerCase().trim() },
        { nic: nic.trim() },
        {
          businessRegistrationNo: businessRegistrationNo.trim(),
        },
      ],
    });

    if (existingSupplier) {
      return res.status(400).json({
        message:
          "Supplier with this email, NIC, or business registration number already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const supplier = new Supplier({
      profileImage: profileImage || "",
      nic: nic.trim(),
      email: email.toLowerCase().trim(),
      fullName: fullName.trim(),
      password: hashedPassword,
      address: address.trim(),
      businessName: businessName.trim(),
      businessRegistrationNo: businessRegistrationNo.trim(),
      status: "pending",
    });

    await supplier.save();

    return res.status(201).json({
      message:
        "Supplier registration submitted successfully. Please wait for Owner approval.",

      supplier: {
        id: supplier._id,
        profileImage: supplier.profileImage,
        nic: supplier.nic,
        email: supplier.email,
        fullName: supplier.fullName,
        address: supplier.address,
        businessName: supplier.businessName,
        businessRegistrationNo: supplier.businessRegistrationNo,
        status: supplier.status,
      },
    });
  } catch (error) {
    console.error("Supplier registration error:", error);

    return res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

/* =========================
   GET APPROVED SUPPLIERS
========================= */

router.get("/", async (req, res) => {
  try {
    const suppliers = await Supplier.find({
      status: "approved",
    }).select("-password");

    return res.status(200).json({
      suppliers,
    });
  } catch (error) {
    console.error("Get suppliers error:", error);

    return res.status(500).json({
      message: "Server error. Could not load suppliers.",
    });
  }
});

/* =========================
   UPDATE SUPPLIER PROFILE
   WITH PROFILE IMAGE
========================= */

router.put("/:supplierId", upload.single("profileImage"), async (req, res) => {
  try {
    const { supplierId } = req.params;

    const {
      fullName,
      email,
      nic,
      businessName,
      businessRegistrationNo,
      address,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !nic ||
      !businessName ||
      !businessRegistrationNo ||
      !address
    ) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    const supplier = await Supplier.findById(supplierId);

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found.",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const cleanNic = nic.trim();

    const cleanBusinessRegistrationNo = businessRegistrationNo.trim();

    /* CHECK EMAIL */

    const existingEmail = await Supplier.findOne({
      email: cleanEmail,
      _id: { $ne: supplierId },
    });

    if (existingEmail) {
      return res.status(400).json({
        message: "This email is already used by another supplier.",
      });
    }

    /* CHECK NIC */

    const existingNic = await Supplier.findOne({
      nic: cleanNic,
      _id: { $ne: supplierId },
    });

    if (existingNic) {
      return res.status(400).json({
        message: "This NIC is already used by another supplier.",
      });
    }

    /* CHECK BUSINESS REGISTRATION */

    const existingBusinessRegistration = await Supplier.findOne({
      businessRegistrationNo: cleanBusinessRegistrationNo,

      _id: { $ne: supplierId },
    });

    if (existingBusinessRegistration) {
      return res.status(400).json({
        message:
          "This business registration number is already used by another supplier.",
      });
    }

    /* UPDATE TEXT DATA */

    supplier.fullName = fullName.trim();

    supplier.email = cleanEmail;

    supplier.nic = cleanNic;

    supplier.businessName = businessName.trim();

    supplier.businessRegistrationNo = cleanBusinessRegistrationNo;

    supplier.address = address.trim();

    /* UPDATE PROFILE IMAGE */

    if (req.file) {
      supplier.profileImage = `/uploads/suppliers/${req.file.filename}`;
    }

    await supplier.save();

    return res.status(200).json({
      message: "Supplier profile updated successfully.",

      supplier: {
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
  } catch (error) {
    console.error("Update supplier profile error:", error);

    return res.status(500).json({
      message: "Server error. Could not update supplier profile.",
    });
  }
});

module.exports = router;
