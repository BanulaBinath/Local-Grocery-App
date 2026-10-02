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

const STEPS = ["Ordered", "Accepted", "Preparing", "Ready"];

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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Ordered";
      case "accepted":
        return "Accepted";
      case "preparing":
        return "Preparing";
      case "ready":
        return "Ready for Pickup";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const fetchOrders = async () => {
    try {
      const customerData = await AsyncStorage.getItem("customer");

      if (!customerData) {
        setOrders([]);
        return;
      }

      const customer = JSON.parse(customerData);

      const response = await fetch(
        `${API_URL}/api/customer-orders/customer/${customer.id}`,
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
      setLoading(true);
      fetchOrders();
    }, []),
  );

  if (loading) {
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
              colors={["#1E3A8A"]}
            />
          }
        >
          {orders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyTitle}>No Orders Yet</Text>
              <Text style={styles.emptyText}>
                When you place an order, you can track its status here as staff
                updates it.
              </Text>
            </View>
          ) : (
            orders.map((order) => {
              const currentStep = statusToStepIndex(order.status);

              return (
                <View key={order._id} style={styles.card}>
                  <View style={styles.topRow}>
                    <Text style={styles.orderId}>
                      Order #{order.orderNumber}
                    </Text>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>
                        {getStatusLabel(order.status)}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.dateText}>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : ""}
                  </Text>

                  {order.status !== "cancelled" ? (
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
                  ) : (
                    <Text style={styles.cancelNote}>
                      Cancelled: {order.cancelReason || "No reason provided"}
                    </Text>
                  )}

                  <View style={styles.metaRow}>
                    <Text style={styles.metaText}>
                      {(order.items || []).length} Items
                    </Text>
                    <Text style={styles.totalText}>
                      Rs. {Number(order.totalAmount).toFixed(2)}
                    </Text>
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
