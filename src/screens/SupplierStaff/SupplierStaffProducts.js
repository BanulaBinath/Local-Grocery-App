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

import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { API_URL } from "../../constants/api";

import styles from "./SupplierStaffProducts.styles";

export default function SupplierStaffProducts() {
  const { supplierId, supplierName, supplierAddress } = useLocalSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ========================================
  // FETCH SUPPLIER PRODUCTS
  // ========================================

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/products/supplier/${supplierId}`,
      );

      const data = await response.json();

      if (response.ok) {
        const allProducts = data.products || data || [];

        // DEBUG - CHECK PRODUCT IMAGE DATA
        console.log(
          "SUPPLIER STAFF PRODUCTS:",
          JSON.stringify(allProducts, null, 2),
        );

        // Only active products with stock
        const activeProducts = allProducts.filter(
          (product) =>
            product.status === "active" && Number(product.stockQuantity) > 0,
        );

        setProducts(activeProducts);
      } else {
        Alert.alert("Error", data.message || "Could not load products.");
      }
    } catch (error) {
      console.log("Fetch supplier products error:", error);

      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ========================================
  // LOAD PRODUCTS WHEN SCREEN OPENS
  // ========================================

  useFocusEffect(
    useCallback(() => {
      if (supplierId) {
        fetchProducts();
      }
    }, [supplierId]),
  );

  // ========================================
  // REFRESH
  // ========================================

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  // ========================================
  // OPEN PRODUCT DETAILS
  // ========================================

  const handleProductPress = (product) => {
    router.push({
      pathname: "/supplier-staff-product-details",

      params: {
        productId: product._id,
        supplierId: supplierId,
        supplierName: supplierName || "Supplier",
        supplierAddress: supplierAddress || "",
        productName: product.name || "Product",
        category: product.category || "",
        description: product.description || "",
        price: String(product.price || 0),
        stockQuantity: String(product.stockQuantity || 0),
        unit: product.unit || "",
        image: product.image || "",
        status: product.status || "active",
      },
    });
  };

  // ========================================
  // IMAGE URL
  // ========================================

  const getImageUrl = (image) => {
    if (!image) {
      return null;
    }

    // Already a complete URL
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    // Image path starts with /
    if (image.startsWith("/")) {
      return `${API_URL}${image}`;
    }

    // Image path without /
    return `${API_URL}/${image}`;
  };

  // ========================================
  // IMAGE ERROR
  // ========================================

  const handleImageError = (product, imageUrl) => {
    console.log("PRODUCT IMAGE FAILED:", product.name, imageUrl);
  };

  // ========================================
  // UI
  // ========================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ========================================
            HEADER
        ======================================== */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Products</Text>

            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {supplierName || "Supplier"}
            </Text>
          </View>
        </View>

        {/* ========================================
            CONTENT
        ======================================== */}

        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#1E3A8A" />

            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: 16,
              paddingBottom: 30,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          >
            {products.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📦</Text>

                <Text style={styles.emptyTitle}>No Active Products</Text>

                <Text style={styles.emptyText}>
                  This supplier currently has no active products available for
                  ordering.
                </Text>
              </View>
            ) : (
              products.map((product) => {
                const imageUrl = getImageUrl(product.image);

                return (
                  <TouchableOpacity
                    key={product._id}
                    style={styles.card}
                    onPress={() => handleProductPress(product)}
                    activeOpacity={0.8}
                  >
                    {/* ========================================
                        PRODUCT IMAGE
                    ======================================== */}

                    <View style={styles.productImageContainer}>
                      {imageUrl ? (
                        <Image
                          source={{
                            uri: imageUrl,
                          }}
                          style={styles.productImage}
                          resizeMode="cover"
                          onError={() => handleImageError(product, imageUrl)}
                        />
                      ) : (
                        <Text style={styles.productIcon}>🛒</Text>
                      )}
                    </View>

                    {/* ========================================
                        PRODUCT INFORMATION
                    ======================================== */}

                    <View style={styles.cardContent}>
                      <Text style={styles.productName} numberOfLines={1}>
                        {product.name}
                      </Text>

                      <Text style={styles.category}>{product.category}</Text>

                      <Text style={styles.price}>
                        Rs. {Number(product.price).toFixed(2)}
                      </Text>

                      <Text style={styles.stock}>
                        Stock: {product.stockQuantity} {product.unit}
                      </Text>
                    </View>

                    {/* ========================================
                        ACTIVE BADGE
                    ======================================== */}

                    <View style={styles.activeBadge}>
                      <Text style={styles.activeBadgeText}>Active</Text>
                    </View>

                    {/* ========================================
                        ARROW
                    ======================================== */}

                    <Text style={styles.arrow}>›</Text>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
