import { useCallback, useState } from "react";

import {
  ActivityIndicator,
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
import styles from "./CustomerStaffDashboard.styles";

const staffBannerImage = require("../../../assets/images/staff_banner.png");

export default function CustomerStaffDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [staff, setStaff] = useState(null);

  const handleHome = () => {
    router.replace("/customer-staff-dashboard");
  };

  const handleInventory = () => {
    router.replace("/customer-staff-inventory");
  };

  const handleOrders = () => {
    router.replace("/customer-staff-orders");
  };

  const handleProfile = () => {
    router.push("/customer-staff-profile");
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith("file://")) return null;
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    return `${API_URL}${image.startsWith("/") ? image : `/${image}`}`;
  };

  const formatDate = (value) => {
    if (!value) return "Just now";
    const date = new Date(value);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "New Order";
      case "accepted":
        return "Accepted";
      case "preparing":
        return "Preparing";
      case "ready":
        return "Ready";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getBadgeStyle = (status) => {
    switch (status) {
      case "accepted":
        return styles.acceptedBadge;
      case "preparing":
        return styles.preparingBadge;
      case "ready":
        return styles.readyBadge;
      case "completed":
        return styles.completedBadge;
      case "cancelled":
        return styles.cancelledBadge;
      default:
        return styles.pendingBadge;
    }
  };

  const getBadgeTextStyle = (status) => {
    switch (status) {
      case "accepted":
        return styles.acceptedText;
      case "preparing":
        return styles.preparingText;
      case "ready":
        return styles.readyText;
      case "completed":
        return styles.completedText;
      case "cancelled":
        return styles.cancelledText;
      default:
        return styles.pendingText;
    }
  };

  const fetchOrders = async (isSilent = false) => {
    try {
      const staffData = await AsyncStorage.getItem("customerStaff");
      if (staffData) {
        setStaff(JSON.parse(staffData));
      }

      const response = await fetch(`${API_URL}/api/customer-orders`);
      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders || []);
      } else if (!isSilent) {
        console.log("Could not load orders.");
      }
    } catch (error) {
      if (!isSilent) {
        console.log("Fetch customer staff orders error:", error);
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
      fetchOrders();
      const interval = setInterval(() => {
        fetchOrders(true);
      }, 5000);

      return () => clearInterval(interval);
    }, []),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  // Derived counts for metric cards
  const newOrdersCount = orders.filter((o) => o.status === "pending").length;
  const acceptedCount = orders.filter((o) => o.status === "accepted").length;
  const preparingCount = orders.filter((o) => o.status === "preparing").length;
  const readyCount = orders.filter((o) => o.status === "ready").length;
  const completedCount = orders.filter((o) => o.status === "completed").length;

  // Recent Orders — display only new incoming orders (pending)
  const recentOrders = orders
    .filter((o) => o.status === "pending")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#15803D" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ── Banner Header ── */}
        <View style={styles.header}>
          <View style={styles.bannerContainer}>
            <Image
              source={staffBannerImage}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            <View style={styles.bannerOverlay} />
            <View style={styles.bannerContent}>
              <View style={styles.bannerTitleRow}>
                <View style={styles.staffBadge}>
                  <Text style={styles.staffBadgeText}>STAFF PORTAL</Text>
                </View>
                <Text style={styles.welcomeText}>
                  Hello, {staff?.name || "Staff Member"} 👋
                </Text>
                <Text style={styles.storeSubtext}>
                  Dashboard — Quick Overview
                </Text>
              </View>

              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Scrollable Body ── */}
        <ScrollView
          contentContainerStyle={styles.dashboardBody}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#15803D"]}
            />
          }
        >
          {/* ── Section: Metric Cards ── */}
          <Text style={styles.sectionTitle}>Active Orders</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.metricsRowScroll}
          >
            {/* New Orders */}
            <View style={[styles.metricCard, styles.metricCardNew]}>
              <Text style={styles.metricIcon}>🆕</Text>
              <Text style={[styles.metricValue, styles.metricValueNew]}>
                {newOrdersCount}
              </Text>
              <Text style={styles.metricLabel}>New Orders</Text>
            </View>

            {/* Accepted */}
            <View style={[styles.metricCard, styles.metricCardAccepted]}>
              <Text style={styles.metricIcon}>✅</Text>
              <Text style={[styles.metricValue, styles.metricValueAccepted]}>
                {acceptedCount}
              </Text>
              <Text style={styles.metricLabel}>Accepted</Text>
            </View>

            {/* Preparing */}
            <View style={[styles.metricCard, styles.metricCardPreparing]}>
              <Text style={styles.metricIcon}>🍳</Text>
              <Text style={[styles.metricValue, styles.metricValuePreparing]}>
                {preparingCount}
              </Text>
              <Text style={styles.metricLabel}>Preparing</Text>
            </View>

            {/* Ready */}
            <View style={[styles.metricCard, styles.metricCardReady]}>
              <Text style={styles.metricIcon}>📦</Text>
              <Text style={[styles.metricValue, styles.metricValueReady]}>
                {readyCount}
              </Text>
              <Text style={styles.metricLabel}>Ready</Text>
            </View>

            {/* Completed */}
            <View style={[styles.metricCard, styles.metricCardCompleted]}>
              <Text style={styles.metricIcon}>✨</Text>
              <Text style={[styles.metricValue, styles.metricValueCompleted]}>
                {completedCount}
              </Text>
              <Text style={styles.metricLabel}>Completed</Text>
            </View>
          </ScrollView>

          {/* ── Section: Recent Orders ── */}
          <View style={styles.recentHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Incoming Orders</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={handleOrders}
              activeOpacity={0.8}
            >
              <Text style={styles.viewAllText}>View All →</Text>
            </TouchableOpacity>
          </View>

          {recentOrders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🛍️</Text>
              <Text style={styles.emptyTitle}>No New Incoming Orders</Text>
              <Text style={styles.emptyText}>
                No new incoming orders at the moment. Check back soon.
              </Text>
            </View>
          ) : (
            recentOrders.map((order) => {
              const firstItem = order.items?.[0];
              const imageUrl = getImageUrl(firstItem?.productImage);
              const itemCount = order.items?.length || 0;
              const isPending = order.status === "pending";

              return (
                <TouchableOpacity
                  key={order._id}
                  style={[
                    styles.recentCard,
                    isPending && styles.cardPendingHighlight,
                  ]}
                  activeOpacity={0.88}
                  onPress={() =>
                    router.push({
                      pathname: "/customer-staff-order-details",
                      params: { orderId: order._id },
                    })
                  }
                >
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <View style={styles.orderNumberRow}>
                      <Text style={styles.orderNumber}>
                        Order #{order.orderNumber}
                      </Text>
                      <Text style={styles.timeText}>
                        • {formatDate(order.createdAt)}
                      </Text>
                    </View>
                    <View
                      style={[styles.statusBadge, getBadgeStyle(order.status)]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          getBadgeTextStyle(order.status),
                        ]}
                      >
                        {getStatusLabel(order.status)}
                      </Text>
                    </View>
                  </View>

                  {/* Card Body */}
                  <View style={styles.cardBody}>
                    <View style={styles.productThumb}>
                      {imageUrl ? (
                        <Image
                          source={{ uri: imageUrl }}
                          style={styles.productThumbImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <Text style={styles.productThumbIcon}>🥬</Text>
                      )}
                    </View>
                    <View style={styles.customerInfo}>
                      <Text style={styles.customerName}>
                        {order.customerName}
                      </Text>
                      {order.customerPhone ? (
                        <Text style={styles.customerPhone}>
                          📞 {order.customerPhone}
                        </Text>
                      ) : null}
                    </View>
                    <View style={styles.recentCardMeta}>
                      <Text style={styles.itemsCount}>
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                      </Text>
                      <Text style={styles.totalAmount}>
                        Rs. {Number(order.totalAmount).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}

          {/* ── "Go to Orders" banner at the bottom ── */}
          {recentOrders.length > 0 && (
            <TouchableOpacity
              style={styles.goToOrdersBanner}
              onPress={handleOrders}
              activeOpacity={0.85}
            >
              <Text style={styles.goToOrdersText}>
                📋 Manage All Orders & Status
              </Text>
              <Text style={styles.goToOrdersArrow}>→</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* ── Bottom Navigation ── */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={handleHome}>
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.navLabelActive}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={handleInventory}>
            <Text style={styles.navIcon}>📦</Text>
            <Text style={styles.navLabel}>Inventory</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/customer-staff-messages")}
          >
            <Text style={styles.navIcon}>💬</Text>
            <Text style={styles.navLabel}>Messages</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={handleProfile}>
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
