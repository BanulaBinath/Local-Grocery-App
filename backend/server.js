const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();

// ========================================
// ROUTES
// ========================================

const customerRoutes = require("./routes/customerRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const staffRoutes = require("./routes/staffRoutes");
const supplyOrderRoutes = require("./routes/supplyOrderRoutes");
const messageRoutes = require("./routes/messageRoutes");
const shopProductRoutes = require("./routes/shopProductRoutes");
const customerOrderRoutes = require("./routes/customerOrderRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

// ========================================
// APP
// ========================================

const app = express();

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());

app.use(express.json());

// ========================================
// UPLOADED FILES
// ========================================

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ========================================
// API ROUTES
// ========================================

app.use("/api/customers", customerRoutes);

app.use("/api/suppliers", supplierRoutes);

app.use("/api/owners", ownerRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/staff", staffRoutes);

app.use("/api/supply-orders", supplyOrderRoutes);

app.use("/api/messages", messageRoutes);

app.use("/api/shop-products", shopProductRoutes);

app.use("/api/customer-orders", customerOrderRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/feedbacks", feedbackRoutes);

// ========================================
// ROOT ROUTE
// ========================================

app.get("/", (req, res) => {
  res.json({
    message: "Local Grocery Backend is running!",
  });
});

// ========================================
// SERVER PORT
// ========================================

const PORT = process.env.PORT || 5000;

// ========================================
// MONGODB CONNECTION
// ========================================

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:");

    console.error(error.message);
  });
