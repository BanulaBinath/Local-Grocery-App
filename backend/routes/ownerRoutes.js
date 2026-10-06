const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Owner = require("../models/Owner");
const Supplier = require("../models/Supplier");
const CustomerStaff = require("../models/CustomerStaff");
const SupplierStaff = require("../models/SupplierStaff");
const SupplyOrder = require("../models/SupplyOrder");
const Customer = require("../models/Customer");
const StoreSetting = require("../models/StoreSetting");

const router = express.Router();

const uploadDirectory = path.join(__dirname, "../uploads/owners");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (req, file, callback) => {
      const extension = path.extname(file.originalname);
      callback(
        null,
        `owner-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`,
      );
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    callback(
      allowedTypes.includes(file.mimetype)
        ? null
        : new Error("Only JPG, JPEG, PNG and WEBP images are allowed."),
      allowedTypes.includes(file.mimetype),
    );
  },
});

const removeOwnerImage = (imagePath) => {
  if (!imagePath || !imagePath.startsWith("/uploads/owners/")) {
    return;
  }

  const filePath = path.join(__dirname, "..", imagePath.replace(/^\//, ""));
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// ========================================
// OWNER PROFILE
// ========================================
router.put("/profile/:ownerId", upload.single("profileImage"), async (req, res) => {
  try {
    const { ownerId } = req.params;
    const { fullName, email } = req.body;

    if (!fullName?.trim() || !email?.trim()) {
      return res.status(400).json({
        message: "Full name and email are required.",
      });
    }

    const owner = await Owner.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ message: "Owner account not found." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingOwner = await Owner.findOne({
      email: cleanEmail,
      _id: { $ne: ownerId },
    });

    if (existingOwner) {
      return res.status(400).json({
        message: "This email is already used by another owner.",
      });
    }

    const previousImage = owner.profileImage;
    owner.fullName = fullName.trim();
    owner.email = cleanEmail;

    if (req.file) {
      owner.profileImage = `/uploads/owners/${req.file.filename}`;
      removeOwnerImage(previousImage);
    }

    await owner.save();

    return res.status(200).json({
      message: "Owner profile updated successfully.",
      owner: {
        id: owner._id,
        profileImage: owner.profileImage || "",
        email: owner.email,
        fullName: owner.fullName,
        role: owner.role,
      },
    });
  } catch (error) {
    console.error("Update owner profile error:", error);
    return res.status(500).json({
      message: "Could not update owner profile.",
    });
  }
});

router.delete("/profile/:ownerId", async (req, res) => {
  try {
    const owner = await Owner.findByIdAndDelete(req.params.ownerId);
    if (!owner) {
      return res.status(404).json({ message: "Owner account not found." });
    }

    removeOwnerImage(owner.profileImage);
    return res.status(200).json({ message: "Owner account deleted successfully." });
  } catch (error) {
    console.error("Delete owner profile error:", error);
    return res.status(500).json({
      message: "Could not delete owner account.",
    });
  }
});

// ========================================
// FINANCE REPORT
// ========================================
router.get("/finance-report", async (req, res) => {
  try {
    const finance = await SupplyOrder.aggregate([
      {
        $match: {
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
          supplierPayable: { $sum: "$totalPrice" },
          completedOrders: { $sum: 1 },
        },
      },
    ]);

    const result = finance[0] || {
      totalRevenue: 0,
      supplierPayable: 0,
      completedOrders: 0,
    };

    res.status(200).json({
      ...result,
      netProfit: null,
      netProfitAvailable: false,
      note: "Net profit requires a separate supplier cost or margin field.",
    });
  } catch (error) {
    console.error("Get finance report error:", error);
    res.status(500).json({
      message: "Server error. Could not load finance report.",
    });
  }
});

// ========================================
// STORE SETTINGS
// ========================================
router.get("/store-settings", async (req, res) => {
  try {
    const settings = await StoreSetting.findOneAndUpdate(
      { key: "default" },
      { $setOnInsert: { key: "default" } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    res.status(200).json({ settings });
  } catch (error) {
    console.error("Get store settings error:", error);
    res.status(500).json({ message: "Could not load store settings." });
  }
});

router.patch("/store-settings", async (req, res) => {
  try {
    const { isStoreOpen, openingTime, closingTime, deliveryFee, pickupFee } =
      req.body;

    const settings = await StoreSetting.findOneAndUpdate(
      { key: "default" },
      {
        $set: {
          isStoreOpen: Boolean(isStoreOpen),
          openingTime: String(openingTime || "").trim(),
          closingTime: String(closingTime || "").trim(),
          deliveryFee: Number(deliveryFee) || 0,
          pickupFee: Number(pickupFee) || 0,
        },
        $setOnInsert: { key: "default" },
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );

    res.status(200).json({ settings });
  } catch (error) {
    console.error("Update store settings error:", error);
    res.status(500).json({ message: "Could not update store settings." });
  }
});

// ========================================
// USER MANAGEMENT
// ========================================
router.get("/user-management", async (req, res) => {
  try {
    const [customers, customerStaff, supplierStaff, suppliers] =
      await Promise.all([
        Customer.find({}, "-password").sort({ createdAt: -1 }),
        CustomerStaff.find({}, "-password").sort({ createdAt: -1 }),
        SupplierStaff.find({}, "-password").sort({ createdAt: -1 }),
        Supplier.find({}, "-password").sort({ createdAt: -1 }),
      ]);

    res.status(200).json({ customers, customerStaff, supplierStaff, suppliers });
  } catch (error) {
    console.error("Get owner user management error:", error);
    res.status(500).json({
      message: "Server error. Could not load user management data.",
    });
  }
});

router.patch("/user-management/staff/:role/:id", async (req, res) => {
  try {
    const Model =
      req.params.role === "customer_staff" ? CustomerStaff : SupplierStaff;
    const staff = await Model.findByIdAndUpdate(
      req.params.id,
      {
        isActive: Boolean(req.body.isActive),
        permissions: req.body.permissions || {},
      },
      { new: true, runValidators: true },
    ).select("-password");

    if (!staff) {
      return res.status(404).json({ message: "Staff account not found." });
    }

    res.status(200).json({ staff });
  } catch (error) {
    console.error("Update owner staff management error:", error);
    res.status(500).json({ message: "Could not update staff settings." });
  }
});

router.delete("/user-management/staff/:role/:id", async (req, res) => {
  try {
    const Model =
      req.params.role === "customer_staff" ? CustomerStaff : SupplierStaff;
    const deleted = await Model.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Staff account not found." });
    }

    res.status(200).json({ message: "Staff account removed successfully." });
  } catch (error) {
    console.error("Delete owner staff error:", error);
    res.status(500).json({ message: "Could not remove staff account." });
  }
});

router.patch("/user-management/customers/:id/block", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { isBlocked: Boolean(req.body.isBlocked) },
      { new: true },
    ).select("-password");

    if (!customer) {
      return res.status(404).json({ message: "Customer account not found." });
    }

    res.status(200).json({ customer });
  } catch (error) {
    console.error("Update customer block status error:", error);
    res.status(500).json({ message: "Could not update customer account." });
  }
});

// ========================================
// GET STAFF FOR OWNER MESSAGES
// ========================================
router.get("/message-recipients", async (req, res) => {
  try {
    const [customerStaff, supplierStaff] = await Promise.all([
      CustomerStaff.find({}, "fullName email role").sort({ fullName: 1 }),
      SupplierStaff.find({}, "fullName email role").sort({ fullName: 1 }),
    ]);

    res.status(200).json({
      staff: [...customerStaff, ...supplierStaff],
    });
  } catch (error) {
    console.error("Get owner message recipients error:", error);
    res.status(500).json({
      message: "Server error. Could not load staff recipients.",
    });
  }
});

// ========================================
// GET OWNER DASHBOARD SUMMARY
// ========================================
router.get("/dashboard-summary", async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [
      salesResult,
      customerStaffCount,
      supplierStaffCount,
      activeSuppliers,
      pendingOrders,
      newPreorders,
    ] = await Promise.all([
        SupplyOrder.aggregate([
          {
            $match: {
              status: "completed",
              createdAt: { $gte: startOfDay },
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$totalPrice",
              },
            },
          },
        ]),
        CustomerStaff.countDocuments({ isActive: { $ne: false } }),
        SupplierStaff.countDocuments({ isActive: { $ne: false } }),
        Supplier.countDocuments({ status: "approved" }),
        SupplyOrder.countDocuments({
          status: "pending",
        }),
        SupplyOrder.countDocuments({
          status: "pending",
          createdAt: { $gte: startOfDay },
        }),
      ]);

    res.status(200).json({
      totalSales: salesResult[0]?.total || 0,
      dailyRevenue: salesResult[0]?.total || 0,
      activeStaff: customerStaffCount + supplierStaffCount,
      activeSuppliers,
      pendingOrders,
      newPreorders,
    });
  } catch (error) {
    console.error("Get owner dashboard summary error:", error);

    res.status(500).json({
      message: "Server error. Could not load dashboard summary.",
    });
  }
});

// ========================================
// GET SALES REPORT
// ========================================
router.get("/sales-report", async (req, res) => {
  try {
    const period = String(req.query.period || "daily");
    const periodConfig = {
      daily: {
        points: 7,
        unit: "day",
        format: "%Y-%m-%d",
        labelFormat: "%d %b",
      },
      weekly: {
        points: 8,
        unit: "week",
        format: "%G-W%V",
        labelFormat: "%G-W%V",
      },
      monthly: {
        points: 12,
        unit: "month",
        format: "%Y-%m",
        labelFormat: "%b %Y",
      },
    }[period];

    if (!periodConfig) {
      return res.status(400).json({
        message: "Period must be daily, weekly or monthly.",
      });
    }

    const now = new Date();
    const rangeStart = new Date(now);

    if (period === "daily") {
      rangeStart.setDate(rangeStart.getDate() - 6);
      rangeStart.setHours(0, 0, 0, 0);
    } else if (period === "weekly") {
      rangeStart.setDate(rangeStart.getDate() - 7 * 7);
      rangeStart.setHours(0, 0, 0, 0);
    } else {
      rangeStart.setMonth(rangeStart.getMonth() - 11, 1);
      rangeStart.setHours(0, 0, 0, 0);
    }

    const sales = await SupplyOrder.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: {
            $gte: rangeStart,
            $lte: now,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              date: "$createdAt",
              format: periodConfig.format,
              timezone: "Asia/Colombo",
            },
          },
          totalSales: {
            $sum: "$totalPrice",
          },
          orderCount: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const totalSales = sales.reduce((total, item) => total + item.totalSales, 0);

    res.status(200).json({
      period,
      rangeStart,
      totalSales,
      sales: sales.map((item) => ({
        label: item._id,
        totalSales: item.totalSales,
        orderCount: item.orderCount,
      })),
    });
  } catch (error) {
    console.error("Get sales report error:", error);

    res.status(500).json({
      message: "Server error. Could not load sales report.",
    });
  }
});

// ========================================
// GET SUPPLIER PROGRESS
// ========================================
router.get("/supplier-progress", async (req, res) => {
  try {
    const progress = await SupplyOrder.aggregate([
      {
        $match: {
          status: { $ne: "rejected" },
        },
      },
      {
        $group: {
          _id: "$supplierId",
          targetOrders: { $sum: 1 },
          completedOrders: {
            $sum: {
              $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
            },
          },
          targetQuantity: { $sum: "$quantity" },
          deliveredQuantity: {
            $sum: {
              $cond: [
                { $eq: ["$status", "completed"] },
                "$quantity",
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "suppliers",
          localField: "_id",
          foreignField: "_id",
          as: "supplier",
        },
      },
      {
        $unwind: {
          path: "$supplier",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          supplierId: "$_id",
          supplierName: {
            $ifNull: ["$supplier.businessName", "$supplier.fullName"],
          },
          targetOrders: 1,
          completedOrders: 1,
          targetQuantity: 1,
          deliveredQuantity: 1,
        },
      },
      {
        $sort: {
          deliveredQuantity: -1,
          supplierName: 1,
        },
      },
    ]);

    res.status(200).json({
      suppliers: progress.map((supplier) => ({
        ...supplier,
        progress:
          supplier.targetQuantity > 0
            ? Math.min(
                100,
                Math.round(
                  (supplier.deliveredQuantity / supplier.targetQuantity) * 100,
                ),
              )
            : 0,
      })),
    });
  } catch (error) {
    console.error("Get supplier progress error:", error);

    res.status(500).json({
      message: "Server error. Could not load supplier progress.",
    });
  }
});

// ========================================
// GET ALL ORDERS FOR OWNER
// ========================================
router.get("/orders", async (req, res) => {
  try {
    const orders = await SupplyOrder.find()
      .populate("supplierId", "fullName businessName email")
      .populate("supplierStaffId", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("Get owner orders error:", error);

    res.status(500).json({
      message: "Server error. Could not load orders.",
    });
  }
});

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
