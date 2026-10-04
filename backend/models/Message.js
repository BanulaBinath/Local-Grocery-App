const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    senderRole: {
      type: String,
      enum: ["owner", "supplier_staff", "customer_staff", "supplier"],
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    receiverRole: {
      type: String,
      enum: ["owner", "supplier_staff", "customer_staff", "supplier"],
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Message", messageSchema);
