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
import CustomerBottomNav from "./CustomerBottomNav";
import { addProductToCart } from "./customerCartStorage";
import styles from "./CustomerHome.styles";

const CATEGORIES = [
  { id: "All", label: "All", icon: "🛍️" },
  { id: "Vegetables", label: "Vegetables", icon: "🥬" },
  { id: "Fruits", label: "Fruits", icon: "🍎" },
  { id: "Grocery", label: "Grocery", icon: "🛒" },
  { id: "Grains", label: "Grains", icon: "🌾" },
  { id: "Spices", label: "Spices", icon: "🌶️" },
];

export default function CustomerHome() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async (isSilent = false) => {
    try {
      const response = await fetch(`${API_URL}/api/shop-products`);
      const data = await response.json();

      if (response.ok) {
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

  const getImageUrl = (product) => {
    if (!product?.image || String(product.image).startsWith("file://")) {
      return null;
    }
    if (
      String(product.image).startsWith("http://") ||
      String(product.image).startsWith("https://")
    ) {
      return product.image;
    }
    return `${API_URL}${
      String(product.image).startsWith("/") ? product.image : `/${product.image}`
    }`;
  };

  const getCategoryIcon = (category) => {
    const pCat = (category || "").toLowerCase();
    if (pCat.includes("veg")) return "🥬";
    if (pCat.includes("fruit")) return "🍎";
    if (pCat.includes("grain")) return "🌾";
    if (pCat.includes("spice")) return "🌶️";
    return "🛒";
  };

  const openProductCheckout = async (product, isOutOfStock) => {
    if (isOutOfStock) {
      Alert.alert("Out of Stock", `${product.name} is currently out of stock.`);
      return;
    }

    await addProductToCart(product);
    router.push("/customer-cart");
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
    if (target === "grains") return pCat.includes("grain");
    if (target === "spices") return pCat.includes("spice");

    return pCat === target;
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = search
      ? (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.category || "").toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesSearch && matchesCategory(p, selectedCategory);
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>Local Grocery</Text>
            <Text style={styles.welcome}>Fresh Home 👋</Text>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/customer-profile")}
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
              <View style={styles.searchContainer}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search products..."
                  placeholderTextColor="#94A3B8"
                  value={search}
                  onChangeText={setSearch}
                />
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

              {filteredProducts.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>📦</Text>
                  <Text style={styles.emptyTitle}>No Products Found</Text>
                  <Text style={styles.emptyText}>
                    No products currently available in this category.
                  </Text>
                </View>
              ) : (
                <View style={styles.productGrid}>
                  {filteredProducts.map((product) => {
                    const stockQuantity = Number(product.stockQuantity) || 0;
                    const isOutOfStock = !product.inStock || stockQuantity <= 0;
                    const imageUrl = getImageUrl(product);

                    return (
                      <TouchableOpacity
                        key={product._id}
                        style={styles.productCard}
                        activeOpacity={0.88}
                        onPress={() =>
                          openProductCheckout(product, isOutOfStock)
                        }
                      >
                        <View style={styles.productImageBox}>
                          {imageUrl ? (
                            <Image
                              source={{ uri: imageUrl }}
                              style={styles.productImage}
                              resizeMode="cover"
                            />
                          ) : (
                            <View style={styles.productImagePlaceholder}>
                              <Text style={styles.productImageIcon}>
                                {getCategoryIcon(product.category)}
                              </Text>
                            </View>
                          )}
                          <View
                            style={[
                              styles.stockBadgeOverlay,
                              isOutOfStock && styles.stockBadgeOverlayOut,
                            ]}
                          >
                            <Text style={styles.stockBadgeOverlayText}>
                              {isOutOfStock ? "Out of Stock" : "In Stock"}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.productBody}>
                          <Text style={styles.gridProductName} numberOfLines={1}>
                            {product.name}
                          </Text>
                          {product.category ? (
                            <View style={styles.categoryPillSmall}>
                              <Text style={styles.categoryPillSmallText}>
                                {getCategoryIcon(product.category)}{" "}
                                {product.category}
                              </Text>
                            </View>
                          ) : null}
                          <View style={styles.productBottom}>
                            <Text style={styles.gridProductPrice}>
                              Rs.{Number(product.price).toFixed(0)}
                            </Text>
                            <Text style={styles.productUnit}>
                              /{product.unit || "pcs"}
                            </Text>
                          </View>
                          <Text style={styles.productQty}>
                            {isOutOfStock
                              ? "No stock"
                              : `${stockQuantity} available`}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </ScrollView>
          )}
        </View>

        <CustomerBottomNav active="home" />
      </View>
    </SafeAreaView>
  );
}
