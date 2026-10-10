
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";

import { API_URL } from "../../constants/api";

// Color palette
const C = {
  primary: "#15803D",
  primaryDk: "#166534",
  primarySf: "#F0FDF4",
  primaryMd: "#DCFCE7",
  accent: "#22C55E",
  bg: "#F8FAFC",
  white: "#FFFFFF",
  slate: "#0F172A",
  gray: "#64748B",
  border: "#E2E8F0",
  red: "#DC2626",
  redSoft: "#FEF2F2",
  amber: "#D97706",
  amberSoft: "#FFFBEB",
  blue: "#2563EB",
  blueSoft: "#EFF6FF",
};

// Status configuration
const STATUS_CONFIG = {
  pending: {
    label: "New Order",
    emoji: "🔔",
    color: C.amber,
    bg: C.amberSoft,
    border: "#FDE68A",
  },
  accepted: {
    label: "Accepted",
    emoji: "✅",
    color: C.blue,
    bg: C.blueSoft,
    border: "#BFDBFE",
  },
  preparing: {
    label: "Preparing",
    emoji: "👨‍🍳",
    color: C.primary,
    bg: C.primarySf,
    border: "#86EFAC",
  },
  ready: {
    label: "Ready for Pickup",
    emoji: "🎉",
    color: C.primaryDk,
    bg: C.primaryMd,
    border: "#4ADE80",
  },
  completed: {
    label: "Completed",
    emoji: "🏆",
    color: C.primaryDk,
    bg: C.primaryMd,
    border: "#4ADE80",
  },
  cancelled: {
    label: "Cancelled",
    emoji: "❌",
    color: C.red,
    bg: C.redSoft,
    border: "#FCA5A5",
  },
};

// Order progress steps
const STEPS = [
  { key: "pending", label: "Ordered", emoji: "🛒" },
  { key: "accepted", label: "Accepted", emoji: "✅" },
  { key: "preparing", label: "Cooking", emoji: "👨‍🍳" },
  { key: "ready", label: "Ready", emoji: "🎉" },
];

const STEP_INDEX = {
  pending: 0,
  accepted: 1,
  preparing: 2,
  ready: 3,
  completed: 3,
};

const CANCEL_REASONS = [
  "Unable to fulfill order",
  "Store temporarily closed",
  "Item quality/damage issue",
  "Out of stock",
  "Delivery address unreachable",
  "Other / Custom reason",
];

// Helper functions
const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith("file://")) return null;

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  return `${API_URL}${image.startsWith("/") ? image : `/${image}`}`;
};

const formatDate = (value) => {
  if (!value) return "—";

  const d = new Date(value);

  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default function CustomerStaffOrderDetails() {
  const { orderId } = useLocalSearchParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [staffId, setStaffId] = useState(null);
  const [cancelVisible, setCancelVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState(
    CANCEL_REASONS[0]
  );
  const [customReason, setCustomReason] = useState("");

  // Fetch order details
  const fetchOrder = async () => {
    try {
      const staffData = await AsyncStorage.getItem("customerStaff");

      if (staffData) {
        setStaffId(JSON.parse(staffData).id);
      }

      const res = await fetch(
        `${API_URL}/api/customer-orders/${orderId}`
      );

      const data = await res.json();

      if (res.ok) {
        setOrder(data.order);
      } else {
        Alert.alert(
          "Error",
          data.message || "Could not load order."
        );
      }
    } catch {
      Alert.alert(
        "Error",
        "Could not connect to the server."
      );
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
    }, [orderId])
  );

  // Update order status
  const updateStatus = async (status, cancelReason = "") => {
    try {
      setUpdating(true);

      const res = await fetch(
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
        }
      );

      const data = await res.json();

      if (res.ok) {
        setOrder(data.order);
        Alert.alert(
          "✅ Updated",
          getSuccessMessage(status)
        );
      } else {
        Alert.alert(
          "Error",
          data.message || "Could not update order."
        );
      }
    } catch {
      Alert.alert(
        "Error",
        "Could not connect to the server."
      );
    } finally {
      setUpdating(false);
    }
  };

  const getSuccessMessage = (status) => {
    switch (status) {
      case "accepted":
        return "Order accepted! Customer has been notified.";
      case "preparing":
        return "Order is now being prepared.";
      case "ready":
        return "Order marked as ready for pickup!";
      case "completed":
        return "Order completed successfully!";
      case "cancelled":
        return "Order cancelled. Customer has been notified.";
      default:
        return "Order status updated.";
    }
  };

  // Confirm order rejection
  const confirmCancel = async () => {
    const reason =
      selectedReason === "Other / Custom reason"
        ? customReason.trim() ||
          "No specific reason provided"
        : selectedReason;

    setCancelVisible(false);

    await updateStatus("cancelled", reason);
  };

  // Remove completed or cancelled order
  const handleRemoveOrder = () => {
    Alert.alert(
      "Remove Order",
      `Are you sure you want to remove completed Order #${order.orderNumber}? This will remove it from the list.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              setUpdating(true);

              const res = await fetch(
                `${API_URL}/api/customer-orders/${orderId}`,
                {
                  method: "DELETE",
                }
              );

              if (res.ok) {
                Alert.alert(
                  "Success",
                  `Order #${order.orderNumber} has been removed.`,
                  [
                    {
                      text: "OK",
                      onPress: () =>
                        router.replace("/customer-staff-orders"),
                    },
                  ]
                );
              } else {
                const data = await res.json();

                Alert.alert(
                  "Error",
                  data.message || "Failed to remove order."
                );
              }
            } catch {
              Alert.alert(
                "Error",
                "Could not connect to the server."
              );
            } finally {
              setUpdating(false);
            }
          },
        },
      ]
    );
  };

  // Available status actions
  const getAction = () => {
    if (!order) return null;

    switch (order.status) {
      case "pending":
        return {
          label: "✅ Accept Order",
          color: C.primary,
          onPress: () => updateStatus("accepted"),
        };

      case "accepted":
        return {
          label: "👨‍🍳 Start Preparing",
          color: C.blue,
          onPress: () => updateStatus("preparing"),
        };

      case "preparing":
        return {
          label: "🎉 Mark as Ready",
          color: C.primary,
          onPress: () => updateStatus("ready"),
        };

      case "ready":
        return {
          label: "🏆 Mark as Completed",
          color: C.primaryDk,
          onPress: () => updateStatus("completed"),
        };

      default:
        return null;
    }
  };

  // Loading screen
  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: C.white }}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor={C.white}
        />

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: C.primarySf,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <ActivityIndicator
              size="large"
              color={C.primary}
            />
          </View>

          <Text
            style={{
              fontSize: 15,
              color: C.gray,
              fontWeight: "600",
            }}
          >
            Loading order details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Order not found screen
  if (!order) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: C.bg }}
      >
        <StatusBar barStyle="dark-content" />

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <Text style={{ fontSize: 48, marginBottom: 12 }}>
            📭
          </Text>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: C.slate,
              marginBottom: 8,
            }}
          >
            Order Not Found
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: C.gray,
              marginBottom: 24,
              textAlign: "center",
            }}
          >
            This order may have been removed or the link is invalid.
          </Text>

          <TouchableOpacity
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/customer-staff-orders");
              }
            }}
            style={{
              backgroundColor: C.primary,
              paddingHorizontal: 28,
              paddingVertical: 14,
              borderRadius: 14,
            }}
          >
            <Text
              style={{
                color: C.white,
                fontWeight: "800",
                fontSize: 15,
              }}
            >
              ← Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const cfg =
    STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

  const currentStep = STEP_INDEX[order.status] ?? 0;
  const action = getAction();

  const canCancel = [
    "pending",
    "accepted",
    "preparing",
  ].includes(order.status);

  const isFinal = [
    "completed",
    "cancelled",
  ].includes(order.status);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: C.bg }}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={C.white}
      />

      {/* Header - Back button removed */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 14,
          backgroundColor: C.white,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 6,
          elevation: 3,
        }}
      >
        {/* Centered order title */}
        <View
          style={{
            flex: 1,
            alignItems: "center",
            marginRight: 8,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: "800",
              color: C.slate,
            }}
          >
            Order Details
          </Text>

          <Text
            style={{
              fontSize: 12,
              color: C.gray,
              marginTop: 1,
            }}
          >
            #{order.orderNumber}
          </Text>
        </View>

        {/* Order status */}
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 10,
            backgroundColor: cfg.bg,
            borderWidth: 1,
            borderColor: cfg.border,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: "800",
              color: cfg.color,
            }}
          >
            {cfg.emoji} {cfg.label}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 150,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Order header card */}
        <View style={[card, { marginBottom: 14, overflow: "hidden" }]}>
          <View
            style={{
              height: 4,
              backgroundColor: cfg.color,
              marginHorizontal: -16,
              marginTop: -16,
              marginBottom: 16,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "900",
                  color: C.slate,
                }}
              >
                Order #{order.orderNumber}
              </Text>

              <Text
                style={{
                  fontSize: 12,
                  color: C.gray,
                  marginTop: 3,
                }}
              >
                🕒 {formatDate(order.createdAt)}
              </Text>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "900",
                  color: C.primary,
                }}
              >
                Rs.{Number(order.totalAmount || 0).toFixed(2)}
              </Text>

              <Text style={{ fontSize: 11, color: C.gray }}>
                Total Amount
              </Text>
            </View>
          </View>

          {order.status === "cancelled" &&
            order.cancelReason && (
              <View
                style={{
                  marginTop: 12,
                  padding: 10,
                  backgroundColor: C.redSoft,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#FCA5A5",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: C.red,
                    fontWeight: "700",
                  }}
                >
                  ❌ Cancelled Reason
                </Text>

                <Text
                  style={{
                    fontSize: 13,
                    color: "#7F1D1D",
                    marginTop: 3,
                  }}
                >
                  {order.cancelReason}
                </Text>
              </View>
            )}
        </View>

        {/* Order progress */}
        {!isFinal && (
          <View style={[card, { marginBottom: 14 }]}>
            <Text style={sectionTitle}>Order Progress</Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginTop: 8,
              }}
            >
              {STEPS.map((step, index) => {
                const done = index <= currentStep;
                const active = index === currentStep;

                return (
                  <View
                    key={step.key}
                    style={{
                      flex: 1,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      {index > 0 && (
                        <View
                          style={{
                            flex: 1,
                            height: 3,
                            borderRadius: 2,
                            backgroundColor:
                              index <= currentStep
                                ? C.primary
                                : C.border,
                          }}
                        />
                      )}

                      <View
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          backgroundColor: done
                            ? C.primary
                            : C.white,
                          borderWidth: 2.5,
                          borderColor: done
                            ? C.primary
                            : C.border,
                          alignItems: "center",
                          justifyContent: "center",
                          shadowColor: done
                            ? C.primary
                            : "transparent",
                          shadowOffset: {
                            width: 0,
                            height: 3,
                          },
                          shadowOpacity: done ? 0.35 : 0,
                          shadowRadius: 6,
                          elevation: done ? 3 : 0,
                        }}
                      >
                        {done ? (
                          <Text
                            style={{
                              fontSize: active ? 16 : 14,
                            }}
                          >
                            {step.emoji}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              fontSize: 12,
                              color: C.gray,
                              fontWeight: "700",
                            }}
                          >
                            {index + 1}
                          </Text>
                        )}
                      </View>

                      {index < STEPS.length - 1 && (
                        <View
                          style={{
                            flex: 1,
                            height: 3,
                            borderRadius: 2,
                            backgroundColor:
                              index < currentStep
                                ? C.primary
                                : C.border,
                          }}
                        />
                      )}
                    </View>

                    <Text
                      style={{
                        marginTop: 6,
                        fontSize: 10,
                        textAlign: "center",
                        color: done ? C.primary : C.gray,
                        fontWeight: done ? "800" : "500",
                      }}
                    >
                      {step.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Order items */}
        <View style={[card, { marginBottom: 14 }]}>
          <Text style={sectionTitle}>🛍️ Order Items</Text>

          {(order.items || []).map((item, index) => {
            const imgUrl = getImageUrl(item.productImage);

            return (
              <View
                key={`${item.productId}-${index}`}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  borderBottomWidth:
                    index < order.items.length - 1 ? 1 : 0,
                  borderBottomColor: C.border,
                }}
              >
                {/* Product image */}
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    backgroundColor: C.primarySf,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 14,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: C.border,
                  }}
                >
                  {imgUrl ? (
                    <Image
                      source={{ uri: imgUrl }}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={{ fontSize: 26 }}>🥬</Text>
                  )}
                </View>

                {/* Product details */}
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "700",
                      color: C.slate,
                    }}
                  >
                    {item.productName}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 3,
                      flexWrap: "wrap",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: C.primaryMd,
                        paddingHorizontal: 7,
                        paddingVertical: 2,
                        borderRadius: 6,
                        marginRight: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: "700",
                          color: C.primaryDk,
                        }}
                      >
                        {item.quantity}× {item.unit}
                      </Text>
                    </View>

                    <Text
                      style={{
                        fontSize: 11,
                        color: C.gray,
                      }}
                    >
                      Rs.{Number(item.price || 0).toFixed(2)} each
                    </Text>
                  </View>
                </View>

                {/* Item total */}
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "800",
                    color: C.slate,
                    marginLeft: 6,
                  }}
                >
                  Rs.{Number(item.lineTotal || 0).toFixed(2)}
                </Text>
              </View>
            );
          })}

          {/* Price summary */}
          <View
            style={{
              marginTop: 14,
              paddingTop: 14,
              borderTopWidth: 1,
              borderTopColor: C.border,
            }}
          >
            <Row
              label="Subtotal"
              value={`Rs.${Number(order.itemsTotal || 0).toFixed(2)}`}
            />

            <Row
              label="Delivery Fee"
              value={`Rs.${Number(order.deliveryFee || 0).toFixed(2)}`}
            />

            <View
              style={{
                borderTopWidth: 1.5,
                borderTopColor: C.border,
                marginTop: 8,
                paddingTop: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "800",
                    color: C.slate,
                  }}
                >
                  Total
                </Text>

                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "900",
                    color: C.primary,
                  }}
                >
                  Rs.{Number(order.totalAmount || 0).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Customer details */}
        <View style={[card, { marginBottom: 14 }]}>
          <Text style={sectionTitle}>👤 Customer Details</Text>

          <InfoRow
            icon="👤"
            label="Name"
            value={order.customerName || "Not provided"}
          />

          <InfoRow
            icon="📞"
            label="Phone"
            value={order.customerPhone || "Not provided"}
          />

          <InfoRow
            icon="📍"
            label="Address"
            value={order.customerAddress || "Not provided"}
          />

          <TouchableOpacity
            style={{
              marginTop: 12,
              height: 46,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: C.primary,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
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
            <Text style={{ fontSize: 16 }}>💬</Text>

            <Text
              style={{
                color: C.primary,
                fontWeight: "800",
                fontSize: 14,
              }}
            >
              Message Customer
            </Text>
          </TouchableOpacity>
        </View>

        {/* Order information */}
        <View style={[card, { marginBottom: 14 }]}>
          <Text style={sectionTitle}>📋 Order Info</Text>

          <InfoRow
            icon="🆔"
            label="Order ID"
            value={`#${order.orderNumber}`}
          />

          <InfoRow
            icon="💳"
            label="Payment"
            value={order.paymentMethod || "Cash on Delivery"}
          />

          <InfoRow
            icon="📅"
            label="Placed at"
            value={formatDate(order.createdAt)}
          />

          {order.updatedAt &&
            order.updatedAt !== order.createdAt && (
              <InfoRow
                icon="🔄"
                label="Last updated"
                value={formatDate(order.updatedAt)}
              />
            )}
        </View>
      </ScrollView>

      {/* Sticky footer actions */}
      {(action ||
        canCancel ||
        order.status === "completed" ||
        order.status === "cancelled") && (
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: C.white,
            padding: 16,
            paddingBottom: 28,
            borderTopWidth: 1,
            borderTopColor: C.border,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 12,
          }}
        >
          {action && (
            <TouchableOpacity
              onPress={action.onPress}
              disabled={updating}
              style={{
                height: 54,
                borderRadius: 16,
                backgroundColor: updating
                  ? "#94A3B8"
                  : action.color,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: action.color,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.35,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <Text
                style={{
                  color: C.white,
                  fontWeight: "900",
                  fontSize: 16,
                  letterSpacing: 0.3,
                }}
              >
                {updating ? "Updating..." : action.label}
              </Text>
            </TouchableOpacity>
          )}

          {(order.status === "completed" ||
            order.status === "cancelled") && (
            <TouchableOpacity
              onPress={handleRemoveOrder}
              disabled={updating}
              style={{
                height: 52,
                borderRadius: 16,
                backgroundColor: C.red,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: C.red,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.35,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text
                style={{
                  color: C.white,
                  fontWeight: "900",
                  fontSize: 16,
                }}
              >
                {updating ? "Removing..." : "🗑️ Remove Order"}
              </Text>
            </TouchableOpacity>
          )}

          {canCancel && (
            <TouchableOpacity
              onPress={() => setCancelVisible(true)}
              style={{
                marginTop: 10,
                alignItems: "center",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  color: C.red,
                  fontWeight: "700",
                  fontSize: 14,
                }}
              >
                ✕ Reject / Cancel Order
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Reject order modal */}
      <Modal
        visible={cancelVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCancelVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(15,23,42,0.6)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: C.white,
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              padding: 22,
              paddingBottom: 36,
              maxHeight: "90%",
            }}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Modal handle */}
              <View
                style={{
                  width: 40,
                  height: 4,
                  backgroundColor: C.border,
                  borderRadius: 2,
                  alignSelf: "center",
                  marginBottom: 16,
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "900",
                    color: C.slate,
                  }}
                >
                  ✕ Reject Order
                </Text>

                <TouchableOpacity
                  onPress={() => setCancelVisible(false)}
                >
                  <Text style={{ fontSize: 18, color: C.gray }}>
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  fontSize: 13,
                  color: C.gray,
                  marginBottom: 16,
                }}
              >
                Select a reason — this will be sent to the customer.
              </Text>

              {CANCEL_REASONS.map((reason) => {
                const sel = selectedReason === reason;

                return (
                  <TouchableOpacity
                    key={reason}
                    onPress={() => setSelectedReason(reason)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 13,
                      paddingHorizontal: 14,
                      marginBottom: 8,
                      borderRadius: 12,
                      borderWidth: 1.5,
                      borderColor: sel ? C.primary : C.border,
                      backgroundColor: sel
                        ? C.primarySf
                        : C.white,
                    }}
                  >
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        borderWidth: 2,
                        borderColor: sel ? C.primary : C.gray,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                      }}
                    >
                      {sel && (
                        <View
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: C.primary,
                          }}
                        />
                      )}
                    </View>

                    <Text
                      style={{
                        fontSize: 14,
                        color: sel ? C.primaryDk : C.slate,
                        fontWeight: sel ? "700" : "500",
                        flex: 1,
                      }}
                    >
                      {reason}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              {selectedReason === "Other / Custom reason" && (
                <TextInput
                  style={{
                    height: 80,
                    borderWidth: 1.5,
                    borderColor: C.primary,
                    borderRadius: 12,
                    paddingHorizontal: 14,
                    paddingTop: 12,
                    marginBottom: 8,
                    fontSize: 14,
                    color: C.slate,
                    backgroundColor: C.primarySf,
                    textAlignVertical: "top",
                  }}
                  placeholder="Describe the reason..."
                  placeholderTextColor="#94A3B8"
                  value={customReason}
                  onChangeText={setCustomReason}
                  multiline
                />
              )}

              <TouchableOpacity
                onPress={confirmCancel}
                disabled={updating}
                style={{
                  height: 52,
                  borderRadius: 14,
                  backgroundColor: updating
                    ? "#94A3B8"
                    : C.red,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 8,
                  shadowColor: C.red,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.35,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Text
                  style={{
                    color: C.white,
                    fontWeight: "900",
                    fontSize: 15,
                  }}
                >
                  {updating ? "Processing..." : "Confirm Rejection"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setCancelVisible(false)}
                style={{
                  marginTop: 12,
                  alignItems: "center",
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={{
                    color: C.gray,
                    fontWeight: "700",
                    fontSize: 14,
                  }}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Reusable card style
const card = {
  backgroundColor: "#FFFFFF",
  borderRadius: 20,
  padding: 18,
  borderWidth: 1,
  borderColor: "#E2E8F0",
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.06,
  shadowRadius: 10,
  elevation: 3,
};

// Section heading style
const sectionTitle = {
  fontSize: 15,
  fontWeight: "800",
  color: "#0F172A",
  marginBottom: 14,
  letterSpacing: 0.2,
};

// Reusable row component
function Row({ label, value }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
      }}
    >
      <Text style={{ fontSize: 13, color: "#64748B" }}>
        {label}
      </Text>

      <Text
        style={{
          fontSize: 13,
          color: "#334155",
          fontWeight: "600",
        }}
      >
        {value}
      </Text>
    </View>
  );
}

// Reusable customer information component
function InfoRow({ icon, label, value }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 12,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: "#F0FDF4",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
          flexShrink: 0,
        }}
      >
        <Text style={{ fontSize: 16 }}>{icon}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 11,
            color: "#94A3B8",
            fontWeight: "600",
            marginBottom: 1,
          }}
        >
          {label}
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: "#0F172A",
            fontWeight: "600",
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}
