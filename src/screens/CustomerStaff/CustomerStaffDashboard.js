import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";

import { API_URL } from "../../constants/api";
import styles from "./CustomerStaffDashboard.styles";

const CANCEL_REASONS = [
  "Out of stock",
  "Delivery person unavailable",
  "Customer requested cancellation",
  "Unable to fulfill order",
];

export default function CustomerStaffDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [staffId, setStaffId] = useState(null);
  const [cancelVisible, setCancelVisible] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [selectedReason, setSelectedReason] = useState(CANCEL_REASONS[0]);

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
    if (!value) return "Unknown";

    const date = new Date(value);

    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
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

  const fetchOrders = async (searchTerm = search) => {
    try {
      const staffData = await AsyncStorage.getItem("customerStaff");

      if (staffData) {
        const staff = JSON.parse(staffData);
        setStaffId(staff.id);
      }

      const query = searchTerm
        ? `?search=${encodeURIComponent(searchTerm)}`
        : "";

      const response = await fetch(`${API_URL}/api/customer-orders${query}`);
      const data = await response.json();

      if (response.ok) {
        const incoming = (data.orders || []).filter((order) =>
          ["pending", "accepted", "preparing", "ready"].includes(order.status),
        );
        setOrders(incoming);
      } else {
        Alert.alert("Error", data.message || "Could not load orders.");
      }
    } catch (error) {
      console.log("Fetch customer staff orders error:", error);
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

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const updateStatus = async (orderId, status, cancelReason = "") => {
    try {
      const response = await fetch(
        `${API_URL}/api/customer-orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            staffId,
            cancelReason,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        const messages = {
          accepted: "Order accepted.",
          preparing: "Order set to Preparing.",
          ready: "Order marked as Ready.",
          completed: "Order completed.",
          cancelled: "Order cancelled.",
        };

        Alert.alert("Success", messages[status] || "Order updated.");
        fetchOrders();
      } else {
        Alert.alert("Error", data.message || "Could not update order.");
      }
    } catch (error) {
      console.log("Update order status error:", error);
      Alert.alert("Connection Error", "Could not connect to the server.");
    }
  };

  const handleAccept = (orderId) => {
    Alert.alert("Accept Order", "Do you want to accept this order?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Accept",
        onPress: () => updateStatus(orderId, "accepted"),
      },
    ]);
  };

  const handlePreparing = (orderId) => {
    Alert.alert("Set to Preparing", "Mark this order as Preparing?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: () => updateStatus(orderId, "preparing"),
      },
    ]);
  };

  const handleReady = (orderId) => {
    Alert.alert("Mark as Ready", "Is this order ready for delivery/pickup?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Mark as Ready",
        onPress: () => updateStatus(orderId, "ready"),
      },
    ]);
  };

  const openCancelModal = (orderId) => {
    setCancelOrderId(orderId);
    setSelectedReason(CANCEL_REASONS[0]);
    setCancelVisible(true);
  };

  const confirmCancel = async () => {
    if (!cancelOrderId) return;

    setCancelVisible(false);
    await updateStatus(cancelOrderId, "cancelled", selectedReason);
    setCancelOrderId(null);
  };

  const getActionButton = (order) => {
    if (order.status === "pending") {
      return (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => openCancelModal(order._id)}
          >
            <Text style={styles.rejectButtonText}>✕</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleAccept(order._id)}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (order.status === "accepted") {
      return (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => handlePreparing(order._id)}
          >
            <Text style={styles.secondaryButtonText}>Set to Preparing</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (order.status === "preparing") {
      return (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => handleReady(order._id)}
          >
            <Text style={styles.secondaryButtonText}>Mark as Ready</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Loading incoming orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Incoming Orders</Text>
          <Text style={styles.headerSubtitle}>
            Accept and prepare customer orders
          </Text>

          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for Order ID or Customer"
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={(text) => {
                setSearch(text);
                fetchOrders(text);
              }}
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#2E7D32"]}
            />
          }
        >
          {orders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🛒</Text>
              <Text style={styles.emptyTitle}>No Incoming Orders</Text>
              <Text style={styles.emptyText}>
                New customer orders will appear here for you to accept and
                prepare.
              </Text>
            </View>
          ) : (
            orders.map((order) => {
              const firstItem = order.items?.[0];
              const imageUrl = getImageUrl(firstItem?.productImage);
              const itemCount = order.items?.length || 0;

              return (
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

                    <View style={styles.cardInfo}>
                      <Text style={styles.orderId}>
                        Order ID: #{order.orderNumber}
                      </Text>
                      <Text style={styles.customerName}>
                        {order.customerName}
                      </Text>
                      <Text style={styles.dateText}>
                        {formatDate(order.createdAt)}
                      </Text>
                    </View>

                    <View style={styles.cardRight}>
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
                  </View>

                  <View style={styles.cardMeta}>
                    <Text style={styles.metaText}>
                      {itemCount} {itemCount === 1 ? "Item" : "Items"}
                    </Text>
                    <Text style={styles.totalText}>
                      Rs. {Number(order.totalAmount).toFixed(2)}
                    </Text>
                  </View>

                  {getActionButton(order)}
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={handleHome}>
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.navLabelActive}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={handleInventory}>
            <Text style={styles.navIcon}>📦</Text>
            <Text style={styles.navLabel}>Inventory</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={handleOrders}>
            <Text style={styles.navIcon}>📋</Text>
            <Text style={styles.navLabel}>Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={handleProfile}>
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navLabel}>Profile</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={cancelVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setCancelVisible(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.4)",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
                paddingBottom: 32,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#111827",
                  marginBottom: 16,
                }}
              >
                Cancel Order
              </Text>

              {CANCEL_REASONS.map((reason) => (
                <TouchableOpacity
                  key={reason}
                  onPress={() => setSelectedReason(reason)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#F3F4F6",
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: "#2E7D32",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    {selectedReason === reason ? (
                      <View
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          backgroundColor: "#2E7D32",
                        }}
                      />
                    ) : null}
                  </View>
                  <Text style={{ fontSize: 14, color: "#374151" }}>
                    {reason}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                onPress={confirmCancel}
                style={{
                  marginTop: 20,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: "#DC2626",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 15 }}
                >
                  Confirm Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setCancelVisible(false)}
                style={{ marginTop: 12, alignItems: "center", padding: 8 }}
              >
                <Text style={{ color: "#6B7280", fontSize: 14 }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
