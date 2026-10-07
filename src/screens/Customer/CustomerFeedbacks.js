import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { API_URL } from "../../constants/api";
import styles from "./CustomerFeedbacks.styles";

export default function CustomerFeedbacks() {
  const params = useLocalSearchParams();
  const [customer, setCustomer] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Review Form Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(5);
  const [customerName, setCustomerName] = useState("");
  const [comment, setComment] = useState("");
  const [orderNumber, setOrderNumber] = useState(params.orderNumber || "");
  const [submitting, setSubmitting] = useState(false);

  const fetchFeedbacks = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);

      // Check logged in customer
      const custData = await AsyncStorage.getItem("customer");
      if (custData) {
        const parsed = JSON.parse(custData);
        setCustomer(parsed);
        setCustomerName(parsed.fullName || "");
      }

      const res = await fetch(`${API_URL}/api/feedbacks`);
      if (res.ok) {
        const data = await res.json();
        setFeedbacks(data.feedbacks || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (e) {
      console.log("Error loading feedbacks:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (params.orderNumber) {
        setOrderNumber(params.orderNumber);
        setModalVisible(true);
      }
      fetchFeedbacks();
    }, [params.orderNumber]),
  );

  const handleSubmitFeedback = async () => {
    if (!customerName.trim()) {
      Alert.alert("Missing Name", "Please enter your name.");
      return;
    }

    if (!comment.trim()) {
      Alert.alert("Missing Comment", "Please write a review comment.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`${API_URL}/api/feedbacks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customer?._id || customer?.id || null,
          customerName: customerName.trim(),
          customerEmail: customer?.email || "",
          rating,
          comment: comment.trim(),
          orderNumber: orderNumber ? Number(orderNumber) : null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setModalVisible(false);
        setComment("");
        Alert.alert(
          "Review Submitted! ⭐",
          "Thank you for sharing your feedback with the Local Grocery community!",
        );
        fetchFeedbacks(false);
      } else {
        Alert.alert("Submission Failed", data.message || "Could not submit review.");
      }
    } catch (e) {
      console.log("Error submitting feedback:", e);
      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count, size = 16) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text
          key={i}
          style={{
            fontSize: size,
            color: i <= count ? "#F59E0B" : "#CBD5E1",
          }}
        >
          ★
        </Text>,
      );
    }
    return stars;
  };

  const getRatingHint = (stars) => {
    switch (stars) {
      case 5:
        return "⭐⭐⭐⭐⭐ Outstanding Experience!";
      case 4:
        return "⭐⭐⭐⭐ Very Good!";
      case 3:
        return "⭐⭐⭐ Average / Okay";
      case 2:
        return "⭐⭐ Below Expectations";
      case 1:
        return "⭐ Poor Experience";
      default:
        return "";
    }
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
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Customer Reviews</Text>
          {customer ? (
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.headerAction}>+ Write</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 45 }} />
          )}
        </View>

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E3A8A" />
            <Text style={styles.loadingText}>Loading customer feedback...</Text>
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
                  fetchFeedbacks(false);
                }}
                colors={["#1E3A8A"]}
              />
            }
          >
            {/* Overview Score Card */}
            <View style={styles.overviewCard}>
              <View style={styles.overviewTop}>
                <View>
                  <Text style={styles.scoreBig}>
                    {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "5.0"}
                  </Text>
                  <View style={styles.starsRow}>
                    {renderStars(Math.round(stats.averageRating || 5), 20)}
                  </View>
                  <Text style={styles.totalReviewsText}>
                    Based on {stats.totalReviews || feedbacks.length} customer
                    review{stats.totalReviews !== 1 ? "s" : ""}
                  </Text>
                </View>

                {customer ? (
                  <TouchableOpacity
                    style={styles.leaveReviewBtn}
                    onPress={() => setModalVisible(true)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.leaveReviewBtnText}>★ Rate Store</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              {/* Notice for new / non-logged-in customers */}
              {!customer && (
                <View style={styles.visitorBanner}>
                  <Text style={styles.visitorBannerText}>
                    👋 New to Local Grocery? See what verified shoppers say
                    about our fresh quality and quick store pickup!
                  </Text>
                  <TouchableOpacity
                    style={styles.loginBtnSmall}
                    onPress={() => router.push("/login")}
                  >
                    <Text style={styles.loginBtnSmallText}>Login</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Reviews Section Title */}
            <Text style={styles.sectionTitle}>
              Shopper Experiences ({feedbacks.length})
            </Text>

            {feedbacks.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>⭐</Text>
                <Text style={styles.emptyTitle}>Be the First to Review!</Text>
                <Text style={styles.emptyText}>
                  No customer feedback has been submitted yet. Share your
                  grocery shopping experience with us!
                </Text>
              </View>
            ) : (
              feedbacks.map((item) => (
                <View key={item._id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.authorRow}>
                      <View style={styles.authorAvatar}>
                        <Text style={styles.authorAvatarText}>
                          {item.customerName ? item.customerName.charAt(0).toUpperCase() : "C"}
                        </Text>
                      </View>
                      <View>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                          <Text style={styles.authorName}>{item.customerName}</Text>
                          <View style={styles.verifiedBadge}>
                            <Text style={styles.verifiedText}>✓ Shopper</Text>
                          </View>
                        </View>
                        <View style={styles.starsRow}>
                          {renderStars(item.rating, 14)}
                        </View>
                      </View>
                    </View>

                    <Text style={styles.reviewDate}>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "Recent"}
                    </Text>
                  </View>

                  <Text style={styles.reviewComment}>{item.comment}</Text>

                  {item.orderNumber ? (
                    <Text style={styles.orderTag}>
                      Verified Order #{item.orderNumber}
                    </Text>
                  ) : null}
                </View>
              ))
            )}
          </ScrollView>
        )}

        {/* Write Feedback Modal */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <KeyboardAvoidingView
            style={styles.modalOverlay}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHandleBar} />

              <View style={styles.modalTitleRow}>
                <Text style={styles.modalTitle}>Give Your Feedback</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* 5-Star Selector */}
              <View style={styles.starSelectorRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    style={styles.starButton}
                    onPress={() => setRating(star)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.starButtonIcon,
                        { color: star <= rating ? "#F59E0B" : "#CBD5E1" },
                      ]}
                    >
                      ★
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.ratingHint}>{getRatingHint(rating)}</Text>

              {/* Form Fields */}
              <Text style={styles.label}>Your Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={customerName}
                onChangeText={setCustomerName}
              />

              {orderNumber ? (
                <>
                  <Text style={styles.label}>Order Number</Text>
                  <TextInput
                    style={styles.input}
                    value={`Order #${orderNumber}`}
                    editable={false}
                  />
                </>
              ) : null}

              <Text style={styles.label}>Review & Comments</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Tell us about the grocery quality, store pickup speed, or staff service..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                value={comment}
                onChangeText={setComment}
              />

              <TouchableOpacity
                style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
                onPress={handleSubmitFeedback}
                disabled={submitting}
                activeOpacity={0.85}
              >
                <Text style={styles.submitBtnText}>
                  {submitting ? "Submitting Review..." : "Submit Feedback ★"}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
