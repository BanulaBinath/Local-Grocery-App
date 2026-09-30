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

module.exports = router;
