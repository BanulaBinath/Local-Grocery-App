import { useCallback, useState, useEffect, useRef } from "react";

import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
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
  const [customer, setCustomer] = useState(null);

  // Messaging modal state
  const [messagesModalVisible, setMessagesModalVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState("");
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const chatListRef = useRef(null);

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

      const cust = JSON.parse(customerData);
      setCustomer(cust);

      const response = await fetch(
        `${API_URL}/api/customer-orders/customer/${cust.id}`,
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

  const fetchMessages = async () => {
    if (!customer?.id) return;
    try {
      const res = await fetch(
        `${API_URL}/api/messages/customer-thread?customerId=${customer.id}`,
      );
      const data = await res.json();
      if (res.ok && data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.log("Fetch customer messages error:", err);
    }
  };

  const openMessagesModal = () => {
    setMessagesModalVisible(true);
    setLoadingMsgs(true);
    fetchMessages().finally(() => setLoadingMsgs(false));
  };

  useEffect(() => {
    let interval;
    if (messagesModalVisible && customer?.id) {
      interval = setInterval(() => {
        fetchMessages();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [messagesModalVisible, customer]);

  const sendMessageToStaff = async () => {
    if (!inputMsg.trim() || !customer?.id) return;

    const textToSend = inputMsg.trim();
    setInputMsg("");

    try {
      await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: customer.id,
          senderRole: "customer",
          receiverId: "650000000000000000000001",
          receiverRole: "customer_staff",
          message: textToSend,
        }),
      });

      fetchMessages();
    } catch (err) {
      console.log("Send customer message error:", err);
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

          <TouchableOpacity
            style={{
              backgroundColor: "#EFF6FF",
              borderColor: "#BFDBFE",
              borderWidth: 1,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
            }}
            onPress={openMessagesModal}
          >
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#1D4ED8" }}>
              💬 Messages
            </Text>
          </TouchableOpacity>
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
              const isCancelled = order.status === "cancelled";

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

                  {!isCancelled ? (
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
                    <View
                      style={{
                        backgroundColor: "#FEF2F2",
                        borderWidth: 1,
                        borderColor: "#FCA5A5",
                        borderRadius: 10,
                        padding: 12,
                        marginTop: 10,
                        marginBottom: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "800",
                          color: "#DC2626",
                        }}
                      >
                        🚫 Order Rejected by Staff
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#991B1B",
                          marginTop: 4,
                          lineHeight: 16,
                        }}
                      >
                        Reason: {order.cancelReason || "No reason provided"}
                      </Text>
                    </View>
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

        {/* ── Customer Messages Modal ── */}
        <Modal
          visible={messagesModalVisible}
          animationType="slide"
          onRequestClose={() => setMessagesModalVisible(false)}
        >
          <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              {/* Modal Header */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 16,
                  backgroundColor: "#FFFFFF",
                  borderBottomWidth: 1,
                  borderBottomColor: "#E2E8F0",
                }}
              >
                <TouchableOpacity
                  onPress={() => setMessagesModalVisible(false)}
                  style={{ padding: 4 }}
                >
                  <Text style={{ fontSize: 18, color: "#1E3A8A", fontWeight: "700" }}>
                    ✕ Close
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{ fontSize: 16, fontWeight: "800", color: "#0F172A" }}
                >
                  Staff Messages
                </Text>
                <View style={{ width: 40 }} />
              </View>

              {/* Chat Messages List */}
              {loadingMsgs ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator size="large" color="#1E3A8A" />
                </View>
              ) : messages.length === 0 ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 24,
                  }}
                >
                  <Text style={{ fontSize: 36, marginBottom: 8 }}>💬</Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#1E293B",
                    }}
                  >
                    No Messages Yet
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#64748B",
                      textAlign: "center",
                      marginTop: 4,
                    }}
                  >
                    Notifications or messages from staff regarding your orders
                    will appear here.
                  </Text>
                </View>
              ) : (
                <FlatList
                  ref={chatListRef}
                  data={messages}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={{ padding: 16 }}
                  onContentSizeChange={() =>
                    chatListRef.current?.scrollToEnd({ animated: true })
                  }
                  renderItem={({ item }) => (
                    <View
                      style={{
                        alignSelf: item.fromStaff ? "flex-start" : "flex-end",
                        backgroundColor: item.fromStaff ? "#F1F5F9" : "#1E3A8A",
                        borderRadius: 14,
                        padding: 12,
                        marginBottom: 10,
                        maxWidth: "82%",
                        borderWidth: item.fromStaff ? 1 : 0,
                        borderColor: "#CBD5E1",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: "700",
                          color: item.fromStaff ? "#1E293B" : "#93C5FD",
                          marginBottom: 2,
                        }}
                      >
                        {item.fromStaff ? "Customer Staff" : "You"}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: item.fromStaff ? "#0F172A" : "#FFFFFF",
                          lineHeight: 20,
                        }}
                      >
                        {item.text}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          color: item.fromStaff ? "#64748B" : "#DBEAFE",
                          alignSelf: "flex-end",
                          marginTop: 4,
                        }}
                      >
                        {item.time}
                      </Text>
                    </View>
                  )}
                />
              )}

              {/* Message Input Bar */}
              <View
                style={{
                  flexDirection: "row",
                  padding: 12,
                  backgroundColor: "#FFFFFF",
                  borderTopWidth: 1,
                  borderTopColor: "#E2E8F0",
                  alignItems: "center",
                }}
              >
                <TextInput
                  style={{
                    flex: 1,
                    backgroundColor: "#F1F5F9",
                    borderRadius: 20,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    fontSize: 14,
                    color: "#0F172A",
                    maxHeight: 100,
                  }}
                  placeholder="Reply to store staff..."
                  placeholderTextColor="#94A3B8"
                  value={inputMsg}
                  onChangeText={setInputMsg}
                  multiline
                />
                <TouchableOpacity
                  style={{
                    backgroundColor: "#1E3A8A",
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: 8,
                  }}
                  onPress={sendMessageToStaff}
                >
                  <Text style={{ color: "#FFFFFF", fontWeight: "800", fontSize: 16 }}>
                    ➤
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
