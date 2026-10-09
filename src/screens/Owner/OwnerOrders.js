import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import { API_URL } from "../../constants/api";
import styles from "./OwnerOrders.styles";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "completed", label: "Completed" },
];

const getFilterKey = (status) => {
  if (status === "pending") {
    return "pending";
  }

  if (status === "accepted" || status === "ready_for_pickup") {
    return "processing";
  }

  if (status === "completed") {
    return "completed";
  }

  return "all";
};

const getStatusLabel = (status) => {
  if (status === "ready_for_pickup") {
    return "Ready for pickup";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
};

export default function OwnerOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadOrders = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setErrorMessage("");
      const response = await fetch(`${API_URL}/api/owners/orders`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load orders.");
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (error) {
      console.error("Load owner orders error:", error);
      setErrorMessage("Could not load orders. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    if (selectedFilter === "all") {
      return orders;
    }

    return orders.filter(
      (order) => getFilterKey(order.status) === selectedFilter,
    );
  }, [orders, selectedFilter]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadOrders(true)}
            tintColor="#1E3A8A"
          />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View>
            <Text style={styles.headerTitle}>All Orders</Text>
            <Text style={styles.headerSubtitle}>Monitor customer orders</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        >
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                selectedFilter === filter.key && styles.activeFilterButton,
              ]}
              onPress={() => setSelectedFilter(filter.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter.key && styles.activeFilterText,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading ? (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color="#1E3A8A"
          />
        ) : errorMessage ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => loadOrders()}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptyDescription}>
              There are no orders in the {selectedFilter} category.
            </Text>
          </View>
        ) : (
          <View style={styles.orderList}>
            {filteredOrders.map((order) => (
              <View key={order._id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>
                    Order #{order._id.slice(-6).toUpperCase()}
                  </Text>
                  <Text
                    style={[
                      styles.status,
                      styles[`status${getFilterKey(order.status)}`],
                    ]}
                  >
                    {getStatusLabel(order.status)}
                  </Text>
                </View>

                <Text style={styles.productName}>{order.productName}</Text>
                <Text style={styles.orderDetail}>
                  Quantity: {order.quantity} {order.unit}
                </Text>
                <Text style={styles.orderDetail}>
                  Supplier:{" "}
                  {order.supplierId?.businessName ||
                    order.supplierId?.fullName ||
                    "Unknown supplier"}
                </Text>
                <View style={styles.orderFooter}>
                  <Text style={styles.orderDate}>
                    {order.pickupDate} • {order.pickupTime}
                  </Text>
                  <Text style={styles.totalPrice}>
                    Rs. {Number(order.totalPrice || 0).toLocaleString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
