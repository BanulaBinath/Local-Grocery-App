import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";

import { API_URL } from "../../constants/api";
import styles from "./CustomerProducts.styles";

const CATEGORIES = [
  { id: "All", label: "All Items", icon: "🛍️" },
  { id: "Vegetables", label: "Vegetables", icon: "🥬" },
  { id: "Fruits", label: "Fruits", icon: "🍎" },
  { id: "Grocery", label: "Grocery", icon: "🛒" },
  { id: "Spices", label: "Spices", icon: "🌶️" },
];

export default function CustomerProducts() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [placing, setPlacing] = useState(false);

  const fetchProducts = async (isSilent = false) => {
    try {
      const response = await fetch(`${API_URL}/api/shop-products`);
      const data = await response.json();

      if (response.ok) {
        setProducts(
          (data.products || []).filter(
            (p) => p.status === "active",
          ),
        );
      } else if (!isSilent) {
        Alert.alert("Error", data.message || "Could not load products.");
      }
    } catch (error) {
      if (!isSilent) {
        console.log("Fetch shop products error:", error);
        Alert.alert("Connection Error", "Could not connect to the server.");
      }
    } finally {
      if (!isSilent) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  const getImageUrl = (product) => {
    if (product.image && !product.image.startsWith("file://")) {
      if (product.image.startsWith("http://") || product.image.startsWith("https://")) {
        return product.image;
      }
      return `${API_URL}${product.image.startsWith("/") ? product.image : `/${product.image}`}`;
    }
    const name = (product.name || "").toLowerCase();
    if (name.includes("banana")) return "https://images.unsplash.com/photo-1571501478200-720615709ee0?auto=format&fit=crop&w=200&q=80";
    if (product.category === "Vegetables") return "https://images.unsplash.com/photo-1566385101042-1a0e10ccff12?auto=format&fit=crop&w=200&q=80";
    if (product.category === "Fruits") return "https://images.unsplash.com/photo-1610832958506-aa56368149eb?auto=format&fit=crop&w=200&q=80";
    if (product.category === "Grains") return "https://images.unsplash.com/photo-1586201375761-83865001e8aa?auto=format&fit=crop&w=200&q=80";
    if (product.category === "Spices") return "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=200&q=80";
    return null;
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
      const interval = setInterval(() => {
        fetchProducts(true);
      }, 4000);

      return () => clearInterval(interval);
    }, []),
  );

  const updateQty = (product, delta) => {
    const stockQty = Number(product.stockQuantity) || 0;
    const isOutOfStock = !product.inStock || stockQty <= 0;

    if (isOutOfStock && delta > 0) {
      Alert.alert("Out of Stock", `${product.name} is currently out of stock.`);
      return;
    }

    setCart((prev) => {
      const current = prev[product._id] || 0;
      const next = current + delta;

      if (next > stockQty && delta > 0) {
        Alert.alert(
          "Stock Limit Reached",
          `Only ${stockQty} ${product.unit} available in stock.`,
        );
        return prev;
      }

      if (next <= 0) {
        const copy = { ...prev };
        delete copy[product._id];
        return copy;
      }

      return { ...prev, [product._id]: next };
    });
  };

  const matchesCategory = (product, categoryId) => {
    if (categoryId === "All") return true;
    const pCat = (product.category || "").toLowerCase().trim();
    const target = categoryId.toLowerCase();

    if (target === "vegetables") return pCat.includes("veg");
    if (target === "fruits") return pCat.includes("fruit");
    if (target === "grocery") {
      return (
        pCat.includes("groc") ||
        pCat.includes("dairy") ||
        pCat.includes("general")
      );
    }
    if (target === "spices") return pCat.includes("spice");

    return pCat === target;
  };

  const filteredProducts = products.filter((p) =>
    matchesCategory(p, selectedCategory),
  );

  const getProductIcon = (product) => {
    const pCat = (product.category || "").toLowerCase();
    if (pCat.includes("veg")) return "🥬";
    if (pCat.includes("fruit")) return "🍎";
    if (pCat.includes("spice")) return "🌶️";
    if (pCat.includes("dairy")) return "🥛";
    return "🛒";
  };

  const cartItems = Object.entries(cart)
    .map(([productId, quantity]) => {
      const product = products.find((p) => p._id === productId);
      if (!product) return null;
      return { product, quantity };
    })
    .filter(Boolean);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Empty cart", "Add at least one product to place an order.");
      return;
    }

    try {
      setPlacing(true);

      const customerData = await AsyncStorage.getItem("customer");

      if (!customerData) {
        Alert.alert("Error", "Please log in as a customer.");
        return;
      }

      const customer = JSON.parse(customerData);

      const response = await fetch(`${API_URL}/api/customer-orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customer.id,
          deliveryFee: 100,
          items: cartItems.map((item) => ({
            productId: item.product._id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCart({});
        Alert.alert(
          "Order Placed",
          `Order #${data.order.orderNumber} placed successfully.`,
          [
            {
              text: "View Orders",
              onPress: () => router.push("/order-history"),
            },
            { text: "OK" },
          ],
        );
        fetchProducts();
      } else {
        Alert.alert("Error", data.message || "Could not place order.");
      }
    } catch (error) {
      console.log("Place order error:", error);
      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E3A8A" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Browse Products</Text>
          <View style={styles.headerSpace} />
        </View>

        {/* Category Filters Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContainer}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryPill,
                  isActive && styles.categoryPillActive,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    isActive && styles.categoryTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchProducts();
              }}
              colors={["#1E3A8A"]}
            />
          }
        >
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🛒</Text>
              <Text style={styles.emptyTitle}>No Products Available</Text>
              <Text style={styles.emptyText}>
                Check back soon or select another category.
              </Text>
            </View>
          ) : (
            filteredProducts.map((product) => {
              const qty = cart[product._id] || 0;
              const stockQuantity = Number(product.stockQuantity) || 0;
              const isOutOfStock = !product.inStock || stockQuantity <= 0;

              return (
                <View
                  key={product._id}
                  style={[styles.card, isOutOfStock && styles.cardDisabled]}
                >
                  <View
                    style={[
                      styles.cardLeft,
                      isOutOfStock && styles.cardLeftDisabled,
                      { overflow: 'hidden' }
                    ]}
                  >
                    {getImageUrl(product) ? (
                      <Image
                        source={{ uri: getImageUrl(product) }}
                        style={{ width: '100%', height: '100%', borderRadius: 12 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={styles.productIcon}>
                        {getProductIcon(product)}
                      </Text>
                    )}
                  </View>

                  <View style={styles.cardBody}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productMeta}>
                      {product.unit} · Stock: {stockQuantity}
                    </Text>
                    <Text style={styles.productPrice}>
                      Rs. {Number(product.price).toFixed(2)}
                    </Text>

                    <View style={styles.stockRow}>
                      {isOutOfStock ? (
                        <View style={styles.outOfStockBadge}>
                          <Text style={styles.outOfStockText}>
                            Out of Stock
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.inStockBadge}>
                          <Text style={styles.inStockText}>
                            In Stock ({stockQuantity} {product.unit})
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.qtyControls}>
                    <TouchableOpacity
                      style={[
                        styles.qtyButton,
                        (qty <= 0 || isOutOfStock) && styles.qtyButtonDisabled,
                      ]}
                      onPress={() => updateQty(product, -1)}
                      disabled={qty <= 0 || isOutOfStock}
                    >
                      <Text
                        style={[
                          styles.qtyButtonText,
                          (qty <= 0 || isOutOfStock) &&
                            styles.qtyButtonTextDisabled,
                        ]}
                      >
                        −
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyValue}>{qty}</Text>
                    <TouchableOpacity
                      style={[
                        styles.qtyButton,
                        (isOutOfStock || qty >= stockQuantity) &&
                          styles.qtyButtonDisabled,
                      ]}
                      onPress={() => updateQty(product, 1)}
                      disabled={isOutOfStock || qty >= stockQuantity}
                    >
                      <Text
                        style={[
                          styles.qtyButtonText,
                          (isOutOfStock || qty >= stockQuantity) &&
                            styles.qtyButtonTextDisabled,
                        ]}
                      >
                        +
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {cartItems.length > 0 ? (
          <View style={styles.footer}>
            <View>
              <Text style={styles.footerLabel}>
                {cartItems.length} item(s) · Rs. {cartTotal.toFixed(2)} + fee
              </Text>
            </View>
            <TouchableOpacity
              style={styles.placeButton}
              onPress={placeOrder}
              disabled={placing}
            >
              <Text style={styles.placeButtonText}>
                {placing ? "Placing..." : "Place Order"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

