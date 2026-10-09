import { useCallback, useEffect, useState } from "react";
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
import { router } from "expo-router";

import { API_URL } from "../../constants/api";
import styles from "./OwnerMessages.styles";

const roleLabel = (role) =>
  role === "supplier_staff" ? "Supplier Staff" : "Customer Staff";

export default function OwnerMessages() {
  const [owner, setOwner] = useState(null);
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const loadStaff = useCallback(async () => {
    try {
      const storedOwner = await AsyncStorage.getItem("owner");
      if (!storedOwner) {
        throw new Error("Owner information not found.");
      }
      const ownerData = JSON.parse(storedOwner);
      setOwner(ownerData);

      const response = await fetch(`${API_URL}/api/owners/message-recipients`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not load staff.");
      }
      setStaff(data.staff || []);
    } catch (error) {
      console.error("Load owner message recipients error:", error);
      Alert.alert("Error", error.message || "Could not load staff.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMessages = useCallback(
    async (recipient) => {
      if (!owner || !recipient) return;
      setLoadingMessages(true);
      try {
        const ownerId = owner._id || owner.id;
        const recipientId = recipient._id || recipient.id;
        const url =
          `${API_URL}/api/messages/conversation?userId=${ownerId}` +
          `&userRole=owner&otherUserId=${recipientId}` +
          `&otherUserRole=${recipient.role}`;
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Could not load conversation.");
        }
        setMessages(data.messages || []);
      } catch (error) {
        console.error("Load owner conversation error:", error);
        Alert.alert("Error", "Could not load conversation.");
      } finally {
        setLoadingMessages(false);
      }
    },
    [owner],
  );

  useEffect(() => {
    loadStaff();
  }, [loadStaff]);

  const handleSend = async () => {
    if (!message.trim() || !owner || !selectedStaff) return;

    try {
      setSending(true);
      const response = await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: owner._id || owner.id,
          senderRole: "owner",
          receiverId: selectedStaff._id || selectedStaff.id,
          receiverRole: selectedStaff.role,
          message: message.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Message could not be sent.");
      }
      setMessage("");
      await loadMessages(selectedStaff);
    } catch (error) {
      console.error("Send owner message error:", error);
      Alert.alert("Error", error.message || "Could not send message.");
    } finally {
      setSending(false);
    }
  };

  if (selectedStaff) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setSelectedStaff(null);
                setMessages([]);
              }}
            >
              <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>{selectedStaff.fullName}</Text>
              <Text style={styles.headerSubtitle}>
                {roleLabel(selectedStaff.role)}
              </Text>
            </View>
          </View>

          {loadingMessages ? (
            <ActivityIndicator style={styles.loader} color="#1E3A8A" />
          ) : (
            <ScrollView
              style={styles.messageList}
              contentContainerStyle={styles.messageContent}
            >
              {messages.length === 0 ? (
                <Text style={styles.emptyText}>Start a conversation.</Text>
              ) : (
                messages.map((item) => {
                  const sent = item.senderRole === "owner";
                  return (
                    <View
                      key={item._id}
                      style={[
                        styles.messageRow,
                        sent ? styles.sentRow : styles.receivedRow,
                      ]}
                    >
                      <Text
                        style={[
                          styles.messageBubble,
                          sent ? styles.sentBubble : styles.receivedBubble,
                        ]}
                      >
                        {item.message}
                      </Text>
                    </View>
                  );
                })
              )}
            </ScrollView>
          )}

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              multiline
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
              disabled={sending}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.sendText}>➤</Text>
              )}
            </TouchableOpacity>
          </View>
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
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Messages</Text>
            <Text style={styles.headerSubtitle}>Message shop staff</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator style={styles.loader} color="#1E3A8A" />
        ) : (
          <ScrollView contentContainerStyle={styles.staffList}>
            {staff.length === 0 ? (
              <Text style={styles.emptyText}>No staff available.</Text>
            ) : (
              staff.map((item) => (
                <TouchableOpacity
                  key={`${item.role}-${item._id}`}
                  style={styles.staffCard}
                  onPress={async () => {
                    setSelectedStaff(item);
                    setMessages([]);
                    await loadMessages(item);
                  }}
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {(item.fullName || "S").charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.staffInfo}>
                    <Text style={styles.staffName}>{item.fullName}</Text>
                    <Text style={styles.staffRole}>
                      {roleLabel(item.role)}
                    </Text>
                  </View>
                  <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
