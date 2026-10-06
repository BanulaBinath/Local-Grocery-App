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
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";

import { API_URL } from "../../constants/api";
import styles from "./CustomerStaffMessages.styles";

export default function CustomerStaffMessages() {
  const params = useLocalSearchParams();
  const flatListRef = useRef(null);

  // Initial mock conversations
  const [conversations, setConversations] = useState([
    {
      id: "c1",
      customerName: "Kamal Perera",
      orderNumber: "1002",
      avatarText: "👨",
      messages: [
        { id: "m1", text: "Order #1002 rejected. Reason: Store temporarily closed.", fromStaff: true, time: "10:15 AM" },
      ]
    },
    {
      id: "c2",
      customerName: "Nimali Fernando",
      orderNumber: "1004",
      avatarText: "👩",
      messages: [
        { id: "m2", text: "Hi, when will my vegetable order arrive?", fromStaff: false, time: "11:30 AM" },
      ]
    },
    {
      id: "c3",
      customerName: "Kasun Silva",
      orderNumber: "1005",
      avatarText: "🧑",
      messages: [
        { id: "m3", text: "Can you add 1kg sugar to my order?", fromStaff: false, time: "01:20 PM" },
        { id: "m4", text: "Yes, I have added it and updated the bill.", fromStaff: true, time: "01:25 PM" },
        { id: "m5", text: "Thank you!", fromStaff: false, time: "01:30 PM" },
      ]
    }
  ]);

  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState("");

  const activeChat = conversations.find(c => c.id === activeChatId);

  // Auto-select chat if passed via params
  useEffect(() => {
    if (params.orderNumber && params.customerName) {
      // Find if exists, else create
      const exists = conversations.find(c => c.orderNumber === params.orderNumber);
      if (exists) {
        setActiveChatId(exists.id);
      } else {
        const newChat = {
          id: `c_${Date.now()}`,
          customerName: params.customerName,
          orderNumber: params.orderNumber,
          avatarText: "👤",
          messages: [
            { id: "m0", text: `Regarding Order #${params.orderNumber}...`, fromStaff: true, time: "Just now" }
          ]
        };
        setConversations(prev => [newChat, ...prev]);
        setActiveChatId(newChat.id);
      }
    }
  }, [params]);

  const sendMessage = () => {
    if (!input.trim() || !activeChatId) return;

    setConversations((prev) => 
      prev.map(chat => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            messages: [
              ...chat.messages, 
              {
                id: String(Date.now()),
                text: input.trim(),
                fromStaff: true,
                time: "Just now"
              }
            ]
          };
        }
        return chat;
      })
    );
    setInput("");
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleBack = () => {
    if (activeChatId) {
      setActiveChatId(null);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>
              {activeChatId ? activeChat?.customerName : "Staff Inbox"}
            </Text>
            <Text style={styles.headerSubtitle}>
              {activeChatId 
                ? (activeChat?.orderNumber ? `Order #${activeChat.orderNumber}` : "Direct Message")
                : "Customer Inquiries & Notifications"}
            </Text>
          </View>

          {activeChatId && (
            <View style={styles.headerSpace} />
          )}
        </View>

        {/* Body View */}
        {!activeChatId ? (
          // ==============================
          // 1. INBOX LIST VIEW
          // ==============================
          <ScrollView contentContainerStyle={styles.listContainer}>
            {conversations.map((chat) => {
              const lastMessage = chat.messages[chat.messages.length - 1];
              return (
                <TouchableOpacity
                  key={chat.id}
                  style={styles.inboxCard}
                  onPress={() => setActiveChatId(chat.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.avatarBox}>
                    <Text style={styles.avatarText}>{chat.avatarText}</Text>
                  </View>
                  <View style={styles.inboxContent}>
                    <View style={styles.inboxHeaderRow}>
                      <Text style={styles.inboxName}>{chat.customerName}</Text>
                      <Text style={styles.inboxTime}>{lastMessage?.time}</Text>
                    </View>
                    <View style={styles.inboxLastMsgRow}>
                      <Text style={styles.inboxLastMsg} numberOfLines={1}>
                        {lastMessage?.fromStaff ? "You: " : ""}{lastMessage?.text}
                      </Text>
                      {chat.orderNumber && (
                        <View style={styles.inboxOrderBadge}>
                          <Text style={styles.inboxOrderText}>#{chat.orderNumber}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              )
            })}
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
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
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
                  <Text style={[
                      styles.timeText,
                      item.fromStaff ? styles.timeTextStaff : styles.timeTextCustomer
                  ]}>{item.time}</Text>
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
              <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
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
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

