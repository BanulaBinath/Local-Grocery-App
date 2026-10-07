import { useEffect, useState, useRef } from "react";

import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";

import { API_URL } from "../../constants/api";
import styles from "./CustomerStaffMessages.styles";

export default function CustomerStaffMessages() {
  const params = useLocalSearchParams();
  const flatListRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [staffId, setStaffId] = useState(null);

  const activeChat = conversations.find((c) => c.id === activeChatId);

  const loadStaffData = async () => {
    try {
      const staffData = await AsyncStorage.getItem("customerStaff");
      if (staffData) {
        const staff = JSON.parse(staffData);
        setStaffId(staff.id || staff._id);
      }
    } catch (err) {
      console.log("Load staff data error:", err);
    }
  };

  const fetchConversations = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const res = await fetch(`${API_URL}/api/messages/staff-conversations`);
      const data = await res.json();
      if (res.ok && data.conversations) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.log("Fetch staff conversations error:", error);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    loadStaffData();
    fetchConversations();

    const interval = setInterval(() => {
      fetchConversations(true);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Auto-select chat if passed via params, or create dynamic thread if no previous message exists
  useEffect(() => {
    if ((params.orderNumber || params.customerName) && !loading) {
      const targetOrder = params.orderNumber ? String(params.orderNumber) : null;
      const targetName = params.customerName ? String(params.customerName).toLowerCase() : null;

      const exists = conversations.find(
        (c) =>
          (targetOrder && String(c.orderNumber) === targetOrder) ||
          (targetName && c.customerName?.toLowerCase() === targetName)
      );

      if (exists) {
        setActiveChatId(exists.id);
      } else if (params.customerName || params.orderNumber) {
        const tempId = `temp_${params.orderNumber || params.customerName}`;
        const newChat = {
          id: tempId,
          customerId: params.customerId || "temp_customer",
          customerName: params.customerName || (params.orderNumber ? `Customer #${params.orderNumber}` : "Customer"),
          orderNumber: params.orderNumber ? String(params.orderNumber) : "",
          avatarText: "👤",
          messages: [],
        };
        setConversations((prev) => {
          if (prev.some((c) => c.id === tempId)) return prev;
          return [newChat, ...prev];
        });
        setActiveChatId(tempId);
      }
    }
  }, [params, conversations, loading]);

  const sendMessage = async () => {
    if (!input.trim() || !activeChatId || !activeChat) return;

    const textToSend = input.trim();
    setInput("");

    // Optimistic update
    const newMsg = {
      id: String(Date.now()),
      text: textToSend,
      fromStaff: true,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setConversations((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMsg],
          };
        }
        return chat;
      })
    );

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: staffId || "650000000000000000000001",
          senderRole: "customer_staff",
          receiverId: activeChat.customerId,
          receiverRole: "customer",
          message: textToSend,
        }),
      });

      fetchConversations(true);
    } catch (error) {
      console.log("Send message error:", error);
    }
  };

  const handleBack = () => {
    if (activeChatId) {
      // If we navigated directly from another screen with orderNumber or customerName, go back to previous screen safely
      if (params.orderNumber || params.customerName) {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace("/customer-staff-dashboard");
        }
      } else {
        // Otherwise switch back to the Inbox list view
        setActiveChatId(null);
      }
    } else {
      // On Inbox list view: safely go back to previous screen or dashboard
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/customer-staff-dashboard");
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>
              {activeChatId ? activeChat?.customerName : "Staff Inbox"}
            </Text>
            <Text style={styles.headerSubtitle}>
              {activeChatId
                ? activeChat?.orderNumber
                  ? `Order #${activeChat.orderNumber}`
                  : "Customer Conversation"
                : "Customer Inquiries & Order Rejection Threads"}
            </Text>
          </View>

          {activeChatId ? (
            <TouchableOpacity
              style={styles.inboxSwitchButton}
              onPress={() => setActiveChatId(null)}
            >
              <Text style={styles.inboxSwitchText}>📥 Inbox</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.headerSpace} />
          )}
        </View>

        {/* Body View */}
        {loading && conversations.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#1E3A8A" />
            <Text style={{ marginTop: 10, color: "#64748B" }}>Loading inbox...</Text>
          </View>
        ) : !activeChatId ? (
          // ==============================
          // 1. INBOX LIST VIEW
          // ==============================
          <ScrollView contentContainerStyle={styles.listContainer}>
            {conversations.length === 0 ? (
              <View style={{ alignItems: "center", paddingVertical: 40 }}>
                <Text style={{ fontSize: 36, marginBottom: 10 }}>💬</Text>
                <Text style={{ fontSize: 16, fontWeight: "700", color: "#1E293B" }}>
                  No Conversations
                </Text>
                <Text style={{ fontSize: 13, color: "#64748B", marginTop: 4, textAlign: "center" }}>
                  When orders are rejected or customers reach out, message threads will appear here.
                </Text>
              </View>
            ) : (
              conversations.map((chat) => {
                const lastMessage = chat.messages[chat.messages.length - 1];
                return (
                  <TouchableOpacity
                    key={chat.id}
                    style={styles.inboxCard}
                    onPress={() => setActiveChatId(chat.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.avatarBox}>
                      <Text style={styles.avatarText}>{chat.avatarText || "👤"}</Text>
                    </View>
                    <View style={styles.inboxContent}>
                      <View style={styles.inboxHeaderRow}>
                        <Text style={styles.inboxName}>{chat.customerName}</Text>
                        <Text style={styles.inboxTime}>{lastMessage?.time}</Text>
                      </View>
                      <View style={styles.inboxLastMsgRow}>
                        <Text style={styles.inboxLastMsg} numberOfLines={1}>
                          {lastMessage?.fromStaff ? "You: " : ""}
                          {lastMessage?.text}
                        </Text>
                        {chat.orderNumber ? (
                          <View style={styles.inboxOrderBadge}>
                            <Text style={styles.inboxOrderText}>
                              #{chat.orderNumber}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        ) : (
          // ==============================
          // 2. CHAT VIEW
          // ==============================
          <View style={{ flex: 1 }}>
            <FlatList
              ref={flatListRef}
              data={activeChat?.messages || []}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.chatList}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              onLayout={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.bubble,
                    item.fromStaff
                      ? styles.staffBubble
                      : styles.customerBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.bubbleText,
                      item.fromStaff
                        ? styles.staffBubbleText
                        : styles.customerBubbleText,
                    ]}
                  >
                    {item.text}
                  </Text>
                  <Text
                    style={[
                      styles.timeText,
                      item.fromStaff
                        ? styles.timeTextStaff
                        : styles.timeTextCustomer,
                    ]}
                  >
                    {item.time}
                  </Text>
                </View>
              )}
            />

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Message customer..."
                placeholderTextColor="#94A3B8"
                value={input}
                onChangeText={setInput}
                multiline
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={sendMessage}
              >
                <Text style={styles.sendButtonText}>➤</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Bottom Navigation */}
        {!activeChatId && (
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
              <Text style={styles.navIcon}>💬</Text>
              <Text style={styles.navLabelActive}>Messages</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => router.push("/customer-staff-profile")}
            >
              <Text style={styles.navIcon}>👤</Text>
              <Text style={styles.navLabel}>Profile</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

