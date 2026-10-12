const express = require("express");

const SupplyOrder = require("../models/SupplyOrder");
const Product = require("../models/Product");
const SupplierStaff = require("../models/SupplierStaff");
const StoreSetting = require("../models/StoreSetting");

const router = express.Router();

// ==================================================
// CREATE SUPPLY ORDER
// ==================================================
router.post("/", async (req, res) => {
  try {
    const settings = await StoreSetting.findOne({ key: "default" });

    if (settings && !settings.isStoreOpen) {
      return res.status(403).json({
        message: "The store is currently closed and not accepting orders.",
      });
    }

    if (settings?.openingTime && settings?.closingTime) {
      const currentMinutes =
        new Date().getHours() * 60 + new Date().getMinutes();
      const [openingHour, openingMinute] = settings.openingTime
        .split(":")
        .map(Number);
      const [closingHour, closingMinute] = settings.closingTime
        .split(":")
        .map(Number);
      const openingMinutes = openingHour * 60 + openingMinute;
      const closingMinutes = closingHour * 60 + closingMinute;
      const outsideHours =
        openingMinutes <= closingMinutes
          ? currentMinutes < openingMinutes || currentMinutes > closingMinutes
          : currentMinutes < openingMinutes && currentMinutes > closingMinutes;

      if (outsideHours) {
        return res.status(403).json({
          message: `Orders are accepted between ${settings.openingTime} and ${settings.closingTime}.`,
        });
      }
    }

    const {
      supplierStaffId,
      supplierId,
      productId,
      quantity,
      pickupLocation,
      pickupDate,
      pickupTime,
      note,
    } = req.body;

    if (
      !supplierStaffId ||
      !supplierId ||
      !productId ||
      !quantity ||
      !pickupLocation ||
      !pickupDate ||
      !pickupTime
    ) {
      return res.status(400).json({
        message:
          "Supplier Staff, supplier, product, quantity, pickup location, pickup date and pickup time are required.",
      });
    }

    const supplierStaff = await SupplierStaff.findById(supplierStaffId);

    if (!supplierStaff) {
      return res.status(404).json({
        message: "Supplier Staff account not found.",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    if (product.supplierId.toString() !== supplierId.toString()) {
      return res.status(400).json({
        message: "This product does not belong to the selected supplier.",
      });
    }

    if (product.status !== "active") {
      return res.status(400).json({
        message: "This product is currently not available for ordering.",
      });
    }

    if (Number(product.stockQuantity) <= 0) {
      return res.status(400).json({
        message: "This product is out of stock.",
      });
    }

    if (Number(quantity) > Number(product.stockQuantity)) {
      return res.status(400).json({
        message: `Only ${product.stockQuantity} ${product.unit} available in stock.`,
      });
    }

    const totalPrice = Number(product.price) * Number(quantity);

    const supplyOrder = new SupplyOrder({
      supplierStaffId,
      supplierId,
      productId,

      productName: product.name,

      // Save product image with order
      productImage: product.image || "",

      quantity: Number(quantity),

      unit: product.unit,

      pricePerUnit: Number(product.price),

      totalPrice,

      pickupLocation: String(pickupLocation).trim(),

      pickupDate: String(pickupDate).trim(),

      pickupTime: String(pickupTime).trim(),

      status: "pending",

      note: note ? String(note).trim() : "",
    });

    await supplyOrder.save();

    res.status(201).json({
      message: "Supply order created successfully.",
      order: supplyOrder,
    });
  } catch (error) {
    console.error("Create supply order error:", error);

    res.status(500).json({
      message: "Server error. Could not create supply order.",
      error: error.message,
    });
  }
});

// ==================================================
// GET SUPPLY ORDERS FOR SUPPLIER STAFF
// ==================================================
router.get("/staff/:supplierStaffId", async (req, res) => {
  try {
    const { supplierStaffId } = req.params;

    const orders = await SupplyOrder.find({
      supplierStaffId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("Get staff supply orders error:", error);

    res.status(500).json({
      message: "Server error. Could not load supply orders.",
    });
  }
});

// ==================================================
// GET SUPPLY ORDERS FOR SUPPLIER
// ==================================================
router.get("/supplier/:supplierId", async (req, res) => {
  try {
    const { supplierId } = req.params;

    const orders = await SupplyOrder.find({
      supplierId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("Get supplier supply orders error:", error);

    res.status(500).json({
      message: "Server error. Could not load supply orders.",
    });
  }
});

// ==================================================
// UPDATE SUPPLY ORDER STATUS
// ==================================================
router.put("/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "accepted",
      "rejected",
      "ready_for_pickup",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status.",
      });
    }

    const order = await SupplyOrder.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Supply order not found.",
      });
    }

    // ==================================================
    // ACCEPT ORDER
    // ==================================================
    if (status === "accepted") {
      if (order.status !== "pending") {
        return res.status(400).json({
          message: "Only pending orders can be accepted.",
        });
      }

      const product = await Product.findById(order.productId);

      if (!product) {
        return res.status(404).json({
          message: "Product related to this order was not found.",
        });
      }

      if (Number(order.quantity) > Number(product.stockQuantity)) {
        return res.status(400).json({
          message: `Not enough stock available. Only ${product.stockQuantity} ${product.unit} remaining.`,
        });
      }

      product.stockQuantity =
        Number(product.stockQuantity) - Number(order.quantity);

      if (Number(product.stockQuantity) <= 0) {
        product.stockQuantity = 0;
        product.status = "out_of_stock";
      } else {
        if (product.status !== "inactive") {
          product.status = "active";
        }
      }

      await product.save();
    }

    // ==================================================
    // REJECT ORDER
    // ==================================================
    if (status === "rejected") {
      if (order.status !== "pending") {
        return res.status(400).json({
          message: "Only pending orders can be rejected.",
        });
      }
    }

    // ==================================================
    // READY FOR PICKUP
    // ==================================================
    if (status === "ready_for_pickup") {
      if (order.status !== "accepted") {
        return res.status(400).json({
          message: "Only accepted orders can be marked as ready for pickup.",
        });
      }
    }

    // ==================================================
    // COMPLETED
    // ==================================================
    if (status === "completed") {
      if (order.status !== "ready_for_pickup") {
        return res.status(400).json({
          message: "Only orders that are ready for pickup can be completed.",
        });
      }
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      message: `Supply order ${status} successfully.`,
      order,
    });
  } catch (error) {
    console.error("Update supply order status error:", error);

    res.status(500).json({
      message: "Server error. Could not update order status.",
      error: error.message,
    });
  }
});

module.exports = router;
