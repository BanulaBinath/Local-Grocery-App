import { useCallback, useState } from "react";

import {
    ActivityIndicator,
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

import styles from "./SupplierStaffCompletedHistory.styles";

export default function SupplierStaffCompletedHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCompletedOrders = async () => {
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
        const completedOrders = (data.orders || []).filter(
          (order) => order.status === "completed",
        );

        setOrders(completedOrders);
      } else {
        console.log("Load completed orders error:", data.message);
      }
    } catch (error) {
      console.log("Fetch completed orders error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCompletedOrders();
    }, []),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCompletedOrders();
  };

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

  const formatDateTime = (dateValue) => {
    if (!dateValue) {
      return "Not specified";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }

    return date.toLocaleString();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Completed History</Text>

            <Text style={styles.headerSubtitle}>
              View your completed pickup orders
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

        {/* SUMMARY */}

        <View style={styles.summaryCard}>
          <View style={styles.summaryIconBox}>
            <Text style={styles.summaryIcon}>✅</Text>
          </View>

          <View style={styles.summaryContent}>
            <Text style={styles.summaryNumber}>{orders.length}</Text>

            <Text style={styles.summaryText}>Completed pickup orders</Text>
          </View>
        </View>

        {/* CONTENT */}

        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#1E3A8A" />

            <Text style={styles.loadingText}>Loading completed history...</Text>
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
            {orders.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📋</Text>

                <Text style={styles.emptyTitle}>No Completed Orders</Text>

                <Text style={styles.emptyText}>
                  Your completed pickup orders will appear here.
                </Text>

                <TouchableOpacity
                  style={styles.pickupButton}
                  onPress={() => router.push("/supplier-staff-pickup-orders")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.pickupButtonText}>
                    View Pickup Orders
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              orders.map((order) => (
                <View key={order._id} style={styles.orderCard}>
                  {/* ORDER HEADER */}

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

                    <View style={styles.completedBadge}>
                      <Text style={styles.completedBadgeText}>✓ Completed</Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  {/* ORDER DETAILS */}

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

                  {/* PICKUP DETAILS */}

                  <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>Pickup Details</Text>

                    <View style={styles.infoRow}>
                      <Text style={styles.infoIcon}>📍</Text>

                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Location</Text>

                        <Text style={styles.infoValue}>
                          {order.pickupLocation ||
                            order.supplierId?.address ||
                            "Location not specified"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.infoRow}>
                      <Text style={styles.infoIcon}>📅</Text>

                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Pickup Date</Text>

                        <Text style={styles.infoValue}>
                          {formatDate(order.pickupDate)}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.infoRow}>
                      <Text style={styles.infoIcon}>⏰</Text>

                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Pickup Time</Text>

                        <Text style={styles.infoValue}>
                          {order.pickupTime || "Not specified"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* COMPLETED DATE */}

                  <View style={styles.completedDateBox}>
                    <Text style={styles.completedDateLabel}>Completed</Text>

                    <Text style={styles.completedDateValue}>
                      {formatDateTime(
                        order.updatedAt || order.completedAt || order.createdAt,
                      )}
                    </Text>
                  </View>
                </View>
              ))
            )}

            <View style={styles.bottomSpace} />
          </ScrollView>
        )}

        {/* BOTTOM NAV */}

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

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/supplier-staff-pickup-orders")}
          >
            <Text style={styles.navIcon}>🚚</Text>

            <Text style={styles.navLabel}>Pickup</Text>
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
