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

import styles from "./SupplierStaffPickupOrders.styles";

export default function SupplierStaffPickupOrders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  // --------------------------------
  // LOAD PICKUP ORDERS
  // --------------------------------

  const fetchPickupOrders = async () => {
    try {
      const staffData = await AsyncStorage.getItem("supplierStaff");

      if (!staffData) {
        setOrders([]);
        return;
      }

      const supplierStaff = JSON.parse(staffData);

      if (!supplierStaff.id) {
        setOrders([]);
        return;
      }

      const response = await fetch(
        `${API_URL}/api/supply-orders/staff/${supplierStaff.id}`,
      );

      const data = await response.json();

      if (response.ok) {
        // Show both accepted and ready-for-pickup orders
        const pickupOrders = (data.orders || []).filter(
          (order) =>
            order.status === "accepted" || order.status === "ready_for_pickup",
        );

        setOrders(pickupOrders);
      } else {
        console.log("Load pickup orders error:", data.message);
      }
    } catch (error) {
      console.log("Fetch pickup orders error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPickupOrders();
    }, []),
  );

  // --------------------------------
  // REFRESH
  // --------------------------------

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPickupOrders();
  };

  // --------------------------------
  // CONFIRM PICKUP
  // --------------------------------

  const handleConfirmPickup = (order) => {
    Alert.alert(
      "Confirm Pickup",
      "Have you successfully picked up this order from the supplier?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm Pickup",
          onPress: async () => {
            try {
              const response = await fetch(
                `${API_URL}/api/supply-orders/${order._id}/status`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    status: "completed",
                  }),
                },
              );

              const data = await response.json();

              if (response.ok) {
                // Remove completed order from pickup list
                setOrders((currentOrders) =>
                  currentOrders.filter((item) => item._id !== order._id),
                );

                Alert.alert(
                  "Pickup Confirmed",
                  "The order has been marked as completed.",
                );
              } else {
                Alert.alert(
                  "Error",
                  data.message || "Unable to confirm pickup.",
                );
              }
            } catch (error) {
              console.log("Confirm pickup error:", error);

              Alert.alert(
                "Error",
                "Something went wrong while confirming the pickup.",
              );
            }
          },
        },
      ],
    );
  };

  // --------------------------------
  // FORMAT DATE
  // --------------------------------

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not specified";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleDateString();
  };

  // --------------------------------
  // FORMAT TIME
  // --------------------------------

  const formatTime = (timeValue) => {
    if (!timeValue) {
      return "Not specified";
    }

    return timeValue;
  };

  // --------------------------------
  // STATUS TEXT
  // --------------------------------

  const getStatusText = (status) => {
    if (status === "ready_for_pickup") {
      return "Ready for Pickup";
    }

    return "Accepted";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* --------------------------------
            HEADER
        -------------------------------- */}

        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Pickup Orders</Text>

            <Text style={styles.headerSubtitle}>
              Orders ready for supplier pickup
            </Text>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/supplier-staff-profile")}
            activeOpacity={0.8}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* --------------------------------
            ORDER COUNT
        -------------------------------- */}

        <View style={styles.countCard}>
          <View style={styles.countIconBox}>
            <Text style={styles.countIcon}>🚚</Text>
          </View>

          <View style={styles.countContent}>
            <Text style={styles.countNumber}>{orders.length}</Text>

            <Text style={styles.countText}>Orders waiting for pickup</Text>
          </View>
        </View>

        {/* --------------------------------
            CONTENT
        -------------------------------- */}

        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#1E3A8A" />

            <Text style={styles.loadingText}>Loading pickup orders...</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          >
            {/* --------------------------------
                EMPTY
            -------------------------------- */}

            {orders.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🚚</Text>

                <Text style={styles.emptyTitle}>No Pickup Orders</Text>

                <Text style={styles.emptyText}>
                  There are no accepted or ready-for-pickup orders right now.
                </Text>

                <TouchableOpacity
                  style={styles.ordersButton}
                  onPress={() => router.push("/supplier-staff-supply-orders")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.ordersButtonText}>
                    View Supply Orders
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              orders.map((order) => (
                <View key={order._id} style={styles.orderCard}>
                  {/* --------------------------------
                      PRODUCT HEADER
                  -------------------------------- */}

                  <View style={styles.topRow}>
                    <View style={styles.productIconContainer}>
                      <Text style={styles.productIcon}>📦</Text>
                    </View>

                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={1}>
                        {order.productName}
                      </Text>

                      <Text style={styles.supplierName}>
                        {order.supplierId?.businessName ||
                          order.supplierId?.fullName ||
                          "Supplier"}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.acceptedBadge,
                        order.status === "ready_for_pickup" &&
                          styles.readyBadge,
                      ]}
                    >
                      <Text style={styles.acceptedBadgeText}>
                        {getStatusText(order.status)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  {/* --------------------------------
                      ORDER DETAILS
                  -------------------------------- */}

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Quantity</Text>

                    <Text style={styles.detailValue}>
                      {order.quantity} {order.unit}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Price per unit</Text>

                    <Text style={styles.detailValue}>
                      Rs. {Number(order.pricePerUnit).toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Total</Text>

                    <Text style={styles.totalValue}>
                      Rs. {Number(order.totalPrice).toFixed(2)}
                    </Text>
                  </View>

                  {/* --------------------------------
                      PICKUP INFORMATION
                  -------------------------------- */}

                  <View style={styles.pickupBox}>
                    <View style={styles.pickupHeader}>
                      <Text style={styles.pickupHeaderIcon}>🚚</Text>

                      <View style={styles.pickupHeaderContent}>
                        <Text style={styles.pickupBoxTitle}>
                          Pickup Details
                        </Text>

                        <Text style={styles.pickupBoxSubtitle}>
                          Information for collecting this order
                        </Text>
                      </View>
                    </View>

                    {/* LOCATION */}

                    <View style={styles.pickupInfoRow}>
                      <View style={styles.pickupIconBox}>
                        <Text style={styles.pickupInfoIcon}>📍</Text>
                      </View>

                      <View style={styles.pickupInfoContent}>
                        <Text style={styles.pickupInfoLabel}>
                          Supplier Location
                        </Text>

                        <Text style={styles.pickupInfoValue}>
                          {order.pickupLocation ||
                            order.supplierId?.address ||
                            "Location not specified"}
                        </Text>
                      </View>
                    </View>

                    {/* DATE */}

                    <View style={styles.pickupInfoRow}>
                      <View style={styles.pickupIconBox}>
                        <Text style={styles.pickupInfoIcon}>📅</Text>
                      </View>

                      <View style={styles.pickupInfoContent}>
                        <Text style={styles.pickupInfoLabel}>Pickup Date</Text>

                        <Text style={styles.pickupInfoValue}>
                          {formatDate(order.pickupDate)}
                        </Text>
                      </View>
                    </View>

                    {/* TIME */}

                    <View style={styles.pickupInfoRow}>
                      <View style={styles.pickupIconBox}>
                        <Text style={styles.pickupInfoIcon}>⏰</Text>
                      </View>

                      <View style={styles.pickupInfoContent}>
                        <Text style={styles.pickupInfoLabel}>Pickup Time</Text>

                        <Text style={styles.pickupInfoValue}>
                          {formatTime(order.pickupTime)}
                        </Text>
                      </View>
                    </View>

                    {/* NOTE */}

                    {order.note ? (
                      <View style={styles.noteContainer}>
                        <Text style={styles.noteIcon}>📝</Text>

                        <View style={styles.noteContent}>
                          <Text style={styles.pickupInfoLabel}>
                            Pickup Note
                          </Text>

                          <Text style={styles.noteText}>{order.note}</Text>
                        </View>
                      </View>
                    ) : null}
                  </View>

                  {/* --------------------------------
                      ACTION
                  -------------------------------- */}

                  {order.status === "accepted" ? (
                    <View style={styles.waitingBox}>
                      <Text style={styles.waitingIcon}>⏳</Text>

                      <View style={styles.waitingContent}>
                        <Text style={styles.waitingTitle}>
                          Waiting for Supplier
                        </Text>

                        <Text style={styles.waitingText}>
                          The supplier is preparing this order.
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.completeButton}
                      onPress={() => handleConfirmPickup(order)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.completeButtonText}>
                        ✓ Confirm Pickup
                      </Text>
                    </TouchableOpacity>
                  )}

                  <Text style={styles.orderDate}>
                    Order created: {formatDate(order.createdAt)}
                  </Text>
                </View>
              ))
            )}

            <View style={styles.bottomSpace} />
          </ScrollView>
        )}

        {/* --------------------------------
            BOTTOM NAVIGATION
        -------------------------------- */}

        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.replace("/supplier-staff-dashboard")}
          >
            <Text style={styles.navIcon}>🏠</Text>

            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/supplier-staff-supply-orders")}
          >
            <Text style={styles.navIcon}>📦</Text>

            <Text style={styles.navLabel}>Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIconActive}>🚚</Text>

            <Text style={styles.navLabelActive}>Pickup</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/supplier-staff-suppliers")}
          >
            <Text style={styles.navIcon}>🏪</Text>

            <Text style={styles.navLabel}>Suppliers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/supplier-staff-messages")}
          >
            <Text style={styles.navIcon}>💬</Text>

            <Text style={styles.navLabel}>Messages</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
