import { useEffect, useState, useRef, useCallback } from "react";
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
  RefreshControl,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";

import { API_URL } from "../../constants/api";
import styles from "./CustomerStaffMessages.styles";

export default function CustomerStaffMessages() {
  const params = useLocalSearchParams();
  const flatListRef = useRef(null);

  // Tab: "messages" | "feedback"
  const [activeTab, setActiveTab] = useState("messages");

  // Messages state
  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [staffId, setStaffId] = useState(null);

  // Feedbacks state
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const [refreshingFeedbacks, setRefreshingFeedbacks] = useState(false);
  const [ratingFilter, setRatingFilter] = useState("all");

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

  const fetchFeedbacks = async (isSilent = false) => {
    try {
      if (!isSilent) setLoadingFeedbacks(true);
      const res = await fetch(`${API_URL}/api/feedback`);
      let data = {};
      try {
        data = await res.json();
      } catch (e) {
        console.log("Parse feedback error:", e);
      }
      if (res.ok && (data.feedback || data.feedbacks)) {
        setFeedbacks(data.feedback || data.feedbacks || []);
      }
    } catch (error) {
      console.log("Fetch feedbacks error:", error);
    } finally {
      if (!isSilent) setLoadingFeedbacks(false);
      setRefreshingFeedbacks(false);
    }
  };

  useEffect(() => {
    loadStaffData();
    fetchConversations();
    fetchFeedbacks();

    // Auto-sync polling every 3.5 seconds
    const interval = setInterval(() => {
      fetchConversations(true);
      fetchFeedbacks(true);
    }, 3500);

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
        setActiveTab("messages");
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
        setActiveTab("messages");
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
      if (params.orderNumber || params.customerName) {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace("/customer-staff-dashboard");
        }
      } else {
        setActiveChatId(null);
      }
    } else if (activeTab === "feedback") {
      setActiveTab("messages");
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/customer-staff-dashboard");
      }
    }
  };

  const handleChatWithCustomer = (feedbackItem) => {
    if (!feedbackItem) return;
    const custId = feedbackItem.customerId;
    const custName = feedbackItem.customerName || "Customer";

    const existingChat = conversations.find(
      (c) =>
        (custId && String(c.customerId) === String(custId)) ||
        c.customerName?.toLowerCase() === custName.toLowerCase()
    );

    if (existingChat) {
      setActiveTab("messages");
      setActiveChatId(existingChat.id);
    } else {
      const tempId = `temp_${custId || Date.now()}`;
      const newChat = {
        id: tempId,
        customerId: custId || "temp_customer",
        customerName: custName,
        orderNumber: "",
        avatarText: "👤",
        messages: [],
      };
      setConversations((prev) => [newChat, ...prev]);
      setActiveTab("messages");
      setActiveChatId(tempId);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "Recently";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filtered feedback list
  const filteredFeedbacks = feedbacks.filter((item) => {
    if (ratingFilter === "all") return true;
    return item.rating === Number(ratingFilter);
  });

  // Calculate statistics
  const ratedFeedbacks = feedbacks.filter((f) => f.rating != null && f.rating > 0);
  const avgRating =
    ratedFeedbacks.length > 0
      ? (
          ratedFeedbacks.reduce((acc, f) => acc + Number(f.rating), 0) /
          ratedFeedbacks.length
        ).toFixed(1)
      : "5.0";

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* ============================== */}
        {/* HEADER */}
        {/* ============================== */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>
              {activeChatId
                ? activeChat?.customerName
                : activeTab === "feedback"
                ? "Customer Feedback"
                : "Staff Inbox"}
            </Text>
            <Text style={styles.headerSubtitle}>
              {activeChatId
                ? activeChat?.orderNumber
                  ? `Order #${activeChat.orderNumber}`
                  : "Customer Conversation"
                : activeTab === "feedback"
                ? "Customer Reviews & Ratings"
                : "Customer Inquiries & Order Threads"}
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
            // Dedicated Feedback Icon in Header
            <TouchableOpacity
              style={[
                styles.headerFeedbackButton,
                activeTab === "feedback" && styles.headerFeedbackButtonActive,
              ]}
              onPress={() =>
                setActiveTab(activeTab === "feedback" ? "messages" : "feedback")
              }
              activeOpacity={0.7}
            >
              <Text style={styles.headerFeedbackIcon}>⭐</Text>
              <Text
                style={[
                  styles.headerFeedbackText,
                  activeTab === "feedback" && styles.headerFeedbackTextActive,
                ]}
              >
                Feedback
              </Text>
              {feedbacks.length > 0 && (
                <View style={styles.headerFeedbackBadge}>
                  <Text style={styles.headerFeedbackBadgeText}>
                    {feedbacks.length > 99 ? "99+" : feedbacks.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* ============================== */}
        {/* SEGMENTED TAB SWITCHER */}
        {/* ============================== */}
        {!activeChatId && (
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === "messages" && styles.tabItemActive,
              ]}
              onPress={() => setActiveTab("messages")}
              activeOpacity={0.8}
            >
              <Text style={styles.headerFeedbackIcon}>💬</Text>
              <Text
                style={[
                  styles.tabItemText,
                  activeTab === "messages" && styles.tabItemTextActive,
                ]}
              >
                Inquiries
              </Text>
              {conversations.length > 0 && (
                <View
                  style={[
                    styles.tabBadge,
                    activeTab === "messages" && styles.tabBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBadgeText,
                      activeTab === "messages" && styles.tabBadgeTextActive,
                    ]}
                  >
                    {conversations.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === "feedback" && styles.tabItemActive,
              ]}
              onPress={() => setActiveTab("feedback")}
              activeOpacity={0.8}
            >
              <Text style={styles.headerFeedbackIcon}>⭐</Text>
              <Text
                style={[
                  styles.tabItemText,
                  activeTab === "feedback" && styles.tabItemTextActive,
                ]}
              >
                Customer Feedback
              </Text>
              {feedbacks.length > 0 && (
                <View
                  style={[
                    styles.tabBadge,
                    activeTab === "feedback" && styles.tabBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBadgeText,
                      activeTab === "feedback" && styles.tabBadgeTextActive,
                    ]}
                  >
                    {feedbacks.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* ============================== */}
        {/* MAIN BODY CONTENT */}
        {/* ============================== */}
        {activeChatId ? (
          // ==============================
          // 1. ACTIVE CHAT VIEW
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
        ) : activeTab === "feedback" ? (
          // ==============================
          // 2. CUSTOMER FEEDBACK VIEW
          // ==============================
          <ScrollView
            contentContainerStyle={styles.feedbackContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshingFeedbacks}
                onRefresh={() => {
                  setRefreshingFeedbacks(true);
                  fetchFeedbacks();
                }}
                colors={["#2E7D32"]}
              />
            }
          >
            {/* Summary Card */}
            <View style={styles.feedbackSummaryCard}>
              <View style={styles.summaryLeft}>
                <Text style={styles.summaryTotalTitle}>Customer Reviews</Text>
                <Text style={styles.summaryTotalCount}>
                  {feedbacks.length} Total Submission{feedbacks.length !== 1 ? "s" : ""}
                </Text>
              </View>
              <View style={styles.summaryRight}>
                <Text style={styles.summaryAvgRating}>{avgRating}</Text>
                <Text style={styles.summaryStars}>
                  {"★".repeat(Math.round(Number(avgRating) || 5))}
                  {"☆".repeat(5 - Math.round(Number(avgRating) || 5))}
                </Text>
              </View>
            </View>

            {/* Rating Filter Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScroll}
            >
              {[
                { label: "All", value: "all" },
                { label: "5 ★", value: "5" },
                { label: "4 ★", value: "4" },
                { label: "3 ★", value: "3" },
                { label: "2 ★", value: "2" },
                { label: "1 ★", value: "1" },
              ].map((f) => {
                const isActive = ratingFilter === f.value;
                return (
                  <TouchableOpacity
                    key={f.value}
                    style={[
                      styles.filterChip,
                      isActive && styles.filterChipActive,
                    ]}
                    onPress={() => setRatingFilter(f.value)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        isActive && styles.filterChipTextActive,
                      ]}
                    >
                      {f.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Feedbacks List */}
            {loadingFeedbacks && feedbacks.length === 0 ? (
              <View style={{ alignItems: "center", paddingVertical: 40 }}>
                <ActivityIndicator size="large" color="#2E7D32" />
                <Text style={{ marginTop: 10, color: "#64748B" }}>
                  Loading customer feedback...
                </Text>
              </View>
            ) : filteredFeedbacks.length === 0 ? (
              <View style={styles.emptyFeedbackBox}>
                <Text style={styles.emptyFeedbackIcon}>📭</Text>
                <Text style={styles.emptyFeedbackTitle}>
                  {ratingFilter !== "all"
                    ? `No ${ratingFilter}-Star Feedback`
                    : "No Customer Feedback Yet"}
                </Text>
                <Text style={styles.emptyFeedbackText}>
                  When customers submit feedback and ratings from their app, it will appear here in real-time.
                </Text>
              </View>
            ) : (
              filteredFeedbacks.map((item) => {
                const initial = (item.customerName || "A")[0].toUpperCase();
                return (
                  <View key={item._id} style={styles.feedbackCard}>
                    {/* Header Row */}
                    <View style={styles.feedbackCardHeader}>
                      <View style={styles.feedbackAvatar}>
                        <Text style={styles.feedbackAvatarText}>{initial}</Text>
                      </View>
                      <View style={styles.feedbackHeaderMeta}>
                        <Text style={styles.feedbackCustomerName}>
                          {item.customerName || "Anonymous Customer"}
                        </Text>
                        {item.customerEmail ? (
                          <Text style={{ fontSize: 11, color: "#64748B", marginTop: 1 }}>
                            ✉️ {item.customerEmail}
                          </Text>
                        ) : null}
                        <Text style={styles.feedbackTime}>
                          {formatDate(item.createdAt)}
                        </Text>
                      </View>
                      {item.rating != null && (
                        <View style={styles.feedbackRatingBadge}>
                          <Text style={styles.feedbackRatingStars}>
                            {"★".repeat(item.rating)}
                          </Text>
                          <Text style={styles.feedbackRatingNum}>
                            {item.rating}.0
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Category pill */}
                    {item.category ? (
                      <View style={styles.feedbackCategoryRow}>
                        <View style={styles.feedbackCategoryPill}>
                          <Text style={styles.feedbackCategoryText}>
                            🏷️ {item.category}
                          </Text>
                        </View>
                      </View>
                    ) : null}

                    {/* Message Body */}
                    {item.comment || item.message ? (
                      <Text style={styles.feedbackMessageText}>
                        {item.comment || item.message}
                      </Text>
                    ) : null}

                    {/* Quick action to message customer */}
                    <TouchableOpacity
                      style={styles.replyCustomerButton}
                      onPress={() => handleChatWithCustomer(item)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.replyCustomerText}>
                        💬 Reply / Message Customer
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </ScrollView>
        ) : (
          // ==============================
          // 3. INBOX CONVERSATIONS LIST VIEW
          // ==============================
          <ScrollView contentContainerStyle={styles.listContainer}>
            {loading && conversations.length === 0 ? (
              <View style={{ alignItems: "center", paddingVertical: 40 }}>
                <ActivityIndicator size="large" color="#2E7D32" />
                <Text style={{ marginTop: 10, color: "#64748B" }}>Loading inbox...</Text>
              </View>
            ) : conversations.length === 0 ? (
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
        )}

        {/* ============================== */}
        {/* BOTTOM NAVIGATION */}
        {/* ============================== */}
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

            <TouchableOpacity
              style={styles.navItem}
              onPress={() => router.push("/customer-staff-supply-orders")}
            >
              <Text style={styles.navIcon}>📥</Text>
              <Text style={styles.navLabel}>Supply</Text>
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
