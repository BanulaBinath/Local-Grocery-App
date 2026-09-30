import { useCallback, useMemo, useState } from "react";

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

import styles from "./SupplierStaffSupplyOrders.styles";

export default function SupplierStaffSupplyOrders() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [activeTab, setActiveTab] = useState("pending");

  // ========================================
  // PRODUCT IMAGE URL
  // ========================================

  const getProductImageUrl = (image) => {
    if (!image) {
      return null;
    }

    if (image.startsWith("file://")) {
      return null;
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${API_URL}${image.startsWith("/") ? image : `/${image}`}`;
  };

  // ========================================
  // FETCH ORDERS
  // ========================================

  const fetchOrders = async () => {
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
        setOrders(data.orders || []);
      } else {
        console.log("Load orders error:", data.message);
      }
    } catch (error) {
      console.log("Fetch supply orders error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, []),
  );

  // ========================================
  // REFRESH
  // ========================================

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  // ========================================
  // DELETE REJECTED ORDER
  // ========================================

  const handleDelete = (orderId) => {
    Alert.alert(
      "Delete Order",
      "Are you sure you want to delete this rejected order?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(
                `${API_URL}/api/supply-orders/${orderId}`,
                {
                  method: "DELETE",
                },
              );

              const data = await response.json();

              if (response.ok) {
                setOrders((currentOrders) =>
                  currentOrders.filter((item) => item._id !== orderId),
                );

                Alert.alert("Deleted", "Rejected order deleted successfully.");
              } else {
                Alert.alert("Error", data.message || "Unable to delete order.");
              }
            } catch (error) {
              console.log("Delete order error:", error);

              Alert.alert(
                "Error",
                "Something went wrong while deleting the order.",
              );
            }
          },
        },
      ],
    );
  };

  // ========================================
  // FILTER ORDERS
  // ========================================

  const pendingOrders = useMemo(() => {
    return orders.filter(
      (order) => order.status === "pending" || !order.status,
    );
  }, [orders]);

  const rejectedOrders = useMemo(() => {
    return orders.filter((order) => order.status === "rejected");
  }, [orders]);

  const acceptedOrders = useMemo(() => {
    return orders.filter((order) => order.status === "accepted");
  }, [orders]);

  const completedOrders = useMemo(() => {
    return orders.filter((order) => order.status === "completed");
  }, [orders]);

  const displayedOrders =
    activeTab === "pending" ? pendingOrders : rejectedOrders;

  // ========================================
  // STATUS STYLE
  // ========================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "accepted":
        return styles.acceptedStatus;

      case "rejected":
        return styles.rejectedStatus;

      case "completed":
        return styles.completedStatus;

      default:
        return styles.pendingStatus;
    }
  };

  // ========================================
  // STATUS TEXT
  // ========================================

  const getStatusText = (status) => {
    switch (status) {
      case "accepted":
        return "Accepted";

      case "rejected":
        return "Rejected";

      case "completed":
        return "Completed";

      default:
        return "Pending";
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#1E3A8A" />

          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ========================================
  // MAIN UI
  // ========================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Supply Orders</Text>

            <Text style={styles.headerSubtitle}>
              Manage your supplier orders
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

        {/* QUICK STATUS SUMMARY */}

        <View style={styles.summaryRow}>
          <TouchableOpacity
            style={[
              styles.summaryCard,
              activeTab === "pending" && styles.summaryCardActive,
            ]}
            onPress={() => setActiveTab("pending")}
          >
            <Text style={styles.summaryIcon}>⏳</Text>

            <Text style={styles.summaryNumber}>{pendingOrders.length}</Text>

            <Text style={styles.summaryLabel}>Pending</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.summaryCard,
              activeTab === "rejected" && styles.summaryCardRejected,
            ]}
            onPress={() => setActiveTab("rejected")}
          >
            <Text style={styles.summaryIcon}>❌</Text>

            <Text style={styles.summaryNumber}>{rejectedOrders.length}</Text>

            <Text style={styles.summaryLabel}>Rejected</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.summaryCard}
            onPress={() => router.push("/supplier-staff-pickup-orders")}
          >
            <Text style={styles.summaryIcon}>🚚</Text>

            <Text style={styles.summaryNumber}>{acceptedOrders.length}</Text>

            <Text style={styles.summaryLabel}>Pickup</Text>
          </TouchableOpacity>
        </View>

        {/* TABS */}

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "pending" && styles.activeTab]}
            onPress={() => setActiveTab("pending")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "pending" && styles.activeTabText,
              ]}
            >
              Pending Orders
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "rejected" && styles.activeRejectedTab,
            ]}
            onPress={() => setActiveTab("rejected")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "rejected" && styles.activeRejectedTabText,
              ]}
            >
              Rejected Orders
            </Text>
          </TouchableOpacity>
        </View>

        {/* CONTENT */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {/* EMPTY */}

          {displayedOrders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>
                {activeTab === "pending" ? "📦" : "❌"}
              </Text>

              <Text style={styles.emptyTitle}>
                {activeTab === "pending"
                  ? "No Pending Orders"
                  : "No Rejected Orders"}
              </Text>

              <Text style={styles.emptyText}>
                {activeTab === "pending"
                  ? "You do not have any pending supply orders."
                  : "There are no rejected supply orders."}
              </Text>

              {activeTab === "pending" && (
                <TouchableOpacity
                  style={styles.shopButton}
                  onPress={() => router.push("/supplier-staff-suppliers")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.shopButtonText}>Browse Suppliers</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            displayedOrders.map((order) => {
              const imageUrl = getProductImageUrl(order.productImage);

              return (
                <View key={order._id} style={styles.card}>
                  {/* TOP ROW */}

                  <View style={styles.topRow}>
                    <View style={styles.productIconContainer}>
                      {imageUrl ? (
                        <Image
                          source={{ uri: imageUrl }}
                          style={styles.productImage}
                          resizeMode="cover"
                          onError={(error) => {
                            console.log(
                              "Supplier Staff product image error:",
                              error.nativeEvent.error,
                            );
                          }}
                        />
                      ) : (
                        <Text style={styles.productIcon}>🛒</Text>
                      )}
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
                      style={[styles.statusBadge, getStatusStyle(order.status)]}
                    >
                      <Text style={styles.statusText}>
                        {getStatusText(order.status)}
                      </Text>
                    </View>
                  </View>

                  {/* DIVIDER */}

                  <View style={styles.divider} />

                  {/* DETAILS */}

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

                  {/* DATE */}

                  <Text style={styles.dateText}>
                    Ordered:{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "-"}
                  </Text>

                  {/* REJECTED DELETE */}

                  {activeTab === "rejected" && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDelete(order._id)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.deleteButtonText}>
                        🗑️ Delete Rejected Order
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          )}

          {/* ACCEPTED NOTICE */}

          {acceptedOrders.length > 0 && (
            <TouchableOpacity
              style={styles.pickupNotice}
              onPress={() => router.push("/supplier-staff-pickup-orders")}
              activeOpacity={0.8}
            >
              <View style={styles.pickupNoticeIcon}>
                <Text>🚚</Text>
              </View>

              <View style={styles.pickupNoticeContent}>
                <Text style={styles.pickupNoticeTitle}>Pickup Orders</Text>

                <Text style={styles.pickupNoticeText}>
                  {acceptedOrders.length} accepted order
                  {acceptedOrders.length !== 1 ? "s are" : " is"} ready for
                  pickup.
                </Text>
              </View>

              <Text style={styles.pickupNoticeArrow}>›</Text>
            </TouchableOpacity>
          )}

          {/* COMPLETED NOTICE */}

          {completedOrders.length > 0 && (
            <TouchableOpacity
              style={styles.historyNotice}
              onPress={() => router.push("/supplier-staff-completed-history")}
              activeOpacity={0.8}
            >
              <View style={styles.historyNoticeIcon}>
                <Text>📋</Text>
              </View>

              <View style={styles.historyNoticeContent}>
                <Text style={styles.historyNoticeTitle}>Completed History</Text>

                <Text style={styles.historyNoticeText}>
                  {completedOrders.length} completed order
                  {completedOrders.length !== 1 ? "s" : ""}
                </Text>
              </View>

              <Text style={styles.historyNoticeArrow}>›</Text>
            </TouchableOpacity>
          )}

          <View style={styles.bottomSpace} />
        </ScrollView>

        {/* BOTTOM NAVIGATION */}

        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.replace("/supplier-staff-dashboard")}
          >
            <Text style={styles.navIcon}>🏠</Text>

            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIconActive}>📦</Text>

            <Text style={styles.navLabelActive}>Orders</Text>
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
