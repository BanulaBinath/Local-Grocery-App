import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import { API_URL } from "../../constants/api";
import styles from "./OwnerSalesReport.styles";

const PERIODS = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
];

const PERIOD_LABELS = {
  daily: "day",
  weekly: "week",
  monthly: "month",
};

export default function OwnerSalesReport() {
  const [period, setPeriod] = useState("daily");
  const [sales, setSales] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadReport = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setErrorMessage("");

      const response = await fetch(
        `${API_URL}/api/owners/sales-report?period=${period}`,
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load sales report.");
      }

      setSales(Array.isArray(data.sales) ? data.sales : []);
      setTotalSales(Number(data.totalSales) || 0);
    } catch (error) {
      console.error("Load owner sales report error:", error);
      setErrorMessage("Could not load sales report. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [period]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const maxSales = useMemo(
    () => Math.max(...sales.map((item) => Number(item.totalSales) || 0), 1),
    [sales],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadReport(true)}
            tintColor="#1E3A8A"
          />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Sales Reports</Text>
            <Text style={styles.headerSubtitle}>Completed orders only</Text>
          </View>
        </View>

        <View style={styles.periodTabs}>
          {PERIODS.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.periodTab,
                period === item.key && styles.activePeriodTab,
              ]}
              onPress={() => setPeriod(item.key)}
            >
              <Text
                style={[
                  styles.periodText,
                  period === item.key && styles.activePeriodText,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total sales</Text>
          <Text style={styles.totalValue}>
            Rs. {totalSales.toLocaleString()}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color="#1E3A8A"
          />
        ) : errorMessage ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => loadReport()}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : sales.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyTitle}>No completed sales</Text>
            <Text style={styles.emptyDescription}>
              Sales will appear here after orders are completed.
            </Text>
          </View>
        ) : (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>
              Sales by {PERIOD_LABELS[period]}
            </Text>
            <View style={styles.chart}>
              {sales.map((item) => {
                const amount = Number(item.totalSales) || 0;
                const height = Math.max((amount / maxSales) * 150, 8);

                return (
                  <View key={item.label} style={styles.barColumn}>
                    <Text style={styles.barValue}>
                      {amount.toLocaleString()}
                    </Text>
                    <View style={styles.barArea}>
                      <View style={[styles.bar, { height }]} />
                    </View>
                    <Text style={styles.barLabel}>{item.label}</Text>
                    <Text style={styles.orderCount}>
                      {item.orderCount} order{item.orderCount === 1 ? "" : "s"}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
