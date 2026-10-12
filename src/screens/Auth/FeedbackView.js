import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router, useFocusEffect } from "expo-router";

import { API_URL } from "../../constants/api";

// ─── Star Rating Display ──────────────────────────────────────────────────────
function StarDisplay({ rating }) {
  return (
    <View style={{ flexDirection: "row", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Text
          key={s}
          style={{ fontSize: 16, color: s <= rating ? "#F59E0B" : "#D1D5DB" }}
        >
          ★
        </Text>
      ))}
    </View>
  );
}

export default function FeedbackView() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeedback = async () => {
    try {
      setError(null);
      const response = await fetch(`${API_URL}/api/feedback`);
      const data = await response.json();
      if (response.ok) {
        setFeedbackList(data.feedback || []);
      } else {
        setError(data.message || "Could not load feedback.");
      }
    } catch (err) {
      setError("Could not connect to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchFeedback();
    }, []),
  );

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>💬 Customer Feedback</Text>
          <Text style={styles.headerSub}>What our customers say</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Body */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1E3A8A" />
          <Text style={styles.loadingText}>Loading feedback...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => { setLoading(true); fetchFeedback(); }}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : feedbackList.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>No Feedback Yet</Text>
          <Text style={styles.emptyText}>Be the first to share your experience!</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {/* Summary Banner */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>
              {feedbackList.length} Review{feedbackList.length !== 1 ? "s" : ""}
            </Text>
            <Text style={styles.summaryAvg}>
              Avg Rating:{" "}
              {(
                feedbackList.reduce((s, f) => s + (f.rating || 0), 0) /
                feedbackList.length
              ).toFixed(1)}{" "}
              ⭐
            </Text>
          </View>

          {feedbackList.map((item, idx) => (
            <View key={item._id || idx} style={styles.card}>
              {/* Top Row */}
              <View style={styles.cardTop}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>
                    {(item.customerName || item.name || "A")[0].toUpperCase()}
                  </Text>
                </View>
                <View style={styles.cardMeta}>
                  <Text style={styles.cardName}>
                    {item.customerName || item.name || "Anonymous"}
                  </Text>
                  <Text style={styles.cardDate}>{formatDate(item.createdAt)}</Text>
                </View>
                {item.rating != null && (
                  <StarDisplay rating={Number(item.rating)} />
                )}
              </View>

              {/* Message */}
              {item.message || item.comment ? (
                <Text style={styles.cardMessage}>
                  {item.message || item.comment}
                </Text>
              ) : null}

              {/* Category tag */}
              {item.category ? (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{item.category}</Text>
                </View>
              ) : null}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  safe: {
    flex: 1,
    backgroundColor: "#F0F4FF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingTop: 18,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  headerSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  errorIcon: { fontSize: 40, marginBottom: 10 },
  errorText: {
    fontSize: 15,
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  emptyText: { fontSize: 14, color: "#6B7280", textAlign: "center" },
  list: {
    padding: 16,
    paddingBottom: 32,
    gap: 14,
  },
  summaryCard: {
    backgroundColor: "#1E3A8A",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  summaryTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  summaryAvg: {
    color: "#BFDBFE",
    fontSize: 13,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 18, fontWeight: "800", color: "#1E3A8A" },
  cardMeta: { flex: 1 },
  cardName: { fontSize: 15, fontWeight: "700", color: "#111827" },
  cardDate: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  cardMessage: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 21,
    marginTop: 2,
  },
  tag: {
    alignSelf: "flex-start",
    marginTop: 10,
    backgroundColor: "#EEF4FF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: { fontSize: 12, color: "#1E3A8A", fontWeight: "600" },
};
