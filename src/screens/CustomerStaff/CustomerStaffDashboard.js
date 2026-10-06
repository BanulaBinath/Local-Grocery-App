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

const staffBannerImage = require("../../../assets/images/staff_banner.png");

const REJECTION_REASONS = [
  "Unable to fulfill order",
  "Store temporarily closed",
  "Item quality/damage issue",
  "Delivery address unreachable",
  "Other / Custom reason",
];

export default function CustomerStaffDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedStatusTab, setSelectedStatusTab] = useState("all");
  const [staff, setStaff] = useState(null);

  // Rejection Modal state
  const [cancelVisible, setCancelVisible] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [selectedReason, setSelectedReason] = useState(REJECTION_REASONS[0]);
  const [customReasonText, setCustomReasonText] = useState("");

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

  const fetchOrders = async (searchTerm = search, isSilent = false) => {
    try {
      const staffData = await AsyncStorage.getItem("customerStaff");

      if (staffData) {
        setStaff(JSON.parse(staffData));
      }

      const query = searchTerm
        ? `?search=${encodeURIComponent(searchTerm)}`
        : "";

      const response = await fetch(`${API_URL}/api/customer-orders${query}`);
      const data = await response.json();

      if (response.ok) {
        // Show active incoming orders
        const incoming = (data.orders || []).filter((order) =>
          ["pending", "accepted", "preparing", "ready"].includes(order.status),
        );
        setOrders(incoming);
      } else if (!isSilent) {
        Alert.alert("Error", data.message || "Could not load orders.");
      }
    } catch (error) {
      if (!isSilent) {
        console.log("Fetch customer staff orders error:", error);
        Alert.alert("Connection Error", "Could not connect to the server.");
      }
    } finally {
      if (!isSilent) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
      const interval = setInterval(() => {
        fetchOrders(search, true);
      }, 4000);

      return () => clearInterval(interval);
    }, [search]),
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
        const messages = {
          accepted: "Order accepted.",
          preparing: "Order status set to Preparing.",
          ready: "Order marked as Ready for Delivery.",
          completed: "Order completed successfully.",
          cancelled: `Order rejected: ${cancelReason}`,
        };

        Alert.alert("Success", messages[status] || "Order updated.");
        fetchOrders(search);
      } else {
        Alert.alert("Error", data.message || "Could not update order.");
      }
    } catch (error) {
      console.log("Update order status error:", error);
      Alert.alert("Connection Error", "Could not connect to the server.");
    }
  };

  const handleAccept = (orderId) => {
    Alert.alert("Accept Order", "Do you want to accept this incoming order?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Accept",
        onPress: () => updateStatus(orderId, "accepted"),
      },
    ]);
  };

  const handlePreparing = (orderId) => {
    updateStatus(orderId, "preparing");
  };

  const handleReady = (orderId) => {
    updateStatus(orderId, "ready");
  };

  const handleComplete = (orderId) => {
    Alert.alert("Complete Order", "Mark this order as fulfilled and completed?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Complete",
        onPress: () => updateStatus(orderId, "completed"),
      },
    ]);
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

  // Filter orders by tab
  const filteredOrders = orders.filter((order) => {
    if (selectedStatusTab === "all") return true;
    return order.status === selectedStatusTab;
  });

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const preparingCount = orders.filter((o) => o.status === "preparing").length;
  const readyCount = orders.filter((o) => o.status === "ready").length;

  const getActionButton = (order) => {
    if (order.status === "pending") {
      return (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => openCancelModal(order._id)}
          >
            <Text style={styles.rejectButtonText}>Reject Order</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleAccept(order._id)}
          >
            <Text style={styles.acceptButtonText}>✓ Accept Order</Text>
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
            style={styles.readyButton}
            onPress={() => handleReady(order._id)}
          >
            <Text style={styles.readyButtonText}>Mark as Ready</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (order.status === "ready") {
      return (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => handleComplete(order._id)}
          >
            <Text style={styles.completeButtonText}>✓ Complete Order</Text>
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
          <ActivityIndicator size="large" color="#15803D" />
          <Text style={styles.loadingText}>Loading incoming orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with Visual Banner */}
        <View style={styles.header}>
          <View style={styles.bannerContainer}>
            <Image
              source={staffBannerImage}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            <View style={styles.bannerOverlay} />
            <View style={styles.bannerContent}>
              <View style={styles.bannerTitleRow}>
                <View style={styles.staffBadge}>
                  <Text style={styles.staffBadgeText}>STAFF PORTAL</Text>
                </View>
                <Text style={styles.welcomeText}>
                  Hello, {staff?.name || "Staff Member"} 👋
                </Text>
                <Text style={styles.storeSubtext}>
                  {orders.length} incoming orders total
                </Text>
              </View>

              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>
          </View>

          {/* Search Box */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by Order ID or Customer Name"
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={(text) => {
                setSearch(text);
                fetchOrders(text);
              }}
            />
          </View>

          {/* Status Filter Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterTabsScroll}
            contentContainerStyle={styles.filterTabsContainer}
          >
            <TouchableOpacity
              style={[
                styles.filterTab,
                selectedStatusTab === "all" && styles.filterTabActive,
              ]}
              onPress={() => setSelectedStatusTab("all")}
            >
              <Text
                style={[
                  styles.filterTabText,
                  selectedStatusTab === "all" && styles.filterTabTextActive,
                ]}
              >
                All Incoming
              </Text>
              <View
                style={[
                  styles.filterBadge,
                  selectedStatusTab === "all" && styles.filterBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterBadgeText,
                    selectedStatusTab === "all" &&
                      styles.filterBadgeTextActive,
                  ]}
                >
                  {orders.length}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterTab,
                selectedStatusTab === "pending" && styles.filterTabActive,
              ]}
              onPress={() => setSelectedStatusTab("pending")}
            >
              <Text
                style={[
                  styles.filterTabText,
                  selectedStatusTab === "pending" && styles.filterTabTextActive,
                ]}
              >
                New Orders
              </Text>
              <View
                style={[
                  styles.filterBadge,
                  selectedStatusTab === "pending" && styles.filterBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterBadgeText,
                    selectedStatusTab === "pending" &&
                      styles.filterBadgeTextActive,
                  ]}
                >
                  {pendingCount}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterTab,
                selectedStatusTab === "preparing" && styles.filterTabActive,
              ]}
              onPress={() => setSelectedStatusTab("preparing")}
            >
              <Text
                style={[
                  styles.filterTabText,
                  selectedStatusTab === "preparing" &&
                    styles.filterTabTextActive,
                ]}
              >
                Preparing
              </Text>
              <View
                style={[
                  styles.filterBadge,
                  selectedStatusTab === "preparing" && styles.filterBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterBadgeText,
                    selectedStatusTab === "preparing" &&
                      styles.filterBadgeTextActive,
                  ]}
                >
                  {preparingCount}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterTab,
                selectedStatusTab === "ready" && styles.filterTabActive,
              ]}
              onPress={() => setSelectedStatusTab("ready")}
            >
              <Text
                style={[
                  styles.filterTabText,
                  selectedStatusTab === "ready" && styles.filterTabTextActive,
                ]}
              >
                Ready
              </Text>
              <View
                style={[
                  styles.filterBadge,
                  selectedStatusTab === "ready" && styles.filterBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterBadgeText,
                    selectedStatusTab === "ready" &&
                      styles.filterBadgeTextActive,
                  ]}
                >
                  {readyCount}
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Incoming Orders List */}
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
              <Text style={styles.emptyIcon}>🛍️</Text>
              <Text style={styles.emptyTitle}>No Incoming Orders</Text>
              <Text style={styles.emptyText}>
                {selectedStatusTab === "pending"
                  ? "No new pending orders at the moment."
                  : "All customer orders in this view will appear here live."}
              </Text>
            </View>
          ) : (
            filteredOrders.map((order) => {
              const firstItem = order.items?.[0];
              const imageUrl = getImageUrl(firstItem?.productImage);
              const itemCount = order.items?.length || 0;
              const isPending = order.status === "pending";

              const itemsSummaryString = (order.items || [])
                .map((it) => `${it.productName || "Product"} (${it.quantity}x)`)
                .join(", ");

              return (
                <TouchableOpacity
                  key={order._id}
                  style={[
                    styles.card,
                    isPending && styles.cardPendingHighlight,
                  ]}
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
                        <Text style={styles.productThumbIcon}>🥬</Text>
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
                      {order.customerAddress ? (
                        <Text
                          style={styles.customerAddress}
                          numberOfLines={1}
                        >
                          📍 {order.customerAddress}
                        </Text>
                      ) : null}
                    </View>
                  </View>

                  {/* Items Summary */}
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

                  {getActionButton(order)}
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>

        {/* Bottom Navigation */}
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

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/customer-staff-messages")}
          >
            <Text style={styles.navIcon}>💬</Text>
            <Text style={styles.navLabel}>Messages</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={handleProfile}>
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
                Please select the primary reason for rejecting this order:
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

