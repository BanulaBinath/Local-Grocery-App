import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import { API_URL } from "../../constants/api";
import styles from "./OwnerFinanceControl.styles";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

export default function OwnerFinanceControl() {
  const [finance, setFinance] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [financeResponse, settingsResponse] = await Promise.all([
        fetch(`${API_URL}/api/owners/finance-report`),
        fetch(`${API_URL}/api/owners/store-settings`),
      ]);
      const financeData = await financeResponse.json();
      const settingsData = await settingsResponse.json();

      if (!financeResponse.ok) throw new Error(financeData.message);
      if (!settingsResponse.ok) throw new Error(settingsData.message);

      setFinance(financeData);
      setSettings(settingsData.settings);
    } catch (error) {
      console.error("Load owner finance control error:", error);
      Alert.alert("Error", error.message || "Could not load finance controls.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateSetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
  };

  const saveSettings = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      const response = await fetch(`${API_URL}/api/owners/store-settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isStoreOpen: settings.isStoreOpen,
          openingTime: settings.openingTime,
          closingTime: settings.closingTime,
          deliveryFee: settings.deliveryFee,
          pickupFee: settings.pickupFee,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setSettings(data.settings);
      Alert.alert("Saved", "Store settings updated successfully.");
    } catch (error) {
      console.error("Save store settings error:", error);
      Alert.alert("Error", error.message || "Could not save store settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={loadData} />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Finance & Control</Text>
            <Text style={styles.subtitle}>Reports and store settings</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Financial Report</Text>
        <View style={styles.metrics}>
          <View style={styles.metricCard}>
            <Text style={styles.metricIcon}>💰</Text>
            <Text style={styles.metricValue}>{money(finance?.totalRevenue)}</Text>
            <Text style={styles.metricLabel}>Total Revenue</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricIcon}>🏪</Text>
            <Text style={styles.metricValue}>
              {money(finance?.supplierPayable)}
            </Text>
            <Text style={styles.metricLabel}>Supplier Payable</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricIcon}>📦</Text>
            <Text style={styles.metricValue}>{finance?.completedOrders || 0}</Text>
            <Text style={styles.metricLabel}>Completed Orders</Text>
          </View>
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            Net profit is not calculated yet because orders do not currently
            store supplier cost or margin data.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Store Settings</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>Accept Orders</Text>
              <Text style={styles.settingDescription}>
                {settings.isStoreOpen ? "Store is open" : "Store is closed"}
              </Text>
            </View>
            <Switch
              value={settings.isStoreOpen}
              onValueChange={(value) => updateSetting("isStoreOpen", value)}
              trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
              thumbColor={settings.isStoreOpen ? "#1E3A8A" : "#6B7280"}
            />
          </View>

          <Text style={styles.inputLabel}>Opening time</Text>
          <TextInput
            style={styles.input}
            value={settings.openingTime}
            onChangeText={(value) => updateSetting("openingTime", value)}
            placeholder="08:00"
          />

          <Text style={styles.inputLabel}>Closing time</Text>
          <TextInput
            style={styles.input}
            value={settings.closingTime}
            onChangeText={(value) => updateSetting("closingTime", value)}
            placeholder="20:00"
          />

          <Text style={styles.inputLabel}>Delivery fee</Text>
          <TextInput
            style={styles.input}
            value={String(settings.deliveryFee ?? 0)}
            onChangeText={(value) => updateSetting("deliveryFee", value)}
            keyboardType="numeric"
          />

          <Text style={styles.inputLabel}>Pickup fee</Text>
          <TextInput
            style={styles.input}
            value={String(settings.pickupFee ?? 0)}
            onChangeText={(value) => updateSetting("pickupFee", value)}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveSettings}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveText}>Save Settings</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
