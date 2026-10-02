import { useState } from "react";

import {
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import styles from "./CustomerStaffMessages.styles";

export default function CustomerStaffMessages() {
  const params = useLocalSearchParams();
  const customerName = params.customerName || "Customer";
  const orderNumber = params.orderNumber || "";

  const [messages, setMessages] = useState([
    {
      id: "1",
      text: orderNumber
        ? `Hi! Regarding your order #${orderNumber}.`
        : "Hello! How can I help you with your order?",
      fromStaff: true,
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        text: input.trim(),
        fromStaff: true,
        time: "Just now",
      },
    ]);
    setInput("");
  };

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

          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{customerName}</Text>
            <Text style={styles.headerSubtitle}>Active Now</Text>
          </View>

          <View style={styles.headerSpace} />
        </View>

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
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
