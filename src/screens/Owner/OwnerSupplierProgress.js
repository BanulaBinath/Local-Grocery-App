import { useCallback, useEffect, useState } from "react";
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
import styles from "./OwnerSupplierProgress.styles";

export default function OwnerSupplierProgress() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadProgress = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setErrorMessage("");

      const response = await fetch(`${API_URL}/api/owners/supplier-progress`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load supplier progress.");
      }

      setSuppliers(Array.isArray(data.suppliers) ? data.suppliers : []);
    } catch (error) {
      console.error("Load supplier progress error:", error);
      setErrorMessage("Could not load supplier progress. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadProgress(true)}
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
            <Text style={styles.headerTitle}>Supplier Progress</Text>
            <Text style={styles.headerSubtitle}>
              Delivered goods vs order targets
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>📦</Text>
          <Text style={styles.infoText}>
            Progress is calculated from completed order quantities compared with
            all non-rejected order targets.
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
              onPress={() => loadProgress()}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : suppliers.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyTitle}>No supplier targets yet</Text>
            <Text style={styles.emptyDescription}>
              Supplier progress will appear after orders are created.
            </Text>
          </View>
        ) : (
          <View style={styles.supplierList}>
            {suppliers.map((supplier) => (
              <View key={String(supplier.supplierId)} style={styles.supplierCard}>
                <View style={styles.supplierHeader}>
                  <View style={styles.supplierNameContainer}>
                    <Text style={styles.supplierIcon}>🏪</Text>
                    <Text style={styles.supplierName}>
                      {supplier.supplierName || "Unknown supplier"}
                    </Text>
                  </View>
                  <Text style={styles.progressValue}>
                    {supplier.progress}%
                  </Text>
                </View>

                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${supplier.progress}%` },
                    ]}
                  />
                </View>

                <View style={styles.statsRow}>
                  <Text style={styles.stat}>
                    Delivered: {supplier.deliveredQuantity}
                  </Text>
                  <Text style={styles.stat}>
                    Target: {supplier.targetQuantity}
                  </Text>
                  <Text style={styles.stat}>
                    Orders: {supplier.completedOrders}/{supplier.targetOrders}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
