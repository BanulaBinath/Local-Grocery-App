import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { router, useFocusEffect } from "expo-router";

import { API_URL } from "../../constants/api";

import styles from "./SupplierDashboard.styles";

export default function SupplierDashboard() {
  // ==========================================
  // STATE
  // ==========================================

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ==========================================
  // NAVIGATION
  // ==========================================

  const handleHome = () => {
    router.replace("/supplier-dashboard");
  };

  const handleProducts = () => {
    router.push("/supplier-products");
  };

  const handleOrders = () => {
    router.push("/supplier-orders");
  };

  const handleMessages = () => {
    router.push("/supplier-messages");
  };

  const handleProfile = () => {
    router.push("/supplier-profile");
  };

  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  const fetchDashboardData = async () => {
    try {
      const supplierData = await AsyncStorage.getItem("supplier");

      if (!supplierData) {
        Alert.alert(
          "Session Error",
          "Supplier information was not found. Please login again.",
        );

        setLoading(false);
        setRefreshing(false);

        return;
      }

      const supplier = JSON.parse(supplierData);

      if (!supplier.id) {
        Alert.alert(
          "Session Error",
          "Supplier ID was not found. Please login again.",
        );

        setLoading(false);
        setRefreshing(false);

        return;
      }

      console.log("Supplier Dashboard Supplier ID:", supplier.id);

      // ========================================
      // LOAD PRODUCTS
      // ========================================

      const productsResponse = await fetch(
        `${API_URL}/api/products/supplier/${supplier.id}`,
      );

      const productsData = await productsResponse.json();

      console.log("Supplier Dashboard Products:", productsData);

      if (productsResponse.ok) {
        setProducts(productsData.products || []);
      } else {
        console.log("Products error:", productsData.message);
      }

      // ========================================
      // LOAD SUPPLY ORDERS
      // ========================================

      const ordersResponse = await fetch(
        `${API_URL}/api/supply-orders/supplier/${supplier.id}`,
      );

      const ordersData = await ordersResponse.json();

      console.log("Supplier Dashboard Orders:", ordersData);

      if (ordersResponse.ok) {
        setOrders(ordersData.orders || []);
      } else {
        console.log("Orders error:", ordersData.message);
      }
    } catch (error) {
      console.log("Supplier dashboard error:", error);

      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ==========================================
  // REFRESH WHEN SCREEN OPENS
  // ==========================================

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, []),
  );

  // ==========================================
  // PULL TO REFRESH
  // ==========================================

  const handleRefresh = () => {
    setRefreshing(true);

    fetchDashboardData();
  };

  // ==========================================
  // PRODUCT METRICS
  // ==========================================

  const totalProducts = products.length;

  const activeProducts = products.filter(
    (product) =>
      product.status === "available" && Number(product.stockQuantity) > 0,
  ).length;

  const outOfStockProducts = products.filter(
    (product) =>
      product.status === "out_of_stock" || Number(product.stockQuantity) <= 0,
  ).length;

  // ==========================================
  // ORDER METRICS
  // ==========================================

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending",
  ).length;

  const acceptedOrders = orders.filter(
    (order) => order.status === "accepted",
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "completed",
  ).length;

  // ==========================================
  // LATEST ORDER
  // ==========================================

  const latestOrder = orders.length > 0 ? orders[0] : null;

  // ==========================================
  // ORDER STATUS TEXT
  // ==========================================

  const getOrderStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending";

      case "accepted":
        return "Accepted";

      case "rejected":
        return "Rejected";

      case "completed":
        return "Completed";

      default:
        return status || "Unknown";
    }
  };

  // ==========================================
  // ORDER PROGRESS
  // ==========================================

  const getProgressWidth = (status) => {
    switch (status) {
      case "pending":
        return "25%";

      case "accepted":
        return "50%";

      case "completed":
        return "100%";

      case "rejected":
        return "100%";

      default:
        return "25%";
    }
  };

  // ==========================================
  // STAFF NAME
  // ==========================================

  const getStaffName = (order) => {
    if (order?.supplierStaffId && typeof order.supplierStaffId === "object") {
      return order.supplierStaffId.fullName || "Supplier Staff";
    }

    return "Supplier Staff";
  };

  // ==========================================
  // PICKUP LOCATION
  // ==========================================

  const getPickupLocation = (order) => {
    return order?.pickupLocation || "Location not specified";
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "--";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (timeValue) => {
    if (!timeValue) {
      return "--";
    }

    return String(timeValue);
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#1E3A8A" />

          <Text
            style={{
              marginTop: 12,
              fontSize: 14,
              color: "#666",
            }}
          >
            Loading supplier dashboard...
          </Text>
        </View>
      </View>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <View style={styles.container}>
      {/* ==========================================
          HEADER
      ========================================== */}

      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>Local Grocery</Text>

          <Text style={styles.headerSubtitle}>Supplier Dashboard</Text>
        </View>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={handleProfile}
          activeOpacity={0.8}
        >
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* ==========================================
          SCROLLABLE HOME CONTENT
      ========================================== */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* ========================================
            WELCOME
        ======================================== */}

        <View style={styles.welcomeSection}>
          <Text style={styles.title}>Welcome back 👋</Text>

          <Text style={styles.description}>
            Here is today's supplier activity.
          </Text>
        </View>

        {/* ========================================
            LATEST SUPPLY ORDER
        ======================================== */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest Supply Order</Text>

          {latestOrder ? (
            <View style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityIconText}>📦</Text>
              </View>

              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  {latestOrder.productName || "Supply Order"}
                </Text>

                <Text style={styles.activityText}>
                  {getStaffName(latestOrder)} requested{" "}
                  {latestOrder.quantity || 0} {latestOrder.unit || ""}
                </Text>

                <View style={styles.activityDetails}>
                  <Text style={styles.activityDetail}>
                    📅 {formatDate(latestOrder.pickupDate)}
                  </Text>

                  <Text style={styles.activityDetail}>
                    🕒 {formatTime(latestOrder.pickupTime)}
                  </Text>

                  <Text style={styles.activityDetail}>
                    📍 {getPickupLocation(latestOrder)}
                  </Text>
                </View>

                <View
                  style={{
                    marginTop: 10,
                    alignSelf: "flex-start",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    backgroundColor:
                      latestOrder.status === "completed"
                        ? "#DCFCE7"
                        : latestOrder.status === "accepted"
                          ? "#DBEAFE"
                          : latestOrder.status === "rejected"
                            ? "#FEE2E2"
                            : "#FEF3C7",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "700",
                      color:
                        latestOrder.status === "completed"
                          ? "#166534"
                          : latestOrder.status === "accepted"
                            ? "#1D4ED8"
                            : latestOrder.status === "rejected"
                              ? "#B91C1C"
                              : "#92400E",
                    }}
                  >
                    {getOrderStatusText(latestOrder.status)}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityIconText}>📦</Text>
              </View>

              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>No Supply Orders</Text>

                <Text style={styles.activityText}>
                  There are currently no supply orders for your business.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* ========================================
            FULFILLMENT METRICS
        ======================================== */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fulfillment Metrics</Text>

          <View style={styles.metricsGrid}>
            {/* TOTAL PRODUCTS */}

            <View style={styles.metricCard}>
              <View style={styles.metricIcon}>
                <Text>📦</Text>
              </View>

              <Text style={styles.metricNumber}>{totalProducts}</Text>

              <Text style={styles.metricLabel}>Total Products</Text>
            </View>

            {/* ACTIVE PRODUCTS */}

            <View style={styles.metricCard}>
              <View style={styles.metricIcon}>
                <Text>✅</Text>
              </View>

              <Text style={styles.metricNumber}>{activeProducts}</Text>

              <Text style={styles.metricLabel}>Active Products</Text>
            </View>

            {/* OUT OF STOCK */}

            <View style={styles.metricCard}>
              <View style={styles.metricIcon}>
                <Text>⚠️</Text>
              </View>

              <Text style={styles.metricNumber}>{outOfStockProducts}</Text>

              <Text style={styles.metricLabel}>Out of Stock</Text>
            </View>

            {/* TOTAL ORDERS */}

            <View style={styles.metricCard}>
              <View style={styles.metricIcon}>
                <Text>🛒</Text>
              </View>

              <Text style={styles.metricNumber}>{totalOrders}</Text>

              <Text style={styles.metricLabel}>Total Supply Orders</Text>
            </View>
          </View>
        </View>

        {/* ========================================
            SUPPLY ORDERS
        ======================================== */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Supply Orders</Text>

            <TouchableOpacity onPress={handleOrders}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {latestOrder ? (
            <View style={styles.orderCard}>
              <View style={styles.orderTop}>
                <View>
                  <Text style={styles.orderId}>
                    {latestOrder.productName || "Supply Order"}
                  </Text>

                  <Text style={styles.orderCustomer}>
                    {getStaffName(latestOrder)}
                  </Text>
                </View>

                <View
                  style={
                    latestOrder.status === "completed"
                      ? styles.completedBadge
                      : styles.pendingBadge
                  }
                >
                  <Text
                    style={
                      latestOrder.status === "completed"
                        ? styles.completedBadgeText
                        : styles.pendingBadgeText
                    }
                  >
                    {getOrderStatusText(latestOrder.status)}
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: "#666",
                }}
              >
                Quantity: {latestOrder.quantity || 0} {latestOrder.unit || ""}
              </Text>

              <View style={styles.progressContainer}>
                <View style={styles.progressBackground}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: getProgressWidth(latestOrder.status),
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.progressLabels}>
                <Text
                  style={
                    latestOrder.status === "pending" ||
                    latestOrder.status === "accepted" ||
                    latestOrder.status === "completed"
                      ? styles.progressActive
                      : styles.progressLabel
                  }
                >
                  Pending
                </Text>

                <Text
                  style={
                    latestOrder.status === "accepted" ||
                    latestOrder.status === "completed"
                      ? styles.progressActive
                      : styles.progressLabel
                  }
                >
                  Accepted
                </Text>

                <Text
                  style={
                    latestOrder.status === "completed"
                      ? styles.progressActive
                      : styles.progressLabel
                  }
                >
                  Picked Up
                </Text>

                <Text
                  style={
                    latestOrder.status === "completed"
                      ? styles.progressActive
                      : styles.progressLabel
                  }
                >
                  Completed
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.orderCard}>
              <Text style={styles.orderId}>No supply orders</Text>

              <Text style={styles.orderCustomer}>
                New supplier staff orders will appear here.
              </Text>
            </View>
          )}
        </View>

        {/* ========================================
            ORDER SUMMARY
        ======================================== */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          <View style={styles.metricsGrid}>
            {/* PENDING */}

            <View style={styles.metricCard}>
              <View style={styles.metricIcon}>
                <Text>⏳</Text>
              </View>

              <Text style={styles.metricNumber}>{pendingOrders}</Text>

              <Text style={styles.metricLabel}>Pending Orders</Text>
            </View>

            {/* ACCEPTED */}

            <View style={styles.metricCard}>
              <View style={styles.metricIcon}>
                <Text>🚚</Text>
              </View>

              <Text style={styles.metricNumber}>{acceptedOrders}</Text>

              <Text style={styles.metricLabel}>Accepted Orders</Text>
            </View>

            {/* COMPLETED */}

            <View style={styles.metricCard}>
              <View style={styles.metricIcon}>
                <Text>🎉</Text>
              </View>

              <Text style={styles.metricNumber}>{completedOrders}</Text>

              <Text style={styles.metricLabel}>Completed Orders</Text>
            </View>
          </View>
        </View>

        {/* ========================================
            RECENT MESSAGES
        ======================================== */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Messages</Text>

            <TouchableOpacity onPress={handleMessages}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.messageCard}
            onPress={handleMessages}
            activeOpacity={0.8}
          >
            <View style={styles.messageAvatar}>
              <Text style={styles.messageAvatarText}>S</Text>
            </View>

            <View style={styles.messageContent}>
              <View style={styles.messageTop}>
                <Text style={styles.messageName}>Supplier Staff</Text>

                <Text style={styles.messageTime}>Messages</Text>
              </View>

              <Text style={styles.messageText} numberOfLines={1}>
                Open Messages to view your latest conversations.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            height: 100,
          }}
        />
      </ScrollView>

      {/* ==========================================
          BOTTOM NAVIGATION
      ========================================== */}

      <View style={styles.bottomNav}>
        {/* HOME */}

        <TouchableOpacity style={styles.navItem} onPress={handleHome}>
          <Text style={styles.navIcon}>🏠</Text>

          <Text style={styles.navLabelActive}>Home</Text>
        </TouchableOpacity>

        {/* PRODUCTS */}

        <TouchableOpacity style={styles.navItem} onPress={handleProducts}>
          <Text style={styles.navIcon}>📦</Text>

          <Text style={styles.navLabel}>Products</Text>
        </TouchableOpacity>

        {/* ORDERS */}

        <TouchableOpacity style={styles.navItem} onPress={handleOrders}>
          <Text style={styles.navIcon}>🛒</Text>

          <Text style={styles.navLabel}>Orders</Text>
        </TouchableOpacity>

        {/* MESSAGES */}

        <TouchableOpacity style={styles.navItem} onPress={handleMessages}>
          <Text style={styles.navIcon}>💬</Text>

          <Text style={styles.navLabel}>Messages</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
