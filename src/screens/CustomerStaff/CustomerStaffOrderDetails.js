import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { API_URL } from "../../constants/api";
import styles from "./CustomerStaffOrderDetails.styles";

const STEPS = ["Ordered", "Accepted", "Preparing", "Ready"];

const CANCEL_REASONS = [
  "Unable to fulfill order",
  "Store temporarily closed",
  "Item quality/damage issue",
  "Out of stock",
  "Delivery address unreachable",
  "Other / Custom reason",
];

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

export default function CustomerStaffOrderDetails() {
  const { orderId } = useLocalSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [staffId, setStaffId] = useState(null);
  const [cancelVisible, setCancelVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState(CANCEL_REASONS[0]);

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith("file://")) return null;
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    return `${API_URL}${image.startsWith("/") ? image : `/${image}`}`;
  };

  const fetchOrder = async () => {
    try {
      const staffData = await AsyncStorage.getItem("customerStaff");

      if (staffData) {
        const staff = JSON.parse(staffData);
        setStaffId(staff.id);
      }

      const response = await fetch(
        `${API_URL}/api/customer-orders/${orderId}`,
      );
      const data = await response.json();

      if (response.ok) {
        setOrder(data.order);
      } else {
        Alert.alert("Error", data.message || "Could not load order.");
      }
    } catch (error) {
      console.log("Fetch order details error:", error);
      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (orderId) {
        setLoading(true);
        fetchOrder();
      }
    }, [orderId]),
  );

  const updateStatus = async (status, cancelReason = "") => {
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
        setOrder(data.order);
        Alert.alert("Success", "Order status updated. Customer can view it.");
      } else {
        Alert.alert("Error", data.message || "Could not update order.");
      }
    } catch (error) {
      console.log("Update status error:", error);
      Alert.alert("Connection Error", "Could not connect to the server.");
    }
  };

  const getPrimaryAction = () => {
    if (!order) return null;

    if (order.status === "pending") {
      return {
        label: "Accept Order",
        onPress: () => updateStatus("accepted"),
      };
    }

    if (order.status === "accepted") {
      return {
        label: "Set to Preparing",
        onPress: () => updateStatus("preparing"),
      };
    }

    if (order.status === "preparing") {
      return {
        label: "Mark as Ready",
        onPress: () => updateStatus("ready"),
      };
    }

    if (order.status === "ready") {
      return {
        label: "Mark as Completed",
        onPress: () => updateStatus("completed"),
      };
    }

    return null;
  };

  const confirmCancel = async () => {
    setCancelVisible(false);
    await updateStatus("cancelled", selectedReason);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Loading order...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Order not found.</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: "#2E7D32", marginTop: 12 }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentStep = statusToStepIndex(order.status);
  const action = getPrimaryAction();
  const canCancel = ["pending", "accepted", "preparing"].includes(
    order.status,
  );

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
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={styles.headerSpace} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.stepperCard}>
            <Text style={styles.stepperTitle}>
              Order #{order.orderNumber}
            </Text>

            <View style={styles.stepperRow}>
              {STEPS.map((label, index) => {
                const done = index <= currentStep && order.status !== "cancelled";
                const active =
                  index === currentStep && order.status !== "cancelled";

                return (
                  <View key={label} style={styles.stepItem}>
                    <View
                      style={[
                        styles.stepCircle,
                        done && styles.stepCircleDone,
                        active && styles.stepCircleActive,
                      ]}
                    >
                      {done ? (
                        <Text style={styles.stepCheck}>✓</Text>
                      ) : (
                        <Text style={{ fontSize: 11, color: "#9CA3AF" }}>
                          {index + 1}
                        </Text>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.stepLabel,
                        (done || active) && styles.stepLabelActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </View>
                );
              })}
            </View>

            {order.status === "cancelled" ? (
              <Text
                style={{
                  marginTop: 12,
                  color: "#DC2626",
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                Cancelled: {order.cancelReason || "No reason provided"}
              </Text>
            ) : null}
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Order Items</Text>

            {(order.items || []).map((item, index) => {
              const imageUrl = getImageUrl(item.productImage);

              return (
                <View key={`${item.productId}-${index}`} style={styles.itemRow}>
                  <View style={styles.itemImage}>
                    {imageUrl ? (
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.itemImageSrc}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text>🥬</Text>
                    )}
                  </View>

                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.productName}</Text>
                    <Text style={styles.itemQty}>
                      {item.quantity}x · {item.unit}
                    </Text>
                  </View>

                  <Text style={styles.itemPrice}>
                    Rs. {Number(item.lineTotal).toFixed(2)}
                  </Text>
                </View>
              );
            })}

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Items Total</Text>
              <Text style={styles.priceValue}>
                Rs. {Number(order.itemsTotal).toFixed(2)}
              </Text>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Delivery Fee</Text>
              <Text style={styles.priceValue}>
                Rs. {Number(order.deliveryFee).toFixed(2)}
              </Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                Rs. {Number(order.totalAmount).toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Customer Details</Text>

            <Text style={styles.detailLabel}>Name</Text>
            <Text style={styles.detailValue}>{order.customerName}</Text>

            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>
              {order.customerPhone || "Not provided"}
            </Text>

            <Text style={styles.detailLabel}>Address</Text>
            <Text style={styles.detailValue}>
              {order.customerAddress || "Not provided"}
            </Text>

            <TouchableOpacity
              style={styles.chatButton}
              onPress={() =>
                router.push({
                  pathname: "/customer-staff-messages",
                  params: {
                    customerName: order.customerName,
                    orderNumber: String(order.orderNumber),
                  },
                })
              }
            >
              <Text style={styles.chatButtonText}>Message Customer</Text>
            </TouchableOpacity>
          </View>

          {/* Pickup Details */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>📅 Pickup Details</Text>

            <Text style={styles.detailLabel}>Pickup Date</Text>
            <Text style={styles.detailValue}>{order.pickupDate || "Today / Standard"}</Text>

            <Text style={styles.detailLabel}>Pickup Time</Text>
            <Text style={styles.detailValue}>{order.pickupTime || "Anytime during open hours"}</Text>

            <Text style={styles.detailLabel}>Pickup Location</Text>
            <Text style={styles.detailValue}>{order.pickupLocation || "Main Store Pickup Counter"}</Text>

            {order.note ? (
              <>
                <Text style={styles.detailLabel}>Customer Note / Instructions</Text>
                <Text style={[styles.detailValue, { fontStyle: "italic", color: "#4B5563" }]}>
                  "{order.note}"
                </Text>
              </>
            ) : null}
          </View>
        </ScrollView>

        {(action || canCancel) && (
          <View style={styles.footer}>
            {action ? (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={action.onPress}
              >
                <Text style={styles.primaryButtonText}>{action.label}</Text>
              </TouchableOpacity>
            ) : null}

            {canCancel ? (
              <TouchableOpacity
                style={styles.cancelLink}
                onPress={() => setCancelVisible(true)}
              >
                <Text style={styles.cancelLinkText}>Cancel Order</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}

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
