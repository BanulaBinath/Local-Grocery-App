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

import styles from "./SupplierMessages.styles";

export default function SupplierMessages() {
  const [supplier, setSupplier] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  // ========================================
  // NAVIGATION
  // ========================================

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

  // ========================================
  // LOAD LOGGED-IN SUPPLIER
  // ========================================

  const loadSupplier = async () => {
    try {
      const storedSupplier = await AsyncStorage.getItem("supplier");

      if (!storedSupplier) {
        Alert.alert("Error", "Supplier information not found.");

        return null;
      }

      const supplierData = JSON.parse(storedSupplier);

      setSupplier(supplierData);

      return supplierData;
    } catch (error) {
      console.log("Load supplier error:", error);

      Alert.alert("Error", "Could not load supplier information.");

      return null;
    }
  };

  // ========================================
  // LOAD SUPPLIER STAFF
  // ========================================

  const fetchStaff = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/staff/supplier`);

      const data = await response.json();

      console.log("Supplier staff response:", data);

      if (response.ok) {
        setStaffList(data.staff || []);
      } else {
        Alert.alert("Error", data.message || "Could not load supplier staff.");
      }
    } catch (error) {
      console.log("Fetch supplier staff error:", error);

      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOAD MESSAGES
  // ========================================

  const loadMessages = async (staff) => {
    try {
      if (!supplier || !staff) {
        return;
      }

      const supplierId = supplier._id || supplier.id;

      const staffId = staff._id || staff.id;

      setLoadingMessages(true);

      const url =
        `${API_URL}/api/messages/conversation` +
        `?userId=${supplierId}` +
        `&userRole=supplier` +
        `&otherUserId=${staffId}` +
        `&otherUserRole=supplier_staff`;

      console.log("Loading supplier conversation:", url);

      const response = await fetch(url);

      const data = await response.json();

      console.log("Conversation response:", data);

      if (response.ok) {
        setMessages(data.messages || []);
      } else {
        Alert.alert("Error", data.message || "Could not load messages.");
      }
    } catch (error) {
      console.log("Load messages error:", error);

      Alert.alert("Error", "Could not load conversation.");
    } finally {
      setLoadingMessages(false);
    }
  };

  // ========================================
  // INITIAL LOAD
  // ========================================

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const supplierData = await loadSupplier();

        if (supplierData) {
          await fetchStaff();
        }
      };

      loadData();
    }, []),
  );

  // ========================================
  // SELECT STAFF
  // ========================================

  const handleStaffPress = async (staff) => {
    setSelectedStaff(staff);
    setMessages([]);

    await loadMessages(staff);
  };

  // ========================================
  // SEND MESSAGE
  // ========================================

  const handleSend = async () => {
    if (!message.trim()) {
      return;
    }

    if (!supplier || !selectedStaff) {
      return;
    }

    try {
      setSending(true);

      const supplierId = supplier._id || supplier.id;

      const staffId = selectedStaff._id || selectedStaff.id;

      const response = await fetch(`${API_URL}/api/messages`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          senderId: supplierId,
          senderRole: "supplier",

          receiverId: staffId,
          receiverRole: "supplier_staff",

          message: message.trim(),
        }),
      });

      const data = await response.json();

      console.log("Send message response:", data);

      if (response.ok) {
        setMessage("");

        await loadMessages(selectedStaff);
      } else {
        Alert.alert("Error", data.message || "Message could not be sent.");
      }
    } catch (error) {
      console.log("Send message error:", error);

      Alert.alert("Connection Error", "Could not send message.");
    } finally {
      setSending(false);
    }
  };

  // ========================================
  // FORMAT MESSAGE TIME
  // ========================================

  const formatTime = (dateValue) => {
    if (!dateValue) {
      return "";
    }

    const date = new Date(dateValue);

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ========================================
  // CHAT SCREEN
  // ========================================

  if (selectedStaff) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* CHAT HEADER */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setSelectedStaff(null);
                setMessages([]);
              }}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.chatHeaderInfo}>
              <Text style={styles.headerTitle}>
                {selectedStaff.fullName || "Staff"}
              </Text>

              <Text style={styles.headerSubtitle}>Supplier Staff</Text>
            </View>

            <TouchableOpacity
              style={styles.profileButton}
              onPress={handleProfile}
              activeOpacity={0.8}
            >
              <Text style={styles.profileIcon}>👤</Text>
            </TouchableOpacity>
          </View>

          {/* MESSAGES */}
          {loadingMessages ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color="#1E3A8A" />

              <Text style={styles.loadingText}>Loading messages...</Text>
            </View>
          ) : (
            <ScrollView
              style={styles.messageList}
              contentContainerStyle={styles.messageContent}
              showsVerticalScrollIndicator={false}
            >
              {messages.length === 0 ? (
                <View style={styles.emptyChatContainer}>
                  <Text style={styles.emptyChatIcon}>💬</Text>

                  <Text style={styles.emptyChatTitle}>No Messages Yet</Text>

                  <Text style={styles.emptyChatText}>
                    Start a conversation with this staff member.
                  </Text>
                </View>
              ) : (
                messages.map((item) => {
                  const isSent = item.senderRole === "supplier";

                  return (
                    <View
                      key={item._id}
                      style={[
                        styles.messageRow,
                        isSent ? styles.sentRow : styles.receivedRow,
                      ]}
                    >
                      <View
                        style={[
                          styles.messageBubble,
                          isSent ? styles.sentBubble : styles.receivedBubble,
                        ]}
                      >
                        <Text
                          style={[
                            styles.messageText,
                            isSent ? styles.sentText : styles.receivedText,
                          ]}
                        >
                          {item.message}
                        </Text>

                        <Text
                          style={[
                            styles.messageTime,
                            isSent ? styles.sentTime : styles.receivedTime,
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
            />

            <TouchableOpacity
              style={[styles.sendButton, sending && styles.sendButtonDisabled]}
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

  // ========================================
  // STAFF LIST SCREEN
  // ========================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Messages</Text>

            <Text style={styles.headerSubtitle}>
              Select staff to start a conversation
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
        </View>

        {/* STAFF LIST */}
        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#1E3A8A" />

            <Text style={styles.loadingText}>Loading staff...</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.staffList}
          >
            {staffList.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>👤</Text>

                <Text style={styles.emptyTitle}>No Staff Available</Text>

                <Text style={styles.emptyText}>
                  There are currently no supplier staff accounts.
                </Text>
              </View>
            ) : (
              staffList.map((staff) => (
                <TouchableOpacity
                  key={staff._id}
                  style={styles.supplierCard}
                  onPress={() => handleStaffPress(staff)}
                >
                  <View style={styles.supplierAvatar}>
                    <Text style={styles.supplierAvatarText}>
                      {staff.fullName
                        ? staff.fullName.charAt(0).toUpperCase()
                        : "S"}
                    </Text>
                  </View>

                  <View style={styles.supplierInfo}>
                    <Text style={styles.supplierName}>
                      {staff.fullName || "Staff"}
                    </Text>

                    <Text style={styles.onlineText}>Supplier Staff</Text>
                  </View>

                  <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}

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

            <Text style={styles.navLabel}>Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={handleMessages}>
            <Text style={styles.navIcon}>💬</Text>

            <Text style={styles.navLabelActive}>Messages</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
