import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";

import { API_URL } from "../../constants/api";
import styles from "./CustomerNotifications.styles";

export default function CustomerNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const custData = await AsyncStorage.getItem("customer");

      if (!custData) {
        setNotifications([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const parsed = JSON.parse(custData);
      setCustomer(parsed);

      const customerId = parsed._id || parsed.id;
      const res = await fetch(
        `${API_URL}/api/notifications/customer/${customerId}`,
      );

      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (e) {
      console.log("Error fetching notifications:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, []),
  );

  const markAsRead = async (notifId) => {
    try {
      await fetch(`${API_URL}/api/notifications/${notifId}/read`, {
        method: "PUT",
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === notifId ? { ...n, isRead: true } : n)),
      );
    } catch (e) {
      console.log("Error marking notification read:", e);
    }
  };

  const markAllRead = async () => {
    if (!customer) return;
    try {
      const customerId = customer._id || customer.id;
      await fetch(`${API_URL}/api/notifications/customer/${customerId}/read-all`, {
        method: "PUT",
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.log("Error marking all read:", e);
    }
  };

  const handleNotificationPress = (notif) => {
    markAsRead(notif._id);
    if (notif.orderId || notif.orderNumber) {
      router.push("/order-history");
    }
  };

  const getIconConfig = (type) => {
    switch (type) {
      case "order_accepted":
        return { icon: "✅", style: styles.iconAccepted };
      case "order_rejected":
        return { icon: "❌", style: styles.iconRejected };
      case "order_ready":
        return { icon: "🛍️", style: styles.iconReady };
      case "order_placed":
        return { icon: "📦", style: styles.iconPlaced };
      case "order_completed":
        return { icon: "🎉", style: styles.iconAccepted };
      default:
        return { icon: "🔔", style: styles.iconGeneral };
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
          <Text style={styles.headerTitle}>Notifications</Text>
          {notifications.some((n) => !n.isRead) ? (
            <TouchableOpacity onPress={markAllRead}>
              <Text style={styles.markAllReadText}>Mark all read</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 45 }} />
          )}
        </View>

        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E3A8A" />
            <Text style={styles.loadingText}>Loading notifications...</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  fetchNotifications(false);
                }}
                colors={["#1E3A8A"]}
              />
            }
          >
            {notifications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🔔</Text>
                <Text style={styles.emptyTitle}>No Notifications Yet</Text>
                <Text style={styles.emptyText}>
                  You will receive real-time notifications here when staff
                  accepts or updates your grocery orders!
                </Text>
              </View>
            ) : (
              notifications.map((notif) => {
                const { icon, style: iconStyle } = getIconConfig(notif.type);

                return (
                  <TouchableOpacity
                    key={notif._id}
                    style={[
                      styles.notificationCard,
                      !notif.isRead && styles.notificationUnread,
                    ]}
                    onPress={() => handleNotificationPress(notif)}
                    activeOpacity={0.85}
                  >
                    <View style={[styles.iconBox, iconStyle]}>
                      <Text style={styles.iconText}>{icon}</Text>
                    </View>

                    <View style={styles.cardBody}>
                      <View style={styles.titleRow}>
                        <Text style={styles.cardTitle}>{notif.title}</Text>
                        {!notif.isRead ? (
                          <View style={styles.unreadDot} />
                        ) : null}
                      </View>

                      <Text style={styles.cardMessage}>{notif.message}</Text>
                      <Text style={styles.cardTime}>
                        {formatTime(notif.createdAt)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
