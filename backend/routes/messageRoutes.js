const express = require("express");

const Message = require("../models/Message");

const router = express.Router();

// ========================================
// SEND MESSAGE
// POST /api/messages
// ========================================

router.post("/", async (req, res) => {
  try {
    const { senderId, senderRole, receiverId, receiverRole, message } =
      req.body;

    if (
      !senderId ||
      !senderRole ||
      !receiverId ||
      !receiverRole ||
      !message ||
      !message.trim()
    ) {
      return res.status(400).json({
        message: "Sender, receiver and message are required.",
      });
    }

    const newMessage = new Message({
      senderId,
      senderRole,
      receiverId,
      receiverRole,
      message: message.trim(),
    });

    const savedMessage = await newMessage.save();

    res.status(201).json({
      message: "Message sent successfully.",
      data: savedMessage,
    });
  } catch (error) {
    console.error("Send message error:", error);

    res.status(500).json({
      message: "Failed to send message.",
    });
  }
});

// ========================================
// GET CONVERSATION
// GET /api/messages/conversation
// ========================================

router.get("/conversation", async (req, res) => {
  try {
    const { userId, userRole, otherUserId, otherUserRole } = req.query;

    if (!userId || !userRole || !otherUserId || !otherUserRole) {
      return res.status(400).json({
        message: "User and other user information are required.",
      });
    }

    const messages = await Message.find({
      $or: [
        {
          senderId: userId,
          senderRole: userRole,
          receiverId: otherUserId,
          receiverRole: otherUserRole,
        },
        {
          senderId: otherUserId,
          senderRole: otherUserRole,
          receiverId: userId,
          receiverRole: userRole,
        },
      ],
    }).sort({
      createdAt: 1,
    });

    res.json({
      messages,
    });
  } catch (error) {
    console.error("Get conversation error:", error);

    res.status(500).json({
      message: "Failed to load messages.",
    });
  }
});

// ========================================
// MARK MESSAGE AS READ
// PUT /api/messages/:messageId/read
// ========================================

router.put("/:messageId/read", async (req, res) => {
  try {
    const { messageId } = req.params;

    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      {
        isRead: true,
      },
      {
        new: true,
      },
    );

    if (!updatedMessage) {
      return res.status(404).json({
        message: "Message not found.",
      });
    }

    res.json({
      message: "Message marked as read.",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("Mark message read error:", error);

    res.status(500).json({
      message: "Failed to update message.",
    });
  }
});

// ========================================
// GET STAFF CONVERSATIONS LIST
// GET /api/messages/staff-conversations?staffId=xxx
// Returns one entry per unique customer the staff has messaged
// ========================================
router.get("/staff-conversations", async (req, res) => {
  try {
    const Customer = require("../models/Customer");
    const CustomerOrder = require("../models/CustomerOrder");

    // Get all messages involving customer_staff
    const messages = await Message.find({
      $or: [
        { senderRole: "customer_staff" },
        { receiverRole: "customer_staff" },
      ],
    }).sort({ createdAt: 1 });

    const conversationMap = {};

    for (const msg of messages) {
      const customerId =
        msg.senderRole === "customer"
          ? msg.senderId.toString()
          : msg.receiverId.toString();

      if (!conversationMap[customerId]) {
        let customerName = "Customer";
        try {
          const cust = await Customer.findById(customerId);
          if (cust) customerName = cust.fullName;
        } catch (e) {}

        let orderNumber = "";
        try {
          const latestOrder = await CustomerOrder.findOne({ customerId }).sort({ createdAt: -1 });
          if (latestOrder) orderNumber = String(latestOrder.orderNumber);
        } catch (e) {}

        conversationMap[customerId] = {
          id: customerId,
          customerId,
          customerName,
          orderNumber,
          avatarText: "👤",
          messages: [],
          lastMessageAt: msg.createdAt,
        };
      }

      conversationMap[customerId].messages.push({
        id: msg._id.toString(),
        text: msg.message,
        fromStaff: msg.senderRole === "customer_staff",
        createdAt: msg.createdAt,
        time: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      conversationMap[customerId].lastMessageAt = msg.createdAt;
    }

    const conversations = Object.values(conversationMap).sort(
      (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt),
    );

    return res.status(200).json({ conversations });
  } catch (error) {
    console.error("Get staff conversations error:", error);
    return res.status(500).json({ message: "Failed to load conversations." });
  }
});

// ========================================
// GET CUSTOMER THREAD WITH STAFF
// GET /api/messages/customer-thread?customerId=xxx
// ========================================
router.get("/customer-thread", async (req, res) => {
  try {
    const { customerId } = req.query;
    if (!customerId) {
      return res.status(400).json({ message: "customerId is required." });
    }

    const messages = await Message.find({
      $or: [
        { senderId: customerId, senderRole: "customer" },
        { receiverId: customerId, receiverRole: "customer" },
      ],
    }).sort({ createdAt: 1 });

    const formattedMessages = messages.map((msg) => ({
      id: msg._id.toString(),
      text: msg.message,
      senderRole: msg.senderRole,
      receiverRole: msg.receiverRole,
      fromStaff: msg.senderRole === "customer_staff",
      createdAt: msg.createdAt,
      time: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    return res.status(200).json({ messages: formattedMessages });
  } catch (error) {
    console.error("Get customer thread error:", error);
    return res.status(500).json({ message: "Failed to load thread." });
  }
});

module.exports = router;

