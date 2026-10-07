const express = require("express");
const Notification = require("../models/Notification");

const router = express.Router();

// ==================================================
// GET ALL NOTIFICATIONS FOR A CUSTOMER
// ==================================================
router.get("/customer/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;

    const notifications = await Notification.find({ customerId })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      customerId,
      isRead: false,
    });

    return res.status(200).json({
      message: "Notifications fetched successfully.",
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    return res.status(500).json({
      message: "Server error. Could not fetch notifications.",
    });
  }
});

// ==================================================
// MARK SINGLE NOTIFICATION AS READ
// ==================================================
router.put("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      message: "Notification marked as read.",
      notification,
    });
  } catch (error) {
    console.error("Mark notification read error:", error);
    return res.status(500).json({
      message: "Server error. Could not update notification.",
    });
  }
});

// ==================================================
// MARK ALL NOTIFICATIONS AS READ FOR CUSTOMER
// ==================================================
router.put("/customer/:customerId/read-all", async (req, res) => {
  try {
    await Notification.updateMany(
      { customerId: req.params.customerId, isRead: false },
      { isRead: true },
    );

    return res.status(200).json({
      message: "All notifications marked as read.",
    });
  } catch (error) {
    console.error("Mark all notifications read error:", error);
    return res.status(500).json({
      message: "Server error. Could not update notifications.",
    });
  }
});

module.exports = router;
