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

import { router, useFocusEffect } from "expo-router";

import { API_URL } from "../../constants/api";
import styles from "./CustomerStaffDashboard.styles";

export default function CustomerStaffOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");

  const fetchOrders = async () => {
    try {
      const query = filter !== "all" ? `?status=${filter}` : "";
      const response = await fetch(`${API_URL}/api/customer-orders${query}`);
      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        Alert.alert("Error", data.message || "Could not load orders.");
      }
    } catch (error) {
      console.log("Fetch all orders error:", error);
      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchOrders();
    }, [filter]),
  );

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "New Order";
      case "accepted":
        return "Accepted";
      case "preparing":
        return "Preparing";
      case "ready":
        return "Ready for Delivery";
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

  const filters = [
    { key: "all", label: "All" },
    { key: "pending", label: "New" },
    { key: "accepted", label: "Accepted" },
    { key: "preparing", label: "Preparing" },
    { key: "ready", label: "Ready" },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>All Orders</Text>
          <Text style={styles.headerSubtitle}>
            Track every customer order status
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 12 }}
          >
            {filters.map((item) => (
              <TouchableOpacity
                key={item.key}
                onPress={() => setFilter(item.key)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 20,
                  marginRight: 8,
                  backgroundColor:
                    filter === item.key ? "#2E7D32" : "#E8F5E9",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: filter === item.key ? "#FFFFFF" : "#2E7D32",
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchOrders();
              }}
              colors={["#2E7D32"]}
            />
          }
        >
          {orders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>No Orders</Text>
              <Text style={styles.emptyText}>
                Orders matching this filter will appear here.
              </Text>
            </View>
          ) : (
            orders.map((order) => (
              <TouchableOpacity
                key={order._id}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() =>
                  router.push({
                    pathname: "/customer-staff-order-details",
                    params: { orderId: order._id },
                  })
                }
              >
                <View style={styles.cardTop}>
                  <View style={styles.productThumb}>
                    <Text style={styles.productThumbIcon}>🛒</Text>
                  </View>

                  <View style={styles.cardInfo}>
                    <Text style={styles.orderId}>
                      Order ID: #{order.orderNumber}
                    </Text>
                    <Text style={styles.customerName}>
                      {order.customerName}
                    </Text>
                    <Text style={styles.dateText}>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : ""}
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

                <View style={styles.cardMeta}>
                  <Text style={styles.metaText}>
                    {(order.items || []).length} Items
                  </Text>
                  <Text style={styles.totalText}>
                    Rs. {Number(order.totalAmount).toFixed(2)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.replace("/customer-staff-dashboard")}
          >
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.replace("/customer-staff-inventory")}
          >
            <Text style={styles.navIcon}>📦</Text>
            <Text style={styles.navLabel}>Inventory</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>📋</Text>
            <Text style={styles.navLabelActive}>Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/customer-staff-profile")}
          >
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navLabel}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
