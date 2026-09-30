import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { router, useFocusEffect } from "expo-router";

import { API_URL } from "../../constants/api";

import styles from "./SupplierStaffDashboard.styles";

export default function SupplierStaffDashboard() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  // ==================================================
  // NAVIGATION
  // ==================================================

  const handleSuppliers = () => {
    router.push("/supplier-staff-suppliers");
  };

  const handleSupplyOrders = () => {
    router.push("/supplier-staff-supply-orders");
  };

  const handlePickupOrders = () => {
    router.push("/supplier-staff-pickup-orders");
  };

  const handleCompletedHistory = () => {
    router.push("/supplier-staff-completed-history");
  };

  const handleMessages = () => {
    router.push("/supplier-staff-messages");
  };

  const handleProfile = () => {
    router.push("/supplier-staff-profile");
  };

  // ==================================================
  // LOAD SUPPLY ORDERS
  // ==================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);

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
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } else {
        console.log("Dashboard orders error:", data.message);

        Alert.alert("Error", data.message || "Could not load supply orders.");
      }
    } catch (error) {
      console.log("Dashboard fetch orders error:", error);

      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // REFRESH WHEN DASHBOARD OPENS
  // ==================================================

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, []),
  );

  // ==================================================
  // ORDER COUNTS
  // ==================================================

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending",
  ).length;

  const pickupOrders = orders.filter(
    (order) => order.status === "accepted",
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "completed",
  ).length;

  // ==================================================
  // CURRENT PICKUP
  // ==================================================

  const currentPickups = orders
    .filter((order) => order.status === "accepted")
    .sort((a, b) => new Date(a.pickupDate || 0) - new Date(b.pickupDate || 0));

  const currentPickup = currentPickups.length > 0 ? currentPickups[0] : null;

  // ==================================================
  // PICKUP DATE
  // ==================================================

  const formatPickupDate = (date) => {
    if (!date) {
      return "--";
    }

    const dateString = String(date);

    // Already formatted as YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split("-");

      return `${day}/${month}/${year}`;
    }

    const parsedDate = new Date(dateString);

    if (Number.isNaN(parsedDate.getTime())) {
      return dateString;
    }

    return parsedDate.toLocaleDateString();
  };

  // ==================================================
  // PICKUP TIME
  // ==================================================

  const formatPickupTime = (time) => {
    if (!time) {
      return "--";
    }

    return String(time);
  };

  // ==================================================
  // PICKUP SUPPLIER NAME
  // ==================================================

  const getSupplierName = (order) => {
    if (!order) {
      return "No active pickup";
    }

    if (order.supplierId?.businessName) {
      return order.supplierId.businessName;
    }

    if (order.supplierId?.fullName) {
      return order.supplierId.fullName;
    }

    if (order.supplierName) {
      return order.supplierName;
    }

    return "Supplier";
  };

  // ==================================================
  // PICKUP LOCATION
  // ==================================================

  const getPickupLocation = (order) => {
    if (!order) {
      return "No location";
    }

    if (order.pickupLocation) {
      return order.pickupLocation;
    }

    if (order.supplierId?.address) {
      return order.supplierId.address;
    }

    return "No location";
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.logo}>Local Grocery</Text>

            <Text style={styles.headerSubtitle}>Supplier Staff</Text>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleProfile}
            activeOpacity={0.8}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* WELCOME */}

          <View style={styles.welcomeSection}>
            <Text style={styles.title}>Welcome, Staff 👋</Text>

            <Text style={styles.description}>
              Manage supplier orders, pickups and completed orders from one
              place.
            </Text>
          </View>

          {/* CURRENT PICKUP */}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Current Pickup</Text>
          </View>

          <View style={styles.pickupCard}>
            {loading ? (
              <View
                style={{
                  paddingVertical: 25,
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="small" color="#1E3A8A" />

                <Text
                  style={{
                    marginTop: 8,
                    color: "#6B7280",
                  }}
                >
                  Loading pickup...
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.pickupTopRow}>
                  <View style={styles.pickupIconBox}>
                    <Text style={styles.pickupIcon}>📍</Text>
                  </View>

                  <View style={styles.pickupInfo}>
                    <Text style={styles.pickupTitle}>Upcoming Pickup</Text>

                    <Text style={styles.pickupSupplier} numberOfLines={1}>
                      {currentPickup
                        ? getSupplierName(currentPickup)
                        : "No active pickup"}
                    </Text>
                  </View>

                  <View style={styles.timeBadge}>
                    <Text style={styles.timeBadgeText}>
                      {currentPickup
                        ? formatPickupTime(currentPickup.pickupTime)
                        : "--"}
                    </Text>
                  </View>
                </View>

                <View style={styles.pickupDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Location</Text>

                    <Text style={styles.detailValue} numberOfLines={1}>
                      {getPickupLocation(currentPickup)}
                    </Text>
                  </View>

                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Pickup Time</Text>

                    <Text style={styles.detailValue}>
                      {currentPickup
                        ? formatPickupTime(currentPickup.pickupTime)
                        : "--"}
                    </Text>
                  </View>
                </View>

                {currentPickup && currentPickup.pickupDate && (
                  <View
                    style={{
                      marginTop: 10,
                    }}
                  >
                    <Text style={styles.detailLabel}>Pickup Date</Text>

                    <Text style={styles.detailValue}>
                      {formatPickupDate(currentPickup.pickupDate)}
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.viewPickupButton}
                  onPress={handlePickupOrders}
                  activeOpacity={0.8}
                >
                  <Text style={styles.viewPickupButtonText}>
                    View Pickup Orders
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* FULFILLMENT METRICS */}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fulfillment Metrics</Text>
          </View>

          <View style={styles.metricsGrid}>
            {/* TOTAL */}

            <View style={styles.metricCard}>
              <View style={styles.metricIconBox}>
                <Text style={styles.metricIcon}>📦</Text>
              </View>

              <Text style={styles.metricNumber}>{totalOrders}</Text>

              <Text style={styles.metricLabel}>Total Pickup Orders</Text>
            </View>

            {/* PENDING */}

            <View style={styles.metricCard}>
              <View style={styles.metricIconBox}>
                <Text style={styles.metricIcon}>⏳</Text>
              </View>

              <Text style={styles.metricNumber}>{pendingOrders}</Text>

              <Text style={styles.metricLabel}>Pending Orders</Text>
            </View>

            {/* PICKUP */}

            <View style={styles.metricCard}>
              <View style={styles.metricIconBox}>
                <Text style={styles.metricIcon}>🚚</Text>
              </View>

              <Text style={styles.metricNumber}>{pickupOrders}</Text>

              <Text style={styles.metricLabel}>Pickup Orders</Text>
            </View>

            {/* COMPLETED */}

            <View style={styles.metricCard}>
              <View style={styles.metricIconBox}>
                <Text style={styles.metricIcon}>✅</Text>
              </View>

              <Text style={styles.metricNumber}>{completedOrders}</Text>

              <Text style={styles.metricLabel}>Completed Orders</Text>
            </View>
          </View>

          {/* QUICK ACTIONS */}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleSupplyOrders}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconBox}>
              <Text style={styles.actionIcon}>📦</Text>
            </View>

            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Supply Orders</Text>

              <Text style={styles.actionDescription}>
                View pending and rejected supply orders.
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={handlePickupOrders}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconBox}>
              <Text style={styles.actionIcon}>🚚</Text>
            </View>

            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Pickup Orders</Text>

              <Text style={styles.actionDescription}>
                View accepted orders ready for pickup.
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleCompletedHistory}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconBox}>
              <Text style={styles.actionIcon}>📋</Text>
            </View>

            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Completed History</Text>

              <Text style={styles.actionDescription}>
                View previously completed pickup orders.
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleSuppliers}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconBox}>
              <Text style={styles.actionIcon}>🏪</Text>
            </View>

            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Suppliers</Text>

              <Text style={styles.actionDescription}>
                Browse suppliers and create supply orders.
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={handleMessages}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconBox}>
              <Text style={styles.actionIcon}>💬</Text>
            </View>

            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Messages</Text>

              <Text style={styles.actionDescription}>
                Communicate with suppliers.
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          {/* PROFILE */}

          <TouchableOpacity
            style={styles.profileCard}
            onPress={handleProfile}
            activeOpacity={0.8}
          >
            <View style={styles.profileCardIconBox}>
              <Text style={styles.profileCardIcon}>👤</Text>
            </View>

            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>My Profile</Text>

              <Text style={styles.actionDescription}>
                View and manage your staff profile.
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.bottomSpace} />
        </ScrollView>

        {/* BOTTOM NAVIGATION */}

        <View style={styles.bottomNav}>
          {/* HOME */}

          <TouchableOpacity style={styles.navItem} activeOpacity={0.8}>
            <Text style={styles.navIconActive}>🏠</Text>

            <Text style={styles.navLabelActive}>Home</Text>
          </TouchableOpacity>

          {/* SUPPLY ORDERS */}

          <TouchableOpacity
            style={styles.navItem}
            onPress={handleSupplyOrders}
            activeOpacity={0.8}
          >
            <Text style={styles.navIcon}>📦</Text>

            <Text style={styles.navLabel}>Orders</Text>
          </TouchableOpacity>

          {/* PICKUP */}

          <TouchableOpacity
            style={styles.navItem}
            onPress={handlePickupOrders}
            activeOpacity={0.8}
          >
            <Text style={styles.navIcon}>🚚</Text>

            <Text style={styles.navLabel}>Pickup</Text>
          </TouchableOpacity>

          {/* SUPPLIERS */}

          <TouchableOpacity
            style={styles.navItem}
            onPress={handleSuppliers}
            activeOpacity={0.8}
          >
            <Text style={styles.navIcon}>🏪</Text>

            <Text style={styles.navLabel}>Suppliers</Text>
          </TouchableOpacity>

          {/* MESSAGES */}

          <TouchableOpacity
            style={styles.navItem}
            onPress={handleMessages}
            activeOpacity={0.8}
          >
            <Text style={styles.navIcon}>💬</Text>

            <Text style={styles.navLabel}>Messages</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
