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
import styles from "./OrderHistory.styles";

const STEPS = ["Ordered", "Confirmed", "Preparing", "Ready"];

const statusToStepIndex = (status) => {
  switch (status) {
    case "pending":
      return 0;
    case "accepted":
      return 1;
    case "preparing":
      return 2;
    case "ready":
    case "completed":
      return 3;
    default:
      return 0;
  }
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [selectedTab, setSelectedTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "accepted":
        return "Confirmed";
      case "preparing":
        return "Preparing";
      case "ready":
        return "Ready for Pickup";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Rejected";
      default:
        return status;
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "pending":
        return { badge: styles.statusBadgePending, text: styles.statusTextPending };
      case "accepted":
        return { badge: styles.statusBadgeAccepted, text: styles.statusTextAccepted };
      case "preparing":
        return { badge: styles.statusBadgePreparing, text: styles.statusTextPreparing };
      case "ready":
        return { badge: styles.statusBadgeReady, text: styles.statusTextReady };
      case "completed":
        return { badge: styles.statusBadgeCompleted, text: styles.statusTextCompleted };
      case "cancelled":
        return { badge: styles.statusBadgeCancelled, text: styles.statusTextCancelled };
      default:
        return { badge: styles.statusBadgePending, text: styles.statusTextPending };
    }
  };

  const fetchOrders = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const customerData = await AsyncStorage.getItem("customer");

      if (!customerData) {
        setOrders([]);
        return;
      }

      const customer = JSON.parse(customerData);
      const customerId = customer._id || customer.id;

      const response = await fetch(
        `${API_URL}/api/customer-orders/customer/${customerId}`,
      );
      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        Alert.alert("Error", data.message || "Could not load orders.");
      }
    } catch (error) {
      console.log("Fetch customer order history error:", error);
      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, []),
  );

  // Filter orders by tab
  const filteredOrders = orders.filter((order) => {
    if (selectedTab === "all") return true;
    if (selectedTab === "pending") return order.status === "pending";
    if (selectedTab === "confirm") {
      return (
        order.status === "accepted" ||
        order.status === "preparing" ||
        order.status === "ready" ||
        order.status === "completed"
      );
    }
    if (selectedTab === "rejected") return order.status === "cancelled";
    return true;
  });

  // Tab counts
  const countAll = orders.length;
  const countPending = orders.filter((o) => o.status === "pending").length;
  const countConfirm = orders.filter(
    (o) =>
      o.status === "accepted" ||
      o.status === "preparing" ||
      o.status === "ready" ||
      o.status === "completed",
  ).length;
  const countRejected = orders.filter((o) => o.status === "cancelled").length;

  const tabs = [
    { key: "all", label: "All", count: countAll },
    { key: "pending", label: "Pending", count: countPending },
    { key: "confirm", label: "Confirm", count: countConfirm },
    { key: "rejected", label: "Rejected", count: countRejected },
  ];

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E3A8A" />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Orders</Text>
          <View style={styles.headerSpace} />
        </View>

        {/* 4 Tabs: All, Pending, Confirm, Rejected */}
        <View style={styles.filterContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {tabs.map((tab) => {
              const isActive = selectedTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.filterTab, isActive && styles.filterTabActive]}
                  onPress={() => setSelectedTab(tab.key)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      isActive && styles.filterTabTextActive,
                    ]}
                  >
                    {tab.label}
                  </Text>
                  <View
                    style={[
                      styles.filterBadge,
                      isActive && styles.filterBadgeActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterBadgeText,
                        isActive && styles.filterBadgeTextActive,
                      ]}
                    >
                      {tab.count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Orders List */}
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchOrders(false);
              }}
              colors={["#1E3A8A"]}
            />
          }
        >
          {filteredOrders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyTitle}>
                {selectedTab === "all"
                  ? "No Orders Yet"
                  : `No ${selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Orders`}
              </Text>
              <Text style={styles.emptyText}>
                {selectedTab === "pending"
                  ? "You have no orders currently pending staff confirmation."
                  : selectedTab === "confirm"
                  ? "You have no confirmed or active pickup orders right now."
                  : selectedTab === "rejected"
                  ? "No rejected orders. All orders are processed smoothly!"
                  : "Start shopping fresh local groceries to see your pre-orders here."}
              </Text>
            </View>
          ) : (
            filteredOrders.map((order) => {
              const currentStep = statusToStepIndex(order.status);
              const badgeStyle = getStatusBadgeStyle(order.status);
              const isRejected = order.status === "cancelled";

              return (
                <View key={order._id} style={styles.card}>
                  {/* Top Row: Order Number & Status */}
                  <View style={styles.topRow}>
                    <Text style={styles.orderId}>
                      Order #{order.orderNumber}
                    </Text>
                    <View style={[styles.statusBadge, badgeStyle.badge]}>
                      <Text style={[styles.statusText, badgeStyle.text]}>
                        {getStatusLabel(order.status)}
                      </Text>
                    </View>
                  </View>

                  {/* Date Created */}
                  <Text style={styles.dateText}>
                    🕒 Placed on{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Recently"}
                  </Text>

                  {/* Pickup Details Box */}
                  {(order.pickupDate || order.pickupTime || order.pickupLocation) && (
                    <View style={styles.pickupBox}>
                      <View style={styles.pickupRow}>
                        <Text style={styles.pickupText}>
                          📅 Scheduled: {order.pickupDate || "Standard"} {order.pickupTime ? `• ⏰ ${order.pickupTime}` : ""}
                        </Text>
                      </View>
                      {order.pickupLocation ? (
                        <View style={styles.pickupRow}>
                          <Text style={styles.pickupText}>
                            📍 Location: {order.pickupLocation}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  )}

                  {/* Rejection Note or Progress Stepper */}
                  {isRejected ? (
                    <View style={styles.rejectBox}>
                      <Text style={styles.rejectTitle}>
                        ⚠️ Order Rejected by Staff
                      </Text>
                      <Text style={styles.rejectReason}>
                        Reason: {order.cancelReason || "Store was unable to fulfill this order at this time."}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.stepperRow}>
                      {STEPS.map((label, index) => {
                        const done = index <= currentStep;
                        return (
                          <View key={label} style={styles.stepDot}>
                            <View
                              style={[
                                styles.stepCircle,
                                done && styles.stepCircleActive,
                              ]}
                            >
                              {done ? (
                                <Text style={styles.stepCheck}>✓</Text>
                              ) : null}
                            </View>
                            <Text
                              style={[
                                styles.stepLabel,
                                done && styles.stepLabelActive,
                              ]}
                            >
                              {label}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}

                  {/* Items List */}
                  <View style={styles.itemsSummaryBox}>
                    <Text style={styles.itemSummaryText}>
                      <Text style={{ fontWeight: "700" }}>Items: </Text>
                      {(order.items || [])
                        .map((it) => `${it.productName} (${it.quantity}x)`)
                        .join(", ")}
                    </Text>
                  </View>

                  {/* Meta & Total */}
                  <View style={styles.metaRow}>
                    <Text style={styles.metaText}>
                      {(order.items || []).length} item type(s)
                    </Text>
                    <Text style={styles.totalText}>
                      Rs. {Number(order.totalAmount).toFixed(2)}
                    </Text>
                  </View>

                  {/* Bottom Actions */}
                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity
                      style={styles.feedbackBtn}
                      onPress={() =>
                        router.push({
                          pathname: "/customer-feedbacks",
                          params: { orderNumber: String(order.orderNumber) },
                        })
                      }
                      activeOpacity={0.8}
                    >
                      <Text style={styles.feedbackBtnText}>⭐ Give Feedback</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
