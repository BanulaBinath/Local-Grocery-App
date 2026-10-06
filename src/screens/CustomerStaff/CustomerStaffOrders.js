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

const REJECTION_REASONS = [
  "Unable to fulfill order",
  "Store temporarily closed",
  "Item quality/damage issue",
  "Delivery address unreachable",
  "Other / Custom reason",
];

export default function CustomerStaffOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [staff, setStaff] = useState(null);

  // Rejection modal state
  const [cancelVisible, setCancelVisible] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [selectedReason, setSelectedReason] = useState(REJECTION_REASONS[0]);
  const [customReasonText, setCustomReasonText] = useState("");

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith("file://")) return null;
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    return `${API_URL}${image.startsWith("/") ? image : `/${image}`}`;
  };

  const fetchOrders = async (searchTerm = search) => {
    try {
      const staffData = await AsyncStorage.getItem("customerStaff");
      if (staffData) setStaff(JSON.parse(staffData));

      const queryParams = [];
      if (filter !== "all") queryParams.push(`status=${filter}`);
      if (searchTerm) queryParams.push(`search=${encodeURIComponent(searchTerm)}`);

      const query = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
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

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders(search);
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
            staffId: staff?.id,
            cancelReason,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        if (status === "cancelled") {
          Alert.alert(
            "Order Rejected",
            `Order rejected successfully.\n\nAutomated message sent to customer: "Your order was rejected due to: ${cancelReason}"`,
          );
        } else {
          Alert.alert("Success", "Order status updated.");
        }
        fetchOrders(search);
      } else {
        Alert.alert("Error", data.message || "Could not update order.");
      }
    } catch (error) {
      console.log("Update order status error:", error);
      Alert.alert("Connection Error", "Could not connect to the server.");
    }
  };

  const openCancelModal = (orderId) => {
    setCancelOrderId(orderId);
    setSelectedReason(REJECTION_REASONS[0]);
    setCustomReasonText("");
    setCancelVisible(true);
  };

  const confirmCancel = async () => {
    if (!cancelOrderId) return;

    const finalReason =
      selectedReason === "Other / Custom reason"
        ? customReasonText.trim() || "No specific reason provided"
        : selectedReason;

    setCancelVisible(false);
    await updateStatus(cancelOrderId, "cancelled", finalReason);
    setCancelOrderId(null);
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
        return "Ready for Pickup";
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
    { key: "all", label: "All Orders" },
    { key: "pending", label: "New" },
    { key: "accepted", label: "Accepted" },
    { key: "preparing", label: "Preparing" },
    { key: "ready", label: "Ready" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  // Client-side search filter safety
  const filteredOrders = orders.filter((order) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const orderNum = String(order.orderNumber || "");
    const custName = (order.customerName || "").toLowerCase();
    return orderNum.includes(term) || custName.includes(term);
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#15803D" />
          <Text style={styles.loadingText}>Loading store orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with Search and Status Filters */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Order Management</Text>
          <Text style={styles.headerSubtitle}>
            {filteredOrders.length} customer orders recorded
          </Text>

          {/* Search Box */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by Order ID or Customer Name..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={(text) => {
                setSearch(text);
                fetchOrders(text);
              }}
            />
          </View>

          {/* Status Filter Scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterTabsScroll}
            contentContainerStyle={styles.filterTabsContainer}
          >
            {filters.map((item) => {
              const isSelected = filter === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => setFilter(item.key)}
                  style={[
                    styles.filterTab,
                    isSelected && styles.filterTabActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      isSelected && styles.filterTabTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
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
              onRefresh={handleRefresh}
              colors={["#15803D"]}
            />
          }
        >
          {filteredOrders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>No Orders Found</Text>
              <Text style={styles.emptyText}>
                No orders match your search or status filter.
              </Text>
            </View>
          ) : (
            filteredOrders.map((order) => {
              const firstItem = order.items?.[0];
              const imageUrl = getImageUrl(firstItem?.productImage);
              const itemCount = order.items?.length || 0;
              const itemsSummaryString = (order.items || [])
                .map((it) => `${it.productName || "Product"} (${it.quantity}x)`)
                .join(", ");

              return (
                <TouchableOpacity
                  key={order._id}
                  style={styles.card}
                  activeOpacity={0.88}
                  onPress={() =>
                    router.push({
                      pathname: "/customer-staff-order-details",
                      params: { orderId: order._id },
                    })
                  }
                >
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

                  <View style={styles.cardBody}>
                    <View style={styles.productThumb}>
                      {imageUrl ? (
                        <Image
                          source={{ uri: imageUrl }}
                          style={styles.productThumbImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <Text style={styles.productThumbIcon}>🛍️</Text>
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
                      {order.cancelReason ? (
                        <Text style={{ fontSize: 11, color: "#DC2626", marginTop: 2 }}>
                          Reason: {order.cancelReason}
                        </Text>
                      ) : null}
                    </View>
                  </View>

                  <View style={styles.itemsSummary}>
                    <Text style={styles.itemsSummaryText} numberOfLines={2}>
                      <Text style={{ fontWeight: "700" }}>Items: </Text>
                      {itemsSummaryString || "No item details available"}
                    </Text>
                  </View>

                  <View style={styles.cardFooter}>
                    <Text style={styles.itemsCount}>
                      {itemCount} {itemCount === 1 ? "item" : "items"} total
                    </Text>
                    <Text style={styles.totalAmount}>
                      Rs. {Number(order.totalAmount).toFixed(2)}
                    </Text>
                  </View>

                  {order.status === "pending" ? (
                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={styles.rejectButton}
                        onPress={() => openCancelModal(order._id)}
                      >
                        <Text style={styles.rejectButtonText}>Reject Order</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.acceptButton}
                        onPress={() => updateStatus(order._id, "accepted")}
                      >
                        <Text style={styles.acceptButtonText}>✓ Accept</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>

        {/* 5-Tab Bottom Navigation */}
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

        {/* Rejection Reason Modal */}
        <Modal
          visible={cancelVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setCancelVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalTitle}>Reject Order</Text>
                <TouchableOpacity onPress={() => setCancelVisible(false)}>
                  <Text style={{ fontSize: 18, color: "#94A3B8" }}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.modalSubtitle}>
                Select reason to notify customer:
              </Text>

              {REJECTION_REASONS.map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <TouchableOpacity
                    key={reason}
                    onPress={() => setSelectedReason(reason)}
                    style={[
                      styles.reasonOption,
                      isSelected && styles.reasonOptionSelected,
                    ]}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        isSelected && styles.radioOuterSelected,
                      ]}
                    >
                      {isSelected ? <View style={styles.radioInner} /> : null}
                    </View>
                    <Text
                      style={[
                        styles.reasonText,
                        isSelected && styles.reasonTextSelected,
                      ]}
                    >
                      {reason}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {selectedReason === "Other / Custom reason" ? (
                <TextInput
                  style={styles.customReasonInput}
                  placeholder="Enter specific rejection reason..."
                  placeholderTextColor="#94A3B8"
                  value={customReasonText}
                  onChangeText={setCustomReasonText}
                />
              ) : null}

              <TouchableOpacity
                onPress={confirmCancel}
                style={styles.confirmRejectButton}
                activeOpacity={0.85}
              >
                <Text style={styles.confirmRejectText}>Confirm Rejection</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setCancelVisible(false)}
                style={styles.closeModalButton}
              >
                <Text style={styles.closeModalText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

