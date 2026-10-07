import { API_URL } from "./api";

export const SAMPLE_PRODUCTS = [
  {
    _id: "sample-carrot-1",
    name: "Fresh Organic Carrots",
    category: "Vegetables",
    price: 240,
    stockQuantity: 35,
    unit: "kg",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=400&q=80",
    description:
      "Farm fresh crisp orange carrots rich in vitamin A and natural sweet flavor. Ideal for curries, salads, and fresh juice.",
  },
  {
    _id: "sample-tomato-2",
    name: "Red Ripe Tomatoes",
    category: "Vegetables",
    price: 350,
    stockQuantity: 40,
    unit: "kg",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80",
    description:
      "Juicy, firm garden-fresh red tomatoes handpicked daily from local producers.",
  },
  {
    _id: "sample-apple-3",
    name: "Crisp Royal Gala Apples",
    category: "Fruits",
    price: 650,
    stockQuantity: 25,
    unit: "kg",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80",
    description:
      "Sweet, crunchy Royal Gala apples with natural shine and high dietary fiber.",
  },
  {
    _id: "sample-banana-4",
    name: "Fresh Cavendish Bananas",
    category: "Fruits",
    price: 220,
    stockQuantity: 30,
    unit: "bunch",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80",
    description:
      "Naturally ripened yellow Cavendish bananas packed with potassium and instant energy.",
  },
  {
    _id: "sample-milk-5",
    name: "Fresh Pasteurized Cow Milk (1L)",
    category: "Grocery",
    price: 450,
    stockQuantity: 20,
    unit: "bottle",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80",
    description:
      "Pure, calcium-rich pasteurized full cream cow milk from local dairy farms.",
  },
  {
    _id: "sample-onion-6",
    name: "Big Red Onions",
    category: "Vegetables",
    price: 280,
    stockQuantity: 50,
    unit: "kg",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=80",
    description:
      "Top grade dry red onions with sharp aroma and flavor, perfect for daily cooking.",
  },
  {
    _id: "sample-pepper-7",
    name: "Green Bell Pepper (Capsicum)",
    category: "Vegetables",
    price: 420,
    stockQuantity: 15,
    unit: "pack",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=80",
    description:
      "Crisp green capsicum bell peppers harvested fresh, great for roasts and chop suey.",
  },
  {
    _id: "sample-chili-8",
    name: "Ceylon Pure Chili Powder (250g)",
    category: "Spices",
    price: 380,
    stockQuantity: 25,
    unit: "pack",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    description:
      "100% authentic ground Ceylon red chili powder with rich vibrant color and heat.",
  },
  {
    _id: "sample-rice-9",
    name: "Premium White Rice (5kg)",
    category: "Grocery",
    price: 1100,
    stockQuantity: 12,
    unit: "bag",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e8aa?auto=format&fit=crop&w=400&q=80",
    description:
      "Carefully cleaned and packed premium quality polished white rice bag.",
  },
];

export const resolveProductImageUrl = (product) => {
  const img = product?.image;
  if (img && !img.startsWith("file://")) {
    if (img.startsWith("http://") || img.startsWith("https://")) {
      return img;
    }
    return `${API_URL}${img.startsWith("/") ? img : `/${img}`}`;
  }

  const name = (product?.name || "").toLowerCase();
  if (name.includes("carrot")) {
    return "https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?auto=format&fit=crop&w=400&q=80";
  }
  if (name.includes("tomato")) {
    return "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80";
  }
  if (name.includes("apple")) {
    return "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80";
  }
  if (name.includes("banana")) {
    return "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80";
  }
  if (name.includes("milk")) {
    return "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80";
  }
  if (name.includes("onion")) {
    return "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=80";
  }
  if (name.includes("pepper") || name.includes("capsicum")) {
    return "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=80";
  }
  if (name.includes("chili") || product?.category === "Spices") {
    return "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80";
  }
  if (name.includes("rice") || product?.category === "Grocery") {
    return "https://images.unsplash.com/photo-1586201375761-83865001e8aa?auto=format&fit=crop&w=400&q=80";
  }
  if (product?.category === "Vegetables") {
    return "https://images.unsplash.com/photo-1566385101042-1a0e10ccff12?auto=format&fit=crop&w=400&q=80";
  }
  if (product?.category === "Fruits") {
    return "https://images.unsplash.com/photo-1610832958506-aa56368149eb?auto=format&fit=crop&w=400&q=80";
  }
  return null;
};
