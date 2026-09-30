import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Alert,
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

import styles from "./SupplierStaffMessages.styles";

export default function SupplierStaffMessages() {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [staff, setStaff] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [sending, setSending] = useState(false);

  // --------------------------------------------------
  // LOAD LOGGED-IN STAFF
  // --------------------------------------------------

  const loadStaff = async () => {
    try {
      const storedStaff = await AsyncStorage.getItem("supplierStaff");

      if (!storedStaff) {
        Alert.alert("Error", "Supplier staff information not found.");

        return null;
      }

      const staffData = JSON.parse(storedStaff);

      setStaff(staffData);

      return staffData;
    } catch (error) {
      console.error("Load staff error:", error);

      Alert.alert("Error", "Failed to load staff information.");

      return null;
    }
  };

  // --------------------------------------------------
  // LOAD SUPPLIERS
  // --------------------------------------------------

  const fetchSuppliers = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/suppliers`);

      const data = await response.json();

      console.log("Suppliers response:", data);

      if (!response.ok) {
        Alert.alert("Error", data.message || "Could not load suppliers.");

        return;
      }

      setSuppliers(data.suppliers || data || []);
    } catch (error) {
      console.error("Fetch suppliers error:", error);

      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useFocusEffect(
    useCallback(() => {
      loadStaff();
      fetchSuppliers();
    }, []),
  );

  // --------------------------------------------------
  // LOAD CONVERSATION
  // --------------------------------------------------

  const loadMessages = async (supplier) => {
    if (!staff) {
      return;
    }

    const staffId = staff._id || staff.id;

    const supplierId = supplier?._id;

    if (!staffId) {
      Alert.alert("Error", "Supplier staff ID not found.");

      return;
    }

    if (!supplierId) {
      Alert.alert("Error", "Supplier ID not found.");

      return;
    }

    try {
      setLoadingMessages(true);

      const url =
        `${API_URL}/api/messages/conversation` +
        `?userId=${encodeURIComponent(staffId)}` +
        `&userRole=supplier_staff` +
        `&otherUserId=${encodeURIComponent(supplierId)}` +
        `&otherUserRole=supplier`;

      console.log("Loading conversation:", url);

      const response = await fetch(url);

      const data = await response.json();

      console.log("Conversation response:", data);

      if (!response.ok) {
        Alert.alert("Error", data.message || "Failed to load messages.");

        return;
      }

      setMessages(data.messages || []);
    } catch (error) {
      console.error("Load messages error:", error);

      Alert.alert("Connection Error", "Could not load messages.");
    } finally {
      setLoadingMessages(false);
    }
  };

  // --------------------------------------------------
  // SELECT SUPPLIER
  // --------------------------------------------------

  const handleSupplierPress = async (supplier) => {
    setSelectedSupplier(supplier);
    setMessages([]);

    await loadMessages(supplier);
  };

  // --------------------------------------------------
  // SEND MESSAGE
  // --------------------------------------------------

  const handleSend = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    if (sending) {
      return;
    }

    if (!selectedSupplier) {
      Alert.alert(
        "Select Supplier",
        "Please select a supplier before sending a message.",
      );

      return;
    }

    if (!staff) {
      Alert.alert("Error", "Staff information not available.");

      return;
    }

    const staffId = staff._id || staff.id;

    const supplierId = selectedSupplier._id;

    if (!staffId) {
      Alert.alert("Error", "Supplier staff ID not found.");

      return;
    }

    if (!supplierId) {
      Alert.alert("Error", "Supplier ID not found.");

      return;
    }

    try {
      setSending(true);

      const response = await fetch(`${API_URL}/api/messages`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          senderId: staffId,

          senderRole: "supplier_staff",

          receiverId: supplierId,

          receiverRole: "supplier",

          message: trimmedMessage,
        }),
      });

      const data = await response.json();

      console.log("Send message response:", data);

      if (!response.ok) {
        Alert.alert("Error", data.message || "Failed to send message.");

        return;
      }

      setMessage("");

      await loadMessages(selectedSupplier);
    } catch (error) {
      console.error("Send message error:", error);

      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setSending(false);
    }
  };

  // --------------------------------------------------
  // FORMAT TIME
  // --------------------------------------------------

  const formatTime = (createdAt) => {
    if (!createdAt) {
      return "";
    }

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --------------------------------------------------
  // BACK TO SUPPLIER LIST
  // --------------------------------------------------

  const handleBackToSuppliers = () => {
    setSelectedSupplier(null);
    setMessages([]);
    setMessage("");
  };

  // ==================================================
  // SUPPLIER LIST
  // ==================================================

  if (!selectedSupplier) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* HEADER */}

          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View>
              <Text style={styles.headerTitle}>Messages</Text>

              <Text style={styles.headerSubtitle}>
                Select a supplier to start chatting
              </Text>
            </View>
          </View>

          {/* SUPPLIER LIST */}

          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#1E3A8A" />

              <Text
                style={{
                  marginTop: 12,
                  color: "#6B7280",
                }}
              >
                Loading suppliers...
              </Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {suppliers.length === 0 ? (
                <View
                  style={{
                    alignItems: "center",
                    marginTop: 60,
                    paddingHorizontal: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 40,
                    }}
                  >
                    🏪
                  </Text>

                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: "#111827",
                      marginTop: 12,
                    }}
                  >
                    No Suppliers Available
                  </Text>

                  <Text
                    style={{
                      fontSize: 14,
                      color: "#6B7280",
                      textAlign: "center",
                      marginTop: 6,
                    }}
                  >
                    There are currently no approved suppliers.
                  </Text>
                </View>
              ) : (
                suppliers.map((supplier) => {
                  const name =
                    supplier.businessName || supplier.fullName || "Supplier";

                  return (
                    <TouchableOpacity
                      key={supplier._id}
                      style={styles.supplierCard}
                      onPress={() => handleSupplierPress(supplier)}
                    >
                      <View style={styles.supplierAvatar}>
                        <Text style={styles.supplierAvatarText}>
                          {name.charAt(0).toUpperCase()}
                        </Text>
                      </View>

                      <View style={styles.supplierInfo}>
                        <Text style={styles.supplierName}>{name}</Text>

                        <Text style={styles.onlineText}>● Supplier</Text>
                      </View>

                      <Text
                        style={{
                          marginLeft: "auto",
                          fontSize: 28,
                          color: "#1E3A8A",
                        }}
                      >
                        ›
                      </Text>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // ==================================================
  // CHAT SCREEN
  // ==================================================

  const selectedName =
    selectedSupplier.businessName || selectedSupplier.fullName || "Supplier";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToSuppliers}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View>
            <Text style={styles.headerTitle}>Messages</Text>

            <Text style={styles.headerSubtitle}>Chat with supplier</Text>
          </View>
        </View>

        {/* SELECTED SUPPLIER */}

        <View style={styles.supplierCard}>
          <View style={styles.supplierAvatar}>
            <Text style={styles.supplierAvatarText}>
              {selectedName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={styles.supplierInfo}>
            <Text style={styles.supplierName}>{selectedName}</Text>

            <Text style={styles.onlineText}>● Supplier</Text>
          </View>
        </View>

        {/* MESSAGES */}

        {loadingMessages ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#1E3A8A" />

            <Text
              style={{
                marginTop: 12,
                color: "#6B7280",
              }}
            >
              Loading messages...
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.messageList}
            contentContainerStyle={styles.messageContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.length === 0 ? (
              <View
                style={{
                  alignItems: "center",
                  marginTop: 40,
                  paddingHorizontal: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: "#6B7280",
                  }}
                >
                  No messages yet.
                </Text>

                <Text
                  style={{
                    marginTop: 6,
                    fontSize: 13,
                    color: "#9CA3AF",
                    textAlign: "center",
                  }}
                >
                  Start a conversation with this supplier.
                </Text>
              </View>
            ) : (
              messages.map((item) => {
                const isReceived = item.senderRole !== "supplier_staff";

                return (
                  <View
                    key={item._id}
                    style={[
                      styles.messageRow,

                      isReceived ? styles.receivedRow : styles.sentRow,
                    ]}
                  >
                    <View
                      style={[
                        styles.messageBubble,

                        isReceived ? styles.receivedBubble : styles.sentBubble,
                      ]}
                    >
                      <Text
                        style={[
                          styles.messageText,

                          isReceived ? styles.receivedText : styles.sentText,
                        ]}
                      >
                        {item.message}
                      </Text>

                      <Text
                        style={[
                          styles.messageTime,

                          isReceived ? styles.receivedTime : styles.sentTime,
                        ]}
                      >
                        {formatTime(item.createdAt)}
                      </Text>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        )}

        {/* MESSAGE INPUT */}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            multiline
            editable={!sending}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              sending && {
                opacity: 0.5,
              },
            ]}
            onPress={handleSend}
            disabled={sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.sendButtonText}>➤</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
