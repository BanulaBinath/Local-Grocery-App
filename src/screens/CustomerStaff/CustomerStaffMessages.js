import { useEffect, useState } from "react";

import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";

import { API_URL } from "../../constants/api";
import styles from "./CustomerStaffMessages.styles";

export default function CustomerStaffMessages() {
  const params = useLocalSearchParams();
  const customerName = params.customerName || "Customer Helpdesk";
  const orderNumber = params.orderNumber || "";

  const [activeTab, setActiveTab] = useState(orderNumber ? "chat" : "conversations");
  const [messages, setMessages] = useState([
    {
      id: "1",
      customerName: "Kamal Perera",
      orderNumber: "1002",
      text: "Order #1002 rejected. Reason: Store temporarily closed.",
      fromStaff: true,
      time: "10:15 AM",
      type: "rejection",
    },
    {
      id: "2",
      customerName: "Nimali Fernando",
      orderNumber: "1004",
      text: "Hi, when will my vegetable order arrive?",
      fromStaff: false,
      time: "11:30 AM",
      type: "inquiry",
    },
    {
      id: "3",
      customerName: customerName,
      orderNumber: orderNumber || "1005",
      text: orderNumber
        ? `Hi! Regarding your order #${orderNumber}.`
        : "Hello! How can I help you with your grocery order?",
      fromStaff: true,
      time: "Just now",
      type: "inquiry",
    },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        customerName: customerName,
        orderNumber: orderNumber || "1005",
        text: input.trim(),
        fromStaff: true,
        time: "Just now",
        type: "inquiry",
      },
    ]);
    setInput("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Customer Messages</Text>
            <Text style={styles.headerSubtitle}>
              {orderNumber ? `Order #${orderNumber} • ${customerName}` : "Store Helpdesk & Notifications"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => setActiveTab(activeTab === "conversations" ? "chat" : "conversations")}
          >
            <Text style={{ fontSize: 16 }}>💬</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Toggle */}
        <View style={{ flexDirection: "row", backgroundColor: "#FFFFFF", paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#E2E8F0" }}>
          <TouchableOpacity
            style={{ flex: 1, paddingVertical: 8, alignItems: "center", borderBottomWidth: activeTab === "conversations" ? 2 : 0, borderBottomColor: "#15803D" }}
            onPress={() => setActiveTab("conversations")}
          >
            <Text style={{ fontWeight: activeTab === "conversations" ? "800" : "500", color: activeTab === "conversations" ? "#15803D" : "#64748B", fontSize: 13 }}>
              All Notifications ({messages.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flex: 1, paddingVertical: 8, alignItems: "center", borderBottomWidth: activeTab === "chat" ? 2 : 0, borderBottomColor: "#15803D" }}
            onPress={() => setActiveTab("chat")}
          >
            <Text style={{ fontWeight: activeTab === "chat" ? "800" : "500", color: activeTab === "chat" ? "#15803D" : "#64748B", fontSize: 13 }}>
              Direct Chat
            </Text>
          </TouchableOpacity>
        </View>

        {/* Body View */}
        {activeTab === "conversations" ? (
          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 90 }}>
            {messages.map((item) => (
              <View
                key={item.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 14,
                  padding: 14,
                  marginBottom: 10,
                  borderWidth: 1,
                  borderColor: item.type === "rejection" ? "#FCA5A5" : "#E2E8F0",
                  shadowColor: "#0F172A",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 4,
                  elevation: 1,
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                  <Text style={{ fontWeight: "800", fontSize: 14, color: "#0F172A" }}>
                    👤 {item.customerName}
                  </Text>
                  <Text style={{ fontSize: 11, color: "#64748B" }}>{item.time}</Text>
                </View>

                {item.orderNumber ? (
                  <Text style={{ fontSize: 11, fontWeight: "700", color: "#15803D", marginBottom: 4 }}>
                    Order #{item.orderNumber}
                  </Text>
                ) : null}

                <Text style={{ fontSize: 13, color: item.type === "rejection" ? "#B91C1C" : "#334155", lineHeight: 18 }}>
                  {item.text}
                </Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={{ flex: 1 }}>
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.chatList}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.bubble,
                    item.fromStaff ? styles.staffBubble : styles.customerBubble,
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
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
              )}
            />

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Type a message to customer..."
                placeholderTextColor="#94A3B8"
                value={input}
                onChangeText={setInput}
              />
              <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Bottom Navigation */}
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
            onPress={() => router.replace("/customer-staff-orders")}
          >
            <Text style={styles.navIcon}>📋</Text>
            <Text style={styles.navLabel}>Orders</Text>
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
      </View>
    </SafeAreaView>
  );
}

