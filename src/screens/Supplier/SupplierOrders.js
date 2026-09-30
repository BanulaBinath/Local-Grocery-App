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

import styles from "./SupplierOrders.styles";

export default function SupplierOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleHome = () => {
    router.replace("/supplier-dashboard");
  };

  const handleProducts = () => {
    router.replace("/supplier-products");
  };

  const handleOrders = () => {
    router.replace("/supplier-orders");
  };

  const handleMessages = () => {
    router.replace("/supplier-messages");
  };

  const handleProfile = () => {
    router.push("/supplier-profile");
  };

  // ==================================================
  // PRODUCT IMAGE URL
  // ==================================================
  const getProductImageUrl = (image) => {
    if (!image) {
      return null;
    }

    // Old local image path cannot be opened on another device
    if (image.startsWith("file://")) {
      return null;
    }

    // Image is already a complete URL
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    // Backend upload path
    return `${API_URL}${image.startsWith("/") ? image : `/${image}`}`;
  };

  // ==================================================
  // FETCH ORDERS
  // ==================================================
  const fetchOrders = async () => {
    try {
      const supplierData = await AsyncStorage.getItem("supplier");

      if (!supplierData) {
        setOrders([]);
        return;
      }

      const supplier = JSON.parse(supplierData);

      if (!supplier.id) {
        setOrders([]);
        return;
      }

      const response = await fetch(
        `${API_URL}/api/supply-orders/supplier/${supplier.id}`,
      );

      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        Alert.alert("Error", data.message || "Could not load supply orders.");
      }
    } catch (error) {
      console.log("Fetch supplier orders error:", error);

      Alert.alert("Connection Error", "Could not connect to the server.");
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

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  // ==================================================
  // ACCEPT ORDER
  // ==================================================
  const handleAccept = (orderId) => {
    Alert.alert("Accept Order", "Do you want to accept this supply order?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Accept",
        onPress: () => updateOrderStatus(orderId, "accepted"),
      },
    ]);
  };

  // ==================================================
  // REJECT ORDER
  // ==================================================
  const handleReject = (orderId) => {
    Alert.alert("Reject Order", "Do you want to reject this supply order?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Reject",
        style: "destructive",
        onPress: () => updateOrderStatus(orderId, "rejected"),
      },
    ]);
  };

  // ==================================================
  // READY FOR PICKUP
  // ==================================================
  const handleReadyForPickup = (orderId) => {
    Alert.alert("Ready for Pickup", "Is this order ready for pickup?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes, Ready",
        onPress: () => updateOrderStatus(orderId, "ready_for_pickup"),
      },
    ]);
  };

  // ==================================================
  // UPDATE ORDER STATUS
  // ==================================================
  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(
        `${API_URL}/api/supply-orders/${orderId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        let message = "Supply order updated successfully.";

        if (status === "accepted") {
          message = "Supply order accepted.";
        }

        if (status === "rejected") {
          message = "Supply order rejected.";
        }

        if (status === "ready_for_pickup") {
          message = "Supply order is ready for pickup.";
        }

        if (status === "completed") {
          message = "Supply order completed.";
        }

        Alert.alert("Success", message);

        fetchOrders();
      } else {
        Alert.alert("Error", data.message || "Could not update order.");
      }
    } catch (error) {
      console.log("Update order status error:", error);

      Alert.alert("Connection Error", "Could not connect to the server.");
    }
  };

  // ==================================================
  // STATUS STYLE
  // ==================================================
  const getStatusStyle = (status) => {
    switch (status) {
      case "accepted":
        return styles.acceptedStatus;

      case "rejected":
        return styles.rejectedStatus;

      case "ready_for_pickup":
        return styles.readyStatus;

      case "completed":
        return styles.completedStatus;

      default:
        return styles.pendingStatus;
    }
  };

  // ==================================================
  // STATUS TEXT
  // ==================================================
  const getStatusText = (status) => {
    switch (status) {
      case "accepted":
        return "Accepted";

      case "rejected":
        return "Rejected";

      case "ready_for_pickup":
        return "Ready for Pickup";

      case "completed":
        return "Completed";

      default:
        return "Pending";
    }
  };

  // ==================================================
  // LOADING
  // ==================================================
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E3A8A" />

          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Supply Orders</Text>

            <Text style={styles.headerSubtitle}>
              Manage incoming staff orders
            </Text>
          </View>

          {/* PROFILE BUTTON */}
          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleProfile}
            activeOpacity={0.8}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>

          {/* ORDER COUNT */}
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{orders.length}</Text>
          </View>
        </View>

        {/* ORDERS LIST */}
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#1E3A8A"]}
            />
          }
        >
          {orders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📦</Text>

              <Text style={styles.emptyTitle}>No Supply Orders</Text>

              <Text style={styles.emptyText}>
                There are no incoming supply orders at the moment.
              </Text>
            </View>
          ) : (
            orders.map((order) => {
              // Use saved image first.
              // If old order has no saved image, use Product image.
              const imageUrl = getProductImageUrl(
                order.productImage || order.productId?.image,
              );

              return (
                <View key={order._id} style={styles.card}>
                  {/* TOP ROW */}
                  <View style={styles.topRow}>
                    {/* PRODUCT IMAGE */}
                    <View style={styles.productImageContainer}>
                      {imageUrl ? (
                        <Image
                          source={{ uri: imageUrl }}
                          style={styles.productImage}
                          resizeMode="cover"
                          onError={(error) => {
                            console.log(
                              "Product image loading error:",
                              error.nativeEvent.error,
                            );
                          }}
                        />
                      ) : (
                        <View style={styles.productImagePlaceholder}>
                          <Text style={styles.productIcon}>🛒</Text>
                        </View>
                      )}
                    </View>

                    {/* PRODUCT INFO */}
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={1}>
                        {order.productName}
                      </Text>

                      <Text style={styles.staffName}>
                        Ordered by: {order.supplierStaffId?.fullName || "Staff"}
                      </Text>
                    </View>

                    {/* STATUS */}
                    <View
                      style={[styles.statusBadge, getStatusStyle(order.status)]}
                    >
                      <Text style={styles.statusText}>
                        {getStatusText(order.status)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  {/* QUANTITY */}
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Quantity</Text>

                    <Text style={styles.detailValue}>
                      {order.quantity} {order.unit}
                    </Text>
                  </View>

                  {/* PRICE PER UNIT */}
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Price per unit</Text>

                    <Text style={styles.detailValue}>
                      Rs. {Number(order.pricePerUnit).toFixed(2)}
                    </Text>
                  </View>

                  {/* TOTAL */}
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total Amount</Text>

                    <Text style={styles.totalValue}>
                      Rs. {Number(order.totalPrice).toFixed(2)}
                    </Text>
                  </View>

                  {/* PICKUP INFORMATION */}
                  <View style={styles.pickupInfo}>
                    <Text style={styles.pickupText}>
                      📅 Pickup Date: {order.pickupDate || "Not specified"}
                    </Text>

                    <Text style={styles.pickupText}>
                      🕐 Pickup Time: {order.pickupTime || "Not specified"}
                    </Text>

                    <Text style={styles.pickupText}>
                      📍 Pickup Location:{" "}
                      {order.pickupLocation || "Not specified"}
                    </Text>
                  </View>

                  {/* ORDER CREATED DATE */}
                  <Text style={styles.dateText}>
                    Ordered:{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </Text>

                  {/* ACCEPT / REJECT */}
                  {order.status === "pending" && (
                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={styles.rejectButton}
                        onPress={() => handleReject(order._id)}
                      >
                        <Text style={styles.rejectButtonText}>Reject</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.acceptButton}
                        onPress={() => handleAccept(order._id)}
                      >
                        <Text style={styles.acceptButtonText}>Accept</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* READY FOR PICKUP */}
                  {order.status === "accepted" && (
                    <TouchableOpacity
                      style={styles.readyButton}
                      onPress={() => handleReadyForPickup(order._id)}
                    >
                      <Text style={styles.readyButtonText}>
                        Ready for Pickup
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>

        {/* BOTTOM NAVIGATION */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={handleHome}>
            <Text style={styles.navIcon}>🏠</Text>

            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={handleProducts}>
            <Text style={styles.navIcon}>📦</Text>

            <Text style={styles.navLabel}>Products</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={handleOrders}>
            <Text style={styles.navIcon}>🛒</Text>

            <Text style={styles.navLabelActive}>Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={handleMessages}>
            <Text style={styles.navIcon}>💬</Text>

            <Text style={styles.navLabel}>Messages</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
