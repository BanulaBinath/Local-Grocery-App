const express = require("express");
const Feedback = require("../models/Feedback");

const router = express.Router();

// ==================================================
// GET ALL FEEDBACKS (Public / Accessible from Login)
// ==================================================
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .limit(100);

    const totalReviews = feedbacks.length;
    let averageRating = 0;
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    if (totalReviews > 0) {
      const sum = feedbacks.reduce((acc, f) => {
        const r = Math.round(f.rating);
        if (distribution[r] !== undefined) {
          distribution[r] += 1;
        }
        return acc + f.rating;
      }, 0);
      averageRating = Number((sum / totalReviews).toFixed(1));
    }

    return res.status(200).json({
      message: "Feedbacks loaded successfully.",
      feedbacks,
      stats: {
        totalReviews,
        averageRating,
        distribution,
      },
    });
  } catch (error) {
    console.error("Get feedbacks error:", error);
    return res.status(500).json({
      message: "Server error. Could not fetch feedback.",
    });
  }
});

// ==================================================
// SUBMIT FEEDBACK (Logged in customer or with name)
// ==================================================
router.post("/", async (req, res) => {
  try {
    const { customerId, customerName, customerEmail, rating, comment, orderNumber } =
      req.body;

    if (!customerName || !String(customerName).trim()) {
      return res.status(400).json({
        message: "Customer name is required.",
      });
    }

    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5 stars.",
      });
    }

    if (!comment || !String(comment).trim()) {
      return res.status(400).json({
        message: "Please write a comment or review message.",
      });
    }

    const feedback = new Feedback({
      customerId: customerId || null,
      customerName: String(customerName).trim(),
      customerEmail: customerEmail ? String(customerEmail).trim() : "",
      rating: numericRating,
      comment: String(comment).trim(),
      orderNumber: orderNumber ? Number(orderNumber) : null,
    });

    await feedback.save();

    return res.status(201).json({
      message: "Feedback submitted successfully! Thank you.",
      feedback,
    });
  } catch (error) {
    console.error("Create feedback error:", error);
    return res.status(500).json({
      message: "Server error. Could not submit feedback.",
    });
  }
});

module.exports = router;
