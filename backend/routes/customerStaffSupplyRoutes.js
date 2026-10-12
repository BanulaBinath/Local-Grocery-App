const express = require("express");

const SupplyOrder = require("../models/SupplyOrder");
const ShopProduct = require("../models/ShopProduct");
const Product = require("../models/Product");
const CustomerStaff = require("../models/CustomerStaff");

const router = express.Router();

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const addQuantityToStoreInventory = async (order, customerStaffId) => {
  const productName = String(order.productName || "").trim();
  const quantity = Number(order.quantity) || 0;
  const unit = order.unit ? String(order.unit).trim() : "pcs";

  if (!productName || quantity < 1) {
    throw new Error("Supply order is missing a product name or quantity.");
  }

  let shopProduct = await ShopProduct.findOne({
    name: { $regex: `^${escapeRegex(productName)}$`, $options: "i" },
  });

  if (shopProduct) {
    shopProduct.stockQuantity =
      Number(shopProduct.stockQuantity || 0) + quantity;
    shopProduct.inStock = shopProduct.stockQuantity > 0;
    if (shopProduct.status !== "inactive") {
      shopProduct.status = "active";
    }
    await shopProduct.save();
    return { shopProduct, created: false };
  }

  let sourceProduct = null;
  if (order.productId) {
    sourceProduct = await Product.findById(order.productId);
  }

  shopProduct = new ShopProduct({
    name: productName,
    category: sourceProduct?.category || "Grocery",
    description: sourceProduct?.description || "",
    price: Number(order.pricePerUnit) || 0,
    stockQuantity: quantity,
    unit,
    image: order.productImage || sourceProduct?.image || "",
    inStock: true,
    status: "active",
    createdBy: customerStaffId || null,
  });

  await shopProduct.save();
  return { shopProduct, created: true };
};

// ==================================================
// GET COMPLETED SUPPLY ORDERS (Customer Staff)
// ==================================================
router.get("/completed", async (req, res) => {
  try {
    const orders = await SupplyOrder.find({ status: "completed" })
      .populate("supplierId", "fullName businessName")
      .populate("storeReceivedBy", "fullName")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      message: "Completed supply orders loaded successfully.",
      orders,
    });
  } catch (error) {
    console.error("Get completed supply orders error:", error);
    return res.status(500).json({
      message: "Server error. Could not load completed supply orders.",
    });
  }
});

// ==================================================
// CONFIRM RECEIPT AND ADD QUANTITY TO STORE INVENTORY
// ==================================================
router.post("/:orderId/receive", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { customerStaffId } = req.body;

    const order = await SupplyOrder.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Supply order not found.",
      });
    }

    if (order.status !== "completed") {
      return res.status(400).json({
        message: "Only completed supply orders can be received into inventory.",
      });
    }

    if (order.storeReceived) {
      return res.status(400).json({
        message: "This order has already been added to store inventory.",
      });
    }

    if (customerStaffId) {
      const staff = await CustomerStaff.findById(customerStaffId);
      if (!staff) {
        return res.status(404).json({
          message: "Customer Staff account not found.",
        });
      }
    }

    const { shopProduct, created } = await addQuantityToStoreInventory(
      order,
      customerStaffId,
    );

    order.storeReceived = true;
    order.storeReceivedAt = new Date();
    order.storeReceivedBy = customerStaffId || null;
    await order.save();

    return res.status(200).json({
      message: created
        ? "Receipt confirmed. Item added to store inventory."
        : "Receipt confirmed. Item quantity updated in store inventory.",
      order,
      shopProduct,
    });
  } catch (error) {
    console.error("Confirm supply order receipt error:", error);
    return res.status(500).json({
      message: error.message || "Server error. Could not confirm receipt.",
    });
  }
});

module.exports = router;
