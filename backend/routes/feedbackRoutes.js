const express = require("express");
const mongoose = require("mongoose");
const Feedback = require("../models/Feedback");
const Customer = require("../models/Customer");

const router = express.Router();

// =============================================
// GET ALL FEEDBACK (for staff & customers)
// =============================================
router.get("/", async (req, res) => {
  try {
    const feedbackList = await Feedback.find().sort({ createdAt: -1 });

    // Normalize so both 'comment' and 'message' are populated for UI
    const feedback = feedbackList.map((item) => {
      const doc = item.toObject ? item.toObject() : item;
      const text = doc.comment || doc.message || "";
      return {
        ...doc,
        comment: text,
        message: text,
      };
    });

    const totalReviews = feedback.length;
    let averageRating = 0;
    if (totalReviews > 0) {
      const rated = feedback.filter((f) => f.rating != null && f.rating > 0);
      if (rated.length > 0) {
        const sum = rated.reduce((acc, f) => acc + Number(f.rating), 0);
        averageRating = Number((sum / rated.length).toFixed(1));
      }
    }

    return res.status(200).json({
      message: "Feedback loaded successfully.",
      feedback,
      feedbacks: feedback,
      stats: {
        totalReviews,
        averageRating,
      },
    });
  } catch (error) {
    console.error("Get feedback error:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

// =============================================
// POST FEEDBACK (customer submits feedback)
// =============================================
router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerId,
      rating,
      comment,
      message,
      category,
      orderNumber,
    } = req.body;

    const feedbackText = String(comment || message || "").trim();

    if (!feedbackText && rating == null) {
      return res.status(400).json({
        message: "Please provide a rating or a comment.",
      });
    }

    // Check if customerId is a valid MongoDB ObjectId
    const isValidId =
      customerId &&
      typeof customerId === "string" &&
      mongoose.Types.ObjectId.isValid(customerId);

    let resolvedName = customerName ? String(customerName).trim() : "";
    let resolvedEmail = customerEmail ? String(customerEmail).trim() : "";

    // If customerId is provided, try looking up missing customer details
    if (isValidId && (!resolvedName || !resolvedEmail)) {
      try {
        const foundCustomer = await Customer.findById(customerId).select(
          "fullName name email"
        );
        if (foundCustomer) {
          if (!resolvedName) {
            resolvedName = foundCustomer.fullName || foundCustomer.name || "";
          }
          if (!resolvedEmail && foundCustomer.email) {
            resolvedEmail = foundCustomer.email;
          }
        }
      } catch (err) {
        // Fallback silently if lookup fails
      }
    }

    if (!resolvedName) {
      resolvedName = "Anonymous";
    }

    const numericRating = rating != null ? Number(rating) : null;

    const feedback = new Feedback({
      customerId: isValidId ? customerId : null,
      customerName: resolvedName,
      customerEmail: resolvedEmail,
      rating: numericRating,
      comment: feedbackText, // Stored in 'comment' column matching MongoDB Compass table!
      message: feedbackText, // Stored in 'message' column for compatibility
      category: category ? String(category).trim() : "",
      orderNumber: orderNumber ? Number(orderNumber) : null,
    });

    await feedback.save();

    return res.status(201).json({
      message: "Feedback submitted successfully.",
      feedback,
    });
  } catch (error) {
    console.error("Create feedback error:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

// =============================================
// DELETE FEEDBACK (optional staff management)
// =============================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid feedback ID." });
    }

    const deleted = await Feedback.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Feedback not found." });
    }

    return res.status(200).json({
      message: "Feedback deleted successfully.",
      feedback: deleted,
    });
  } catch (error) {
    console.error("Delete feedback error:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
