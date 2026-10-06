import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import styles from "./CustomerHome.styles";

const CATEGORIES = [
  { id: "All", label: "All Items", icon: "🛍️" },
  { id: "Vegetables", label: "Vegetables", icon: "🥬" },
  { id: "Fruits", label: "Fruits", icon: "🍎" },
  { id: "Grocery", label: "Grocery", icon: "🛒" },
  { id: "Spices", label: "Spices", icon: "🌶️" },
];

export default function CustomerHome() {
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
        // Keep all active products so we can show both in-stock and out-of-stock items
        setProducts(data.products || []);
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

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
      const interval = setInterval(() => {
        fetchProducts(true);
      }, 4000);

      return () => clearInterval(interval);
    }, []),
  );

  const handleProfile = () => {
    router.push("/customer-profile");
  };

  const handleOrders = () => {
    router.push("/order-history");
  };

  const handleProducts = () => {
    router.push("/customer-products");
  };

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
      Alert.alert("Empty Cart", "Add products to your cart before ordering.");
      return;
    }

    try {
      setPlacing(true);
      const customerData = await AsyncStorage.getItem("customer");

      if (!customerData) {
        Alert.alert("Error", "Please log in to place an order.");
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
          "Order Placed 🎉",
          `Order #${data.order.orderNumber} placed successfully!`,
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
        Alert.alert("Order Failed", data.message || "Could not place order.");
      }
    } catch (error) {
      console.log("Place order error:", error);
      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>Local Grocery</Text>
            <Text style={styles.welcome}>Fresh Home 👋</Text>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleProfile}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {loading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1E3A8A" />
              <Text style={styles.loadingText}>Fetching inventory...</Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
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
              {/* Hero Banner */}
              <View style={styles.heroSection}>
                <Text style={styles.heroTitle}>Fresh Groceries,</Text>
                <Text style={styles.heroSubtitle}>Real-Time Stock.</Text>
                <Text style={styles.heroDescription}>
                  Order directly from local inventory with live stock status.
                </Text>
              </View>

              {/* Category Filter Pills */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Categories</Text>
                <Text style={styles.sectionSubtitle}>
                  {filteredProducts.length} Product
                  {filteredProducts.length !== 1 ? "s" : ""}
                </Text>
              </View>

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

              {/* Products List */}
              {filteredProducts.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>📦</Text>
                  <Text style={styles.emptyTitle}>No Products Found</Text>
                  <Text style={styles.emptyText}>
                    No products currently available in this category.
                  </Text>
                </View>
              ) : (
                filteredProducts.map((product) => {
                  const qty = cart[product._id] || 0;
                  const stockQuantity = Number(product.stockQuantity) || 0;
                  const isOutOfStock =
                    !product.inStock || stockQuantity <= 0;

                  return (
                    <View
                      key={product._id}
                      style={[
                        styles.card,
                        isOutOfStock && styles.cardDisabled,
                      ]}
                    >
                      <View
                        style={[
                          styles.cardLeft,
                          isOutOfStock && styles.cardLeftDisabled,
                        ]}
                      >
                        <Text style={styles.productIcon}>
                          {getProductIcon(product)}
                        </Text>
                      </View>

                      <View style={styles.cardBody}>
                        <View style={styles.productHeaderRow}>
                          <Text style={styles.productName}>{product.name}</Text>
                          {product.category ? (
                            <Text style={styles.categoryTag}>
                              {product.category}
                            </Text>
                          ) : null}
                        </View>

                        <Text style={styles.productPrice}>
                          Rs. {Number(product.price).toFixed(2)} / {product.unit}
                        </Text>

                        {/* Stock Status Badge */}
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

                      {/* Quantity Controls / Order Button */}
                      {isOutOfStock ? (
                        <TouchableOpacity
                          style={[styles.addButton, styles.addButtonDisabled]}
                          disabled={true}
                        >
                          <Text style={styles.addButtonTextDisabled}>
                            Out of Stock
                          </Text>
                        </TouchableOpacity>
                      ) : qty > 0 ? (
                        <View style={styles.qtyControls}>
                          <TouchableOpacity
                            style={styles.qtyButton}
                            onPress={() => updateQty(product, -1)}
                          >
                            <Text style={styles.qtyButtonText}>−</Text>
                          </TouchableOpacity>
                          <Text style={styles.qtyValue}>{qty}</Text>
                          <TouchableOpacity
                            style={[
                              styles.qtyButton,
                              qty >= stockQuantity && styles.qtyButtonDisabled,
                            ]}
                            onPress={() => updateQty(product, 1)}
                            disabled={qty >= stockQuantity}
                          >
                            <Text
                              style={[
                                styles.qtyButtonText,
                                qty >= stockQuantity &&
                                  styles.qtyButtonTextDisabled,
                              ]}
                            >
                              +
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.addButton}
                          onPress={() => updateQty(product, 1)}
                        >
                          <Text style={styles.addButtonText}>+ Add</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })
              )}
            </ScrollView>
          )}
        </View>

        {/* Floating Cart Footer */}
        {cartItems.length > 0 ? (
          <View style={styles.cartFooter}>
            <View style={styles.cartInfo}>
              <Text style={styles.cartCount}>
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items Selected
              </Text>
              <Text style={styles.cartTotal}>
                Rs. {cartTotal.toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={placeOrder}
              disabled={placing}
            >
              <Text style={styles.checkoutButtonText}>
                {placing ? "Placing..." : "Order Now"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Bottom Navigation */}
        <View style={styles.bottomNavigation}>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.activeNavText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={handleProducts}>
            <Text style={styles.navIcon}>🛒</Text>
            <Text style={styles.navText}>Products</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={handleOrders}>
            <Text style={styles.navIcon}>📦</Text>
            <Text style={styles.navText}>Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={handleProfile}>
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

