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
import styles from "./SupplierProducts.styles";

export default function SupplierProducts() {
  const [supplier, setSupplier] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [changingStatusId, setChangingStatusId] = useState(null);

  // ========================================
  // NAVIGATION
  // ========================================

  const handleHome = () => {
    router.replace("/supplier-dashboard");
  };

  const handleProducts = () => {
    router.replace("/supplier-products");
  };

  const handleOrders = () => {
    router.replace("/supplier-orders");
  };

  const handleMessages = () => {
    router.replace("/supplier-messages");
  };

  const handleProfile = () => {
    router.push("/supplier-profile");
  };

  // ========================================
  // LOAD SUPPLIER
  // ========================================

  const loadSupplier = async () => {
    try {
      const supplierData = await AsyncStorage.getItem("supplier");

      if (!supplierData) {
        router.replace("/login");
        return null;
      }

      const parsedSupplier = JSON.parse(supplierData);

      console.log("SUPPLIER DATA:", parsedSupplier);

      setSupplier(parsedSupplier);

      return parsedSupplier;
    } catch (error) {
      console.log("Load supplier error:", error);

      Alert.alert("Error", "Could not load supplier information.");

      return null;
    }
  };

  // ========================================
  // LOAD PRODUCTS
  // ========================================

  const loadProducts = async (supplierData) => {
    try {
      if (!supplierData?.id) {
        console.log("Supplier ID not available.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/products/supplier/${supplierData.id}`,
      );

      const data = await response.json();

      if (response.ok) {
        setProducts(data.products || []);
      } else {
        Alert.alert("Error", data.message || "Could not load products.");
      }
    } catch (error) {
      console.log("Load products error:", error);

      Alert.alert("Connection Error", "Could not connect to the server.");
    }
  };

  // ========================================
  // LOAD DATA
  // ========================================

  const loadData = async () => {
    try {
      const supplierData = await loadSupplier();

      if (supplierData) {
        await loadProducts(supplierData);
      }
    } catch (error) {
      console.log("Load data error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  // ========================================
  // REFRESH
  // ========================================

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // ========================================
  // ADD PRODUCT
  // ========================================

  const handleAddProduct = () => {
    if (!supplier?.id) {
      Alert.alert("Error", "Supplier information is not available.");
      return;
    }

    console.log("Opening Add Product with supplierId:", supplier.id);

    router.push({
      pathname: "/add-product",
      params: {
        supplierId: String(supplier.id),
      },
    });
  };

  // ========================================
  // EDIT PRODUCT
  // ========================================

  const handleEditProduct = (product) => {
    if (!supplier?.id) {
      Alert.alert("Error", "Supplier information is not available.");
      return;
    }

    console.log("Opening Edit Product:", {
      supplierId: supplier.id,
      productId: product._id,
    });

    router.push({
      pathname: "/add-product",
      params: {
        supplierId: String(supplier.id),
        productId: String(product._id),
      },
    });
  };

  // ========================================
  // DELETE PRODUCT
  // ========================================

  const handleDeleteProduct = (product) => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete "${product.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Delete",
          style: "destructive",

          onPress: async () => {
            try {
              if (!supplier?.id) {
                Alert.alert("Error", "Supplier information is not available.");
                return;
              }

              const response = await fetch(
                `${API_URL}/api/products/${product._id}`,
                {
                  method: "DELETE",

                  headers: {
                    "Content-Type": "application/json",
                  },

                  body: JSON.stringify({
                    supplierId: supplier.id,
                  }),
                },
              );

              const data = await response.json();

              if (response.ok) {
                Alert.alert("Success", "Product deleted successfully.");

                await loadProducts(supplier);
              } else {
                Alert.alert(
                  "Delete Failed",
                  data.message || "Could not delete product.",
                );
              }
            } catch (error) {
              console.log("Delete product error:", error);

              Alert.alert(
                "Connection Error",
                "Could not connect to the server.",
              );
            }
          },
        },
      ],
    );
  };

  // ========================================
  // ACTIVATE / DEACTIVATE
  // ========================================

  const handleToggleStatus = (product) => {
    if (!supplier?.id) {
      Alert.alert("Error", "Supplier information is not available.");
      return;
    }

    // OUT OF STOCK
    if (
      product.status === "out_of_stock" ||
      Number(product.stockQuantity) <= 0
    ) {
      Alert.alert(
        "Out of Stock",
        "This product is out of stock. Please add stock before activating it.",
      );

      return;
    }

    const isCurrentlyActive = product.status === "active";

    const newStatus = isCurrentlyActive ? "inactive" : "active";

    const actionText = isCurrentlyActive ? "deactivate" : "activate";

    Alert.alert(
      isCurrentlyActive ? "Deactivate Product" : "Activate Product",

      `Are you sure you want to ${actionText} "${product.name}"?`,

      [
        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: isCurrentlyActive ? "Deactivate" : "Activate",

          onPress: async () => {
            try {
              setChangingStatusId(product._id);

              const response = await fetch(
                `${API_URL}/api/products/${product._id}/status`,
                {
                  method: "PUT",

                  headers: {
                    "Content-Type": "application/json",
                  },

                  body: JSON.stringify({
                    supplierId: supplier.id,
                    status: newStatus,
                  }),
                },
              );

              const data = await response.json();

              if (response.ok) {
                setProducts((currentProducts) =>
                  currentProducts.map((item) =>
                    item._id === product._id
                      ? {
                          ...item,
                          status: data.product?.status || newStatus,
                        }
                      : item,
                  ),
                );

                Alert.alert(
                  "Success",
                  data.message || `Product ${actionText}d successfully.`,
                );
              } else {
                Alert.alert(
                  "Status Update Failed",
                  data.message || "Could not update product status.",
                );
              }
            } catch (error) {
              console.log("Toggle product status error:", error);

              Alert.alert(
                "Connection Error",
                "Could not connect to the server.",
              );
            } finally {
              setChangingStatusId(null);
            }
          },
        },
      ],
    );
  };

  // ========================================
  // LOADING
  // ========================================

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

  // ========================================
  // MAIN UI
  // ========================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>My Products</Text>

            <Text style={styles.headerSubtitle}>
              Manage your grocery products
            </Text>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleProfile}
            activeOpacity={0.8}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>

          <View style={styles.countBadge}>
            <Text style={styles.countText}>{products.length}</Text>
          </View>
        </View>

        {/* ADD PRODUCT */}

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddProduct}
          activeOpacity={0.8}
        >
          <Text style={styles.addIcon}>+</Text>

          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>

        {/* PRODUCT LIST */}

        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#1E3A8A"]}
            />
          }
        >
          {products.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📦</Text>

              <Text style={styles.emptyTitle}>No Products Yet</Text>

              <Text style={styles.emptyText}>
                You haven't added any products yet. Add your first grocery
                product to start selling.
              </Text>

              <TouchableOpacity
                style={styles.emptyAddButton}
                onPress={handleAddProduct}
                activeOpacity={0.8}
              >
                <Text style={styles.emptyAddButtonText}>
                  Add Your First Product
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            products.map((product) => {
              const isOutOfStock =
                product.status === "out_of_stock" ||
                Number(product.stockQuantity) <= 0;

              const isActive = product.status === "active";

              const isInactive = product.status === "inactive";

              return (
                <View key={product._id} style={styles.productCard}>
                  {/* IMAGE */}

                  {product.image ? (
                    <Image
                      source={{
                        uri:
                          product.image.startsWith("http://") ||
                          product.image.startsWith("https://")
                            ? product.image
                            : `${API_URL}${product.image.startsWith("/") ? "" : "/"}${product.image}`,
                      }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.productImagePlaceholder}>
                      <Text style={styles.productImageIcon}>🛒</Text>
                    </View>
                  )}

                  {/* CONTENT */}

                  <View style={styles.productContent}>
                    {/* NAME + STATUS */}

                    <View style={styles.productTopRow}>
                      <Text style={styles.productName} numberOfLines={1}>
                        {product.name}
                      </Text>

                      <View
                        style={[
                          styles.statusBadge,
                          isActive
                            ? styles.availableBadge
                            : isInactive
                              ? styles.inactiveBadge
                              : styles.outOfStockBadge,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            isActive
                              ? styles.availableText
                              : isInactive
                                ? styles.inactiveText
                                : styles.outOfStockText,
                          ]}
                        >
                          {isActive
                            ? "Active"
                            : isInactive
                              ? "Inactive"
                              : "Out of Stock"}
                        </Text>
                      </View>
                    </View>

                    {/* CATEGORY */}

                    <Text style={styles.productCategory}>
                      {product.category}
                    </Text>

                    {/* DESCRIPTION */}

                    {product.description ? (
                      <Text style={styles.productDescription} numberOfLines={2}>
                        {product.description}
                      </Text>
                    ) : null}

                    {/* PRICE + STOCK */}

                    <View style={styles.productDetails}>
                      <Text style={styles.productPrice}>
                        Rs. {product.price}
                      </Text>

                      <Text style={styles.productStock}>
                        Stock: {product.stockQuantity} {product.unit}
                      </Text>
                    </View>

                    {/* ACTION BUTTONS */}

                    <View style={styles.productActions}>
                      {/* EDIT */}

                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => handleEditProduct(product)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.editButtonText}>Edit</Text>
                      </TouchableOpacity>

                      {/* ACTIVE */}

                      {isActive && (
                        <TouchableOpacity
                          style={styles.deactivateButton}
                          onPress={() => handleToggleStatus(product)}
                          disabled={changingStatusId === product._id}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.deactivateButtonText}>
                            {changingStatusId === product._id
                              ? "Updating..."
                              : "Deactivate"}
                          </Text>
                        </TouchableOpacity>
                      )}

                      {/* INACTIVE */}

                      {isInactive && (
                        <TouchableOpacity
                          style={styles.activateButton}
                          onPress={() => handleToggleStatus(product)}
                          disabled={changingStatusId === product._id}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.activateButtonText}>
                            {changingStatusId === product._id
                              ? "Updating..."
                              : "Activate"}
                          </Text>
                        </TouchableOpacity>
                      )}

                      {/* OUT OF STOCK */}

                      {isOutOfStock && (
                        <TouchableOpacity
                          style={styles.outOfStockActionButton}
                          onPress={() => handleToggleStatus(product)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.outOfStockActionButtonText}>
                            Activate
                          </Text>
                        </TouchableOpacity>
                      )}

                      {/* DELETE */}

                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteProduct(product)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* BOTTOM NAV */}

        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={handleHome}
            activeOpacity={0.7}
          >
            <Text style={styles.navIcon}>🏠</Text>

            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={handleProducts}
            activeOpacity={0.7}
          >
            <Text style={styles.navIcon}>📦</Text>

            <Text style={styles.navLabelActive}>Products</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={handleOrders}
            activeOpacity={0.7}
          >
            <Text style={styles.navIcon}>🛒</Text>

            <Text style={styles.navLabel}>Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={handleMessages}
            activeOpacity={0.7}
          >
            <Text style={styles.navIcon}>💬</Text>

            <Text style={styles.navLabel}>Messages</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
