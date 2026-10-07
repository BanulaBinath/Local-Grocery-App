import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router, useFocusEffect } from "expo-router";

import { API_URL } from "../../constants/api";
import { getCart, updateCartItem } from "../../utils/cartStorage";
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
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async (isSilent = false) => {
    try {
      const response = await fetch(`${API_URL}/api/shop-products`);
      const data = await response.json();

      if (response.ok) {
        setProducts(
          (data.products || []).filter((p) => p.status === "active"),
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

  const syncCart = async () => {
    const current = await getCart();
    setCart(current);
  };

  useFocusEffect(
    useCallback(() => {
      syncCart();
      fetchProducts();
    }, []),
  );

  const getImageUrl = (product) => {
    if (product.image && !product.image.startsWith("file://")) {
      if (product.image.startsWith("http://") || product.image.startsWith("https://")) {
        return product.image;
      }
      return `${API_URL}${product.image.startsWith("/") ? product.image : `/${product.image}`}`;
    }
    return null;
  };

  const updateQty = async (product, delta) => {
    const stockQty = Number(product.stockQuantity) || 0;
    const isOutOfStock = !product.inStock || stockQty <= 0;

    if (isOutOfStock && delta > 0) {
      Alert.alert("Out of Stock", `${product.name} is currently out of stock.`);
      return;
    }

    const currentQty = cart[product._id] || 0;
    if (currentQty + delta > stockQty && delta > 0) {
      Alert.alert(
        "Stock Limit Reached",
        `Only ${stockQty} ${product.unit} available in stock.`,
      );
      return;
    }

    const updated = await updateCartItem(product._id, delta, stockQty);
    setCart({ ...updated });
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

  const filteredProducts = products.filter((p) => {
    const matchCat = matchesCategory(p, selectedCategory);
    if (!matchCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const name = (p.name || "").toLowerCase();
      const cat = (p.category || "").toLowerCase();
      return name.includes(q) || cat.includes(q);
    }
    return true;
  });

  const getProductIcon = (product) => {
    const pCat = (product.category || "").toLowerCase();
    if (pCat.includes("veg")) return "🥬";
    if (pCat.includes("fruit")) return "🍎";
    if (pCat.includes("spice")) return "🌶️";
    if (pCat.includes("dairy")) return "🥛";
    return "🛒";
  };

  const cartItemsCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [pId, qty]) => {
    const prod = products.find((p) => p._id === pId);
    return prod ? sum + prod.price * qty : sum;
  }, 0);

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
          <TouchableOpacity
            onPress={() => router.push("/customer-cart")}
            style={{ padding: 6 }}
          >
            <Text style={{ fontSize: 20 }}>🛒</Text>
            {cartItemsCount > 0 ? (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  backgroundColor: "#1E3A8A",
                  borderRadius: 8,
                  minWidth: 16,
                  height: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "#FFF", fontSize: 10, fontWeight: "800" }}>
                  {cartItemsCount}
                </Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: "#FFF" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#F1F5F9",
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          >
            <Text style={{ fontSize: 14, marginRight: 8 }}>🔍</Text>
            <TextInput
              style={{ flex: 1, fontSize: 14, color: "#0F172A", padding: 0 }}
              placeholder="Search products..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
            {search.trim() ? (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Text style={{ color: "#94A3B8", fontWeight: "700" }}>✕</Text>
              </TouchableOpacity>
            ) : null}
          </View>
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
                syncCart();
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
              const imageUrl = getImageUrl(product);

              return (
                <View
                  key={product._id}
                  style={[styles.card, isOutOfStock && styles.cardDisabled]}
                >
                  <View
                    style={[
                      styles.cardLeft,
                      isOutOfStock && styles.cardLeftDisabled,
                      { overflow: "hidden" },
                    ]}
                  >
                    {imageUrl ? (
                      <Image
                        source={{ uri: imageUrl }}
                        style={{ width: "100%", height: "100%", borderRadius: 12 }}
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

        {cartItemsCount > 0 ? (
          <View style={styles.footer}>
            <View>
              <Text style={styles.footerLabel}>
                {cartItemsCount} item(s) in Cart · Rs. {cartTotal.toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.placeButton}
              onPress={() => router.push("/customer-cart")}
            >
              <Text style={styles.placeButtonText}>View Cart & Checkout ›</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
