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
import styles from "./CustomerStaffSupplyOrders.styles";

export default function CustomerStaffSupplyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [receivingId, setReceivingId] = useState(null);

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith("file://")) return null;
    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:")
    ) {
      return image;
    }
    return `${API_URL}${image.startsWith("/") ? image : `/${image}`}`;
  };

  const formatDate = (value) => {
    if (!value) return "Not specified";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/customer-staff/supply-orders/completed`,
      );
      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        Alert.alert("Error", data.message || "Could not load supply orders.");
      }
    } catch (error) {
      console.log("Fetch completed supply orders error:", error);
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

  const confirmReceipt = (order) => {
    Alert.alert(
      "Confirm Receipt",
      `Add ${order.quantity} ${order.unit} of ${order.productName} to store inventory?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => receiveOrder(order),
        },
      ],
    );
  };

  const receiveOrder = async (order) => {
    try {
      setReceivingId(order._id);
      const staffData = await AsyncStorage.getItem("customerStaff");
      const staff = staffData ? JSON.parse(staffData) : null;

      const response = await fetch(
        `${API_URL}/api/customer-staff/supply-orders/${order._id}/receive`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerStaffId: staff?.id || staff?._id || "",
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setOrders((current) =>
          current.map((item) =>
            item._id === order._id ? { ...item, ...data.order } : item,
          ),
        );
        Alert.alert("Inventory Updated", data.message);
      } else {
        Alert.alert("Unable to Confirm", data.message || "Could not confirm receipt.");
      }
    } catch (error) {
      console.log("Confirm supply receipt error:", error);
      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setReceivingId(null);
    }
  };

  const pendingCount = orders.filter((order) => !order.storeReceived).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Supply Receipts</Text>
          <Text style={styles.headerSubtitle}>
            Completed supplier orders ready for store inventory
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{orders.length}</Text>
            <Text style={styles.summaryLabel}>Completed</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{pendingCount}</Text>
            <Text style={styles.summaryLabel}>To receive</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#15803D" />
            <Text style={styles.loadingText}>Loading completed orders...</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  fetchOrders();
                }}
              />
            }
          >
            {orders.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📥</Text>
                <Text style={styles.emptyTitle}>No Completed Supply Orders</Text>
                <Text style={styles.emptyText}>
                  Completed orders from supplier staff will appear here for
                  store receipt.
                </Text>
              </View>
            ) : (
              orders.map((order) => {
                const imageUrl = getImageUrl(order.productImage);
                const received = Boolean(order.storeReceived);
                const busy = receivingId === order._id;

                return (
                  <View key={order._id} style={styles.orderCard}>
                    <View style={styles.topRow}>
                      {imageUrl ? (
                        <Image
                          source={{ uri: imageUrl }}
                          style={styles.productImage}
                        />
                      ) : (
                        <View style={styles.productIconBox}>
                          <Text style={styles.productIcon}>📦</Text>
                        </View>
                      )}

                      <View style={styles.productInfo}>
                        <Text style={styles.productName} numberOfLines={1}>
                          {order.productName}
                        </Text>
                        <Text style={styles.supplierName} numberOfLines={1}>
                          {order.supplierId?.businessName ||
                            order.supplierId?.fullName ||
                            "Supplier"}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.statusBadge,
                          received ? styles.receivedBadge : styles.waitingBadge,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            received
                              ? styles.receivedBadgeText
                              : styles.waitingBadgeText,
                          ]}
                        >
                          {received ? "Received" : "Awaiting"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Quantity</Text>
                      <Text style={styles.detailValue}>
                        {order.quantity} {order.unit}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Pickup date</Text>
                      <Text style={styles.detailValue}>
                        {formatDate(order.pickupDate)}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Pickup time</Text>
                      <Text style={styles.detailValue}>
                        {order.pickupTime || "Not specified"}
                      </Text>
                    </View>

                    {received ? (
                      <View style={styles.receivedBox}>
                        <Text style={styles.receivedBoxText}>
                          Added to store inventory
                          {order.storeReceivedAt
                            ? ` · ${formatDate(order.storeReceivedAt)}`
                            : ""}
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={[
                          styles.confirmButton,
                          busy && styles.confirmButtonDisabled,
                        ]}
                        onPress={() => confirmReceipt(order)}
                        disabled={busy}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.confirmButtonText}>
                          {busy ? "Updating inventory..." : "Confirm Receipt"}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })
            )}
          </ScrollView>
        )}

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
            <Text style={styles.navIcon}>📥</Text>
            <Text style={styles.navLabelActive}>Supply</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/customer-staff-messages")}
          >
            <Text style={styles.navIcon}>💬</Text>
            <Text style={styles.navLabel}>Messages</Text>
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
