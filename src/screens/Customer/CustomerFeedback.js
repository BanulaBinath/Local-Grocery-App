import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
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
import CustomerBottomNav from "./CustomerBottomNav";
import styles from "./CustomerFeedback.styles";

const CATEGORIES = [
  "General",
  "Product Quality",
  "Store Service",
  "Order Pickup",
  "Pricing",
];

export default function CustomerFeedback() {
  const [customer, setCustomer] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("General");
  const [message, setMessage] = useState("");

  const loadData = async (isSilent = false) => {
    try {
      const customerData = await AsyncStorage.getItem("customer");
      if (!customerData) {
        Alert.alert("Error", "Please log in to submit feedback.");
        router.replace("/login");
        return;
      }

      const parsed = JSON.parse(customerData);
      setCustomer(parsed);

      const response = await fetch(`${API_URL}/api/feedback`);
      let data = {};
      try {
        data = await response.json();
      } catch (e) {
        console.log("Could not parse feedback response JSON:", e);
      }

      if (response.ok && data.feedback) {
        const myId = parsed.id || parsed._id;
        const mine = (data.feedback || []).filter((item) => {
          if (item.customerId) {
            const cId =
              typeof item.customerId === "object"
                ? item.customerId._id
                : item.customerId;
            if (String(cId) === String(myId)) return true;
          }
          if (parsed.fullName && item.customerName === parsed.fullName) {
            return true;
          }
          return false;
        });
        setFeedbackList(mine);
      } else if (!isSilent) {
        Alert.alert("Error", data.message || "Could not load feedback.");
      }
    } catch (error) {
      console.log("Load feedback error:", error);
      if (!isSilent) {
        Alert.alert("Connection Error", "Could not connect to the server.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadData();
    }, []),
  );

  const submitFeedback = async () => {
    const customerId = customer?.id || customer?._id;
    if (!customerId) {
      Alert.alert("Error", "Please log in to submit feedback.");
      return;
    }

    if (!rating && !String(message).trim()) {
      Alert.alert("Feedback Required", "Please add a rating or a message.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`${API_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customerId,
          customerName: customer.fullName || customer.name || "",
          customerEmail: customer.email || "",
          rating: rating || null,
          category: category || "General",
          comment: String(message).trim(),
          message: String(message).trim(),
        }),
      });

      let data = {};
      try {
        data = await response.json();
      } catch (e) {
        console.log("Parse response error:", e);
      }

      if (response.ok) {
        setRating(0);
        setMessage("");
        setCategory("General");
        Alert.alert("Thank you!", "Your feedback has been submitted successfully.");
        loadData(true);
      } else {
        Alert.alert("Error", data.message || "Could not submit feedback.");
      }
    } catch (error) {
      console.log("Submit feedback error:", error);
      Alert.alert("Connection Error", "Could not connect to the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Feedback</Text>
          <Text style={styles.headerSub}>
            {customer?.fullName ? `Signed in as ${customer.fullName}` : ""}
          </Text>
        </View>

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E3A8A" />
            <Text style={styles.loadingText}>Loading feedback...</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  loadData(true);
                }}
                colors={["#1E3A8A"]}
              />
            }
          >
            {/* Share feedback card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Share your experience</Text>

              {/* Rating */}
              <Text style={styles.label}>Rating</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.star,
                        star <= rating && styles.starActive,
                      ]}
                    >
                      ★
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Category */}
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoriesRow}>
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryChip,
                        isSelected && styles.categoryChipActive,
                      ]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          isSelected && styles.categoryChipTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Message */}
              <Text style={styles.label}>Message</Text>
              <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Write your feedback or review here..."
                placeholderTextColor="#94A3B8"
                multiline
              />

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  submitting && styles.submitButtonDisabled,
                ]}
                onPress={submitFeedback}
                disabled={submitting}
                activeOpacity={0.85}
              >
                <Text style={styles.submitText}>
                  {submitting ? "Submitting..." : "Submit Feedback"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Previous feedback list */}
            <Text style={styles.sectionTitle}>Your Previous Feedback</Text>
            {feedbackList.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>
                  You have not submitted any feedback yet.
                </Text>
              </View>
            ) : (
              feedbackList.map((item) => (
                <View key={item._id} style={styles.feedbackCard}>
                  <View style={styles.feedbackTop}>
                    <Text style={styles.feedbackName}>
                      {item.customerName || customer?.fullName}
                    </Text>
                    <Text style={styles.feedbackDate}>
                      {formatDate(item.createdAt)}
                    </Text>
                  </View>

                  <View style={styles.feedbackRatingRow}>
                    {item.rating ? (
                      <Text style={styles.feedbackRating}>
                        {"★".repeat(item.rating)}
                        {"☆".repeat(5 - item.rating)}
                      </Text>
                    ) : null}
                    {item.category ? (
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>
                          {item.category}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  {item.comment || item.message ? (
                    <Text style={styles.feedbackMessage}>
                      {item.comment || item.message}
                    </Text>
                  ) : null}
                </View>
              ))
            )}
          </ScrollView>
        )}

        <CustomerBottomNav active="feedback" />
      </View>
    </SafeAreaView>
  );
}
