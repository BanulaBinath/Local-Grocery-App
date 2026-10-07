const express = require("express");

const CustomerOrder = require("../models/CustomerOrder");
const Customer = require("../models/Customer");
const ShopProduct = require("../models/ShopProduct");
const CustomerStaff = require("../models/CustomerStaff");
const Notification = require("../models/Notification");

const router = express.Router();

const ALLOWED_TRANSITIONS = {
  pending: ["accepted", "cancelled"],
  accepted: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["completed"],
  completed: [],
  cancelled: [],
};

const getNextOrderNumber = async () => {
  const latest = await CustomerOrder.findOne()
    .sort({ orderNumber: -1 })
    .select("orderNumber");

  if (!latest) {
    return 1001;
  }

  return Number(latest.orderNumber) + 1;
};

// ==================================================
// CREATE CUSTOMER ORDER
// ==================================================
router.post("/", async (req, res) => {
  try {
    const {
      customerId,
      items,
      deliveryFee = 0,
      note = "",
      customerPhone = "",
      pickupDate = "",
      pickupTime = "",
      pickupLocation = "",
    } = req.body;

    if (!customerId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Customer and at least one order item are required.",
      });
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        message: "Customer account not found.",
      });
    }

    const orderItems = [];
    let itemsTotal = 0;

    for (const item of items) {
      const product = await ShopProduct.findById(item.productId);

      if (!product || product.status !== "active") {
        return res.status(400).json({
          message: `Product is not available: ${item.productId}`,
        });
      }

      const quantity = Number(item.quantity);

      if (!quantity || quantity < 1) {
        return res.status(400).json({
          message: `Invalid quantity for ${product.name}.`,
        });
      }

      if (!product.inStock || product.stockQuantity < quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}.`,
        });
      }

      const lineTotal = Number(product.price) * quantity;

      orderItems.push({
        productId: product._id,
        productName: product.name,
        productImage: product.image || "",
        quantity,
        unit: product.unit,
        price: Number(product.price),
        lineTotal,
      });

      itemsTotal += lineTotal;
    }

    const fee = Number(deliveryFee) || 0;
    const totalAmount = itemsTotal + fee;
    const orderNumber = await getNextOrderNumber();

    const order = new CustomerOrder({
      orderNumber,
      customerId: customer._id,
      customerName: customer.fullName,
      customerPhone: customerPhone
        ? String(customerPhone).trim()
        : customer.phoneNumber || "",
      customerAddress: customer.address || "",
      pickupDate: pickupDate ? String(pickupDate).trim() : "",
      pickupTime: pickupTime ? String(pickupTime).trim() : "",
      pickupLocation: pickupLocation ? String(pickupLocation).trim() : "",
      items: orderItems,
      itemsTotal,
      deliveryFee: fee,
      totalAmount,
      status: "pending",
      note: note ? String(note).trim() : "",
      statusHistory: [
        {
          status: "pending",
          updatedAt: new Date(),
        },
      ],
    });

    await order.save();

    // Reduce stock after successful order
    for (const item of orderItems) {
      const product = await ShopProduct.findById(item.productId);

      if (product) {
        product.stockQuantity = Math.max(
          0,
          Number(product.stockQuantity) - Number(item.quantity),
        );
        product.inStock = product.stockQuantity > 0;
        await product.save();
      }
    }

    // Create in-app notification for the customer
    try {
      await Notification.create({
        customerId: customer._id,
        orderId: order._id,
        orderNumber: order.orderNumber,
        title: `Order #${order.orderNumber} Placed 🎉`,
        message: `Your grocery order has been submitted. Scheduled for pickup ${order.pickupDate ? `on ${order.pickupDate}` : "soon"}. Waiting for staff confirmation.`,
        type: "order_placed",
      });
    } catch (notifErr) {
      console.log("Error creating notification:", notifErr.message);
    }

    return res.status(201).json({
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    console.error("Create customer order error:", error);

    return res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

// ==================================================
// GET ALL ORDERS (Customer Staff)
// ==================================================
router.get("/", async (req, res) => {
  try {
    const { status, search } = req.query;

    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    let orders = await CustomerOrder.find(filter)
      .populate("customerId", "fullName email address")
      .populate("handledBy", "fullName email")
      .sort({ createdAt: -1 });

    if (search && String(search).trim()) {
      const term = String(search).trim().toLowerCase();

      orders = orders.filter((order) => {
        const orderId = String(order.orderNumber);
        const name = (order.customerName || "").toLowerCase();

        return orderId.includes(term) || name.includes(term);
      });
    }

    return res.status(200).json({
      message: "Orders loaded successfully.",
      orders,
    });
  } catch (error) {
    console.error("Get customer orders error:", error);

    return res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

// ==================================================
// GET ORDERS BY CUSTOMER
// ==================================================
router.get("/customer/:customerId", async (req, res) => {
  try {
    const orders = await CustomerOrder.find({
      customerId: req.params.customerId,
    })
      .populate("handledBy", "fullName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Customer orders loaded successfully.",
      orders,
    });
  } catch (error) {
    console.error("Get customer orders by customer error:", error);

    return res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

// ==================================================
// GET SINGLE ORDER
// ==================================================
router.get("/:orderId", async (req, res) => {
  try {
    const order = await CustomerOrder.findById(req.params.orderId)
      .populate("customerId", "fullName email address")
      .populate("handledBy", "fullName email phoneNumber");

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      message: "Order loaded successfully.",
      order,
    });
  } catch (error) {
    console.error("Get customer order error:", error);

    return res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

// ==================================================
// UPDATE ORDER STATUS (Customer Staff)
// ==================================================
router.put("/:orderId/status", async (req, res) => {
  try {
    const { status, staffId, cancelReason } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status is required.",
      });
    }

    const order = await CustomerOrder.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    const allowed = ALLOWED_TRANSITIONS[order.status] || [];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        message: `Cannot change status from "${order.status}" to "${status}".`,
      });
    }

    if (status === "cancelled" && !cancelReason) {
      return res.status(400).json({
        message: "Please provide a cancellation reason.",
      });
    }

    if (staffId) {
      const staff = await CustomerStaff.findById(staffId);

      if (!staff) {
        return res.status(404).json({
          message: "Customer Staff account not found.",
        });
      }

      order.handledBy = staff._id;
    }

    order.status = status;

    if (status === "cancelled") {
      order.cancelReason = String(cancelReason).trim();

      // Return items to inventory
      for (const item of order.items) {
        const product = await ShopProduct.findById(item.productId);
        if (product) {
          product.stockQuantity = Number(product.stockQuantity) + Number(item.quantity);
          product.inStock = product.stockQuantity > 0;
          await product.save();
        }
      }
    }

    order.statusHistory.push({
      status,
      updatedAt: new Date(),
      updatedBy: staffId || null,
    });

    await order.save();

    // Create Customer Notification
    try {
      let title = `Order #${order.orderNumber} Status Updated`;
      let message = `Your order status changed to ${status}.`;
      let notifType = "general";

      if (status === "accepted") {
        title = `Order #${order.orderNumber} Confirmed! ✅`;
        message = `Staff has accepted your order! Scheduled pickup: ${order.pickupDate || 'Today'}${order.pickupTime ? ` at ${order.pickupTime}` : ''}.`;
        notifType = "order_accepted";
      } else if (status === "cancelled") {
        title = `Order #${order.orderNumber} Rejected ❌`;
        message = `Your order was rejected by staff. Reason: ${order.cancelReason || 'Item unavailable'}.`;
        notifType = "order_rejected";
      } else if (status === "preparing") {
        title = `Order #${order.orderNumber} is Preparing 🧺`;
        message = `Staff is currently packing your grocery items.`;
        notifType = "order_ready";
      } else if (status === "ready") {
        title = `Order #${order.orderNumber} Ready for Pickup! 🛍️`;
        message = `Your order is ready! Please proceed to ${order.pickupLocation || 'the store pickup counter'}.`;
        notifType = "order_ready";
      } else if (status === "completed") {
        title = `Order #${order.orderNumber} Completed 🎉`;
        message = `Your order has been completed. Thank you for shopping with us! Please share your feedback.`;
        notifType = "order_completed";
      }

      await Notification.create({
        customerId: order.customerId,
        orderId: order._id,
        orderNumber: order.orderNumber,
        title,
        message,
        type: notifType,
      });
    } catch (notifErr) {
      console.log("Error creating status notification:", notifErr.message);
    }

    const updatedOrder = await CustomerOrder.findById(order._id)
      .populate("customerId", "fullName email address")
      .populate("handledBy", "fullName email phoneNumber");

    return res.status(200).json({
      message: "Order status updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update customer order status error:", error);

    return res.status(500).json({
      message: "Server error. Please try again.",
    });
  }
});

module.exports = router;
