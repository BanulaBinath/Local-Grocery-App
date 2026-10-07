/**
 * Seed Customer Staff account + sample shop products + sample orders.
 * Run: node scripts/seedCustomerStaff.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const CustomerStaff = require("../models/CustomerStaff");
const Customer = require("../models/Customer");
const ShopProduct = require("../models/ShopProduct");
const CustomerOrder = require("../models/CustomerOrder");
const Feedback = require("../models/Feedback");

const STAFF_EMAIL = "samani@gmail.com";
const STAFF_PASSWORD = "samani123";

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  let staff = await CustomerStaff.findOne({ email: STAFF_EMAIL });

  // Free the email if a Customer account accidentally used it
  const conflictingCustomer = await Customer.findOne({ email: STAFF_EMAIL });
  if (conflictingCustomer) {
    conflictingCustomer.email = "samani.customer@gmail.com";
    await conflictingCustomer.save();
    console.log(
      "Moved conflicting customer email to samani.customer@gmail.com",
    );
  }

  if (!staff) {
    const hashedPassword = await bcrypt.hash(STAFF_PASSWORD, 10);

    staff = await CustomerStaff.create({
      nic: "199912345678",
      email: STAFF_EMAIL,
      fullName: "Samani Perera",
      address: "Colombo, Sri Lanka",
      phoneNumber: "0771234567",
      password: hashedPassword,
      role: "customer_staff",
      mustChangePassword: false,
    });

    console.log("Created Customer Staff:", STAFF_EMAIL);
  } else {
    staff.password = await bcrypt.hash(STAFF_PASSWORD, 10);
    staff.mustChangePassword = false;
    await staff.save();
    console.log("Updated Customer Staff password:", STAFF_EMAIL);
  }

  let customer = await Customer.findOne({ email: "amali@gmail.com" });

  if (!customer) {
    const hashedPassword = await bcrypt.hash("amali123", 10);

    customer = await Customer.create({
      nic: "199811122233",
      email: "amali@gmail.com",
      fullName: "Amali Perera",
      password: hashedPassword,
      address: "No. 45, Galle Road, Colombo 03",
    });

    console.log("Created demo customer: amali@gmail.com / amali123");
  }

  const sampleProducts = [
    {
      name: "Tomato 1kg",
      category: "Vegetables",
      price: 350,
      stockQuantity: 40,
      unit: "kg",
      inStock: true,
    },
    {
      name: "Onion 1kg",
      category: "Vegetables",
      price: 280,
      stockQuantity: 55,
      unit: "kg",
      inStock: true,
    },
    {
      name: "Bell Pepper 500g",
      category: "Vegetables",
      price: 420,
      stockQuantity: 0,
      unit: "pack",
      inStock: false,
    },
    {
      name: "Fresh Red Apple 1kg",
      category: "Fruits",
      price: 650,
      stockQuantity: 20,
      unit: "kg",
      inStock: true,
    },
    {
      name: "Organic Bananas",
      category: "Fruits",
      price: 220,
      stockQuantity: 0,
      unit: "bunch",
      inStock: false,
    },
    {
      name: "Fresh Milk 1L",
      category: "Grocery",
      price: 450,
      stockQuantity: 15,
      unit: "bottle",
      inStock: true,
    },
    {
      name: "White Rice 5kg",
      category: "Grocery",
      price: 1100,
      stockQuantity: 10,
      unit: "bag",
      inStock: true,
    },
    {
      name: "Chili Powder 250g",
      category: "Spices",
      price: 380,
      stockQuantity: 30,
      unit: "pack",
      inStock: true,
    },
    {
      name: "Black Pepper 100g",
      category: "Spices",
      price: 290,
      stockQuantity: 0,
      unit: "pack",
      inStock: false,
    },
  ];

  const products = [];

  for (const item of sampleProducts) {
    let product = await ShopProduct.findOne({ name: item.name });

    if (!product) {
      product = await ShopProduct.create({
        ...item,
        description: `Fresh ${item.name}`,
        createdBy: staff._id,
      });
      console.log("Created product:", item.name);
    }

    products.push(product);
  }

  const existingOrders = await CustomerOrder.countDocuments();

  if (existingOrders === 0 && products.length >= 2) {
    const tomato = products.find((p) => p.name === "Tomato 1kg") || products[0];
    const onion = products.find((p) => p.name === "Onion 1kg") || products[1];
    const milk = products.find((p) => p.name === "Fresh Milk 1L") || products[2];

    const orders = [
      {
        orderNumber: 1024,
        status: "pending",
        items: [
          {
            productId: tomato._id,
            productName: tomato.name,
            productImage: tomato.image || "",
            quantity: 2,
            unit: tomato.unit,
            price: tomato.price,
            lineTotal: tomato.price * 2,
          },
          {
            productId: onion._id,
            productName: onion.name,
            productImage: onion.image || "",
            quantity: 1,
            unit: onion.unit,
            price: onion.price,
            lineTotal: onion.price,
          },
        ],
      },
      {
        orderNumber: 1025,
        status: "pending",
        items: [
          {
            productId: milk._id,
            productName: milk.name,
            productImage: milk.image || "",
            quantity: 2,
            unit: milk.unit,
            price: milk.price,
            lineTotal: milk.price * 2,
          },
        ],
      },
      {
        orderNumber: 1023,
        status: "accepted",
        items: [
          {
            productId: tomato._id,
            productName: tomato.name,
            productImage: tomato.image || "",
            quantity: 1,
            unit: tomato.unit,
            price: tomato.price,
            lineTotal: tomato.price,
          },
        ],
      },
    ];

    for (const draft of orders) {
      const itemsTotal = draft.items.reduce((sum, i) => sum + i.lineTotal, 0);
      const deliveryFee = 100;
      const totalAmount = itemsTotal + deliveryFee;

      await CustomerOrder.create({
        orderNumber: draft.orderNumber,
        customerId: customer._id,
        customerName: customer.fullName,
        customerPhone: "0712345678",
        customerAddress: customer.address,
        items: draft.items,
        itemsTotal,
        deliveryFee,
        totalAmount,
        status: draft.status,
        handledBy: draft.status === "accepted" ? staff._id : null,
        statusHistory: [
          { status: "pending", updatedAt: new Date(Date.now() - 3600000) },
          ...(draft.status === "accepted"
            ? [
                {
                  status: "accepted",
                  updatedAt: new Date(),
                  updatedBy: staff._id,
                },
              ]
            : []),
        ],
      });

      console.log(`Created sample order #${draft.orderNumber} (${draft.status})`);
    }
  } else {
    console.log("Orders already exist, skipping sample order creation.");
  }

  const existingFeedback = await Feedback.countDocuments();
  if (existingFeedback === 0) {
    await Feedback.create([
      {
        customerId: customer._id,
        customerName: "Amali Perera",
        customerEmail: "amali@gmail.com",
        rating: 5,
        comment:
          "Very fresh organic vegetables! The store pickup was ready on time and staff packed everything neatly. Highly recommended!",
        orderNumber: 1023,
      },
      {
        customerName: "Kamal Fernando",
        rating: 5,
        comment:
          "Saved so much time by ordering carrots, onions, and milk in advance. Quick counter pickup with zero waiting line.",
      },
      {
        customerName: "Nimali Silva",
        rating: 4,
        comment:
          "Good quality grocery items at fair local prices. The pickup slot system is super convenient.",
      },
    ]);
    console.log("Seeded sample customer feedbacks.");
  }

  console.log("\nSeed complete.");
  console.log("Customer Staff login:", STAFF_EMAIL, "/", STAFF_PASSWORD);
  console.log("Demo customer login: amali@gmail.com / amali123");

  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
