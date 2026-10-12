import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import { API_URL } from "../../constants/api";
import styles from "./OwnerDashboard.styles";

export default function OwnerDashboard() {
  const [summary, setSummary] = useState({
    totalSales: 0,
    dailyRevenue: 0,
    activeStaff: 0,
    activeSuppliers: 0,
    pendingOrders: 0,
    newPreorders: 0,
  });
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSummary = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoadingSummary(true);

      const response = await fetch(`${API_URL}/api/owners/dashboard-summary`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load dashboard summary.");
      }

      setSummary({
        totalSales: Number(data.totalSales) || 0,
        dailyRevenue: Number(data.dailyRevenue) || 0,
        activeStaff: Number(data.activeStaff) || 0,
        activeSuppliers: Number(data.activeSuppliers) || 0,
        pendingOrders: Number(data.pendingOrders) || 0,
        newPreorders: Number(data.newPreorders) || 0,
      });
    } catch (error) {
      console.error("Load owner dashboard summary error:", error);
    } finally {
      setLoadingSummary(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const handleRefresh = () => {
    loadSummary(true);
  };

  const handleSuppliers = () => {
    router.push("/owner-supplier-requests");
  };

  const handleStaff = () => {
    router.push("/owner-user-management");
  };

  const handleOrders = () => {
    router.push("/owner-orders");
  };

  const handleReports = () => {
    router.push("/owner-sales-report");
  };

  const handleSupplierProgress = () => {
    router.push("/owner-supplier-progress");
  };

  const handleMessages = () => {
    router.push("/owner-messages");
  };

  const handleFinanceControl = () => {
    router.push("/owner-finance-control");
  };

  const handleProfile = () => {
    router.push("/owner-profile");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>Local Grocery</Text>
          <Text style={styles.headerSubtitle}>Owner Dashboard</Text>
        </View>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={handleProfile}
          activeOpacity={0.8}
        >
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#1E3A8A"
          />
        }
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.title}>Welcome back 👋</Text>
          <Text style={styles.description}>
            Here is today's system activity and business overview.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>System Overview</Text>
            {loadingSummary ? (
              <ActivityIndicator size="small" color="#1E3A8A" />
            ) : null}
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <View style={styles.metricIcon}>
                <Text>💰</Text>
              </View>
              <Text style={styles.metricNumber}>
                Rs. {summary.dailyRevenue.toLocaleString()}
              </Text>
              <Text style={styles.metricLabel}>Today&apos;s Revenue</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricIcon}>
                <Text>🛒</Text>
              </View>
              <Text style={styles.metricNumber}>{summary.newPreorders}</Text>
              <Text style={styles.metricLabel}>New Pre-orders</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricIcon}>
                <Text>🏪</Text>
              </View>
              <Text style={styles.metricNumber}>{summary.activeSuppliers}</Text>
              <Text style={styles.metricLabel}>Active Suppliers</Text>
            </View>

            <View style={styles.metricCard}>
              <View style={styles.metricIcon}>
                <Text>👥</Text>
              </View>
              <Text style={styles.metricNumber}>{summary.activeStaff}</Text>
              <Text style={styles.metricLabel}>Working Staff</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Management</Text>

          <View style={styles.cards}>
          {/* SUPPLIER REQUESTS */}
          <TouchableOpacity style={styles.card} onPress={handleSuppliers}>
            <Text style={styles.cardIcon}>🏪</Text>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Supplier Requests</Text>

              <Text style={styles.cardDescription}>
                Review and approve supplier registrations.
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          {/* STAFF MANAGEMENT */}
          <TouchableOpacity style={styles.card} onPress={handleStaff}>
            <Text style={styles.cardIcon}>👥</Text>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Staff Management</Text>

              <Text style={styles.cardDescription}>
                Add and manage supplier and customer staff accounts.
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          {/* ALL ORDERS */}
          <TouchableOpacity style={styles.card} onPress={handleOrders}>
            <Text style={styles.cardIcon}>📦</Text>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>All Orders</Text>

              <Text style={styles.cardDescription}>
                View and filter customer orders by status.
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          {/* REPORTS */}
          <TouchableOpacity style={styles.card} onPress={handleReports}>
            <Text style={styles.cardIcon}>📊</Text>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Reports</Text>

              <Text style={styles.cardDescription}>
                View business and system reports.
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          {/* SUPPLIER PROGRESS */}
          <TouchableOpacity
            style={styles.card}
            onPress={handleSupplierProgress}
          >
            <Text style={styles.cardIcon}>📈</Text>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Supplier Progress</Text>

              <Text style={styles.cardDescription}>
                Compare delivered goods with supplier order targets.
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          {/* STAFF MESSAGES */}
          <TouchableOpacity style={styles.card} onPress={handleMessages}>
            <Text style={styles.cardIcon}>💬</Text>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Messages</Text>

              <Text style={styles.cardDescription}>
                Send messages to customer and supplier staff.
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={handleFinanceControl}>
            <Text style={styles.cardIcon}>💳</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Finance & Store Control</Text>
              <Text style={styles.cardDescription}>
                View finance reports and update store settings.
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          {/* PROFILE */}
          <TouchableOpacity style={styles.card} onPress={handleProfile}>
            <Text style={styles.cardIcon}>👤</Text>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>My Profile</Text>

              <Text style={styles.cardDescription}>
                View and manage your owner profile.
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace("/owner-dashboard")}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabelActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleOrders}>
          <Text style={styles.navIcon}>📦</Text>
          <Text style={styles.navLabel}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleMessages}>
          <Text style={styles.navIcon}>💬</Text>
          <Text style={styles.navLabel}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleProfile}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
