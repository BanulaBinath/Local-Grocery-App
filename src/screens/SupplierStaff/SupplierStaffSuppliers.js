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

import { router, useFocusEffect } from "expo-router";

import { API_URL } from "../../constants/api";

import styles from "./SupplierStaffSuppliers.styles";

export default function SupplierStaffSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/suppliers`);

      const data = await response.json();

      if (response.ok) {
        setSuppliers(data.suppliers || data || []);
      } else {
        Alert.alert("Error", data.message || "Could not load suppliers.");
      }
    } catch (error) {
      console.log("Fetch suppliers error:", error);

      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSuppliers();
    }, []),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSuppliers();
  };

  /* --------------------------------
     OPEN SUPPLIER DETAILS
  -------------------------------- */

  const handleSupplierPress = (supplier) => {
    router.push({
      pathname: "/supplier-staff-supplier-details",

      params: {
        supplierId: supplier._id || "",

        supplierName: supplier.businessName || supplier.fullName || "Supplier",

        fullName: supplier.fullName || "",

        email: supplier.email || "",

        address: supplier.address || "",

        businessName: supplier.businessName || "",

        businessRegistrationNo: supplier.businessRegistrationNo || "",

        status: supplier.status || "approved",
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Suppliers</Text>

            <Text style={styles.headerSubtitle}>
              Select a supplier to view details
            </Text>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/supplier-staff-profile")}
            activeOpacity={0.8}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* CONTENT */}

        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#1E3A8A" />

            <Text style={styles.loadingText}>Loading suppliers...</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
          >
            {suppliers.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🏪</Text>

                <Text style={styles.emptyTitle}>No Suppliers Available</Text>

                <Text style={styles.emptyText}>
                  There are currently no approved suppliers available.
                </Text>
              </View>
            ) : (
              suppliers.map((supplier) => (
                <TouchableOpacity
                  key={supplier._id}
                  style={styles.card}
                  onPress={() => handleSupplierPress(supplier)}
                  activeOpacity={0.8}
                >
                  <View style={styles.iconContainer}>
                    <Text style={styles.icon}>🏪</Text>
                  </View>

                  <View style={styles.cardContent}>
                    <Text style={styles.businessName} numberOfLines={1}>
                      {supplier.businessName || supplier.fullName || "Supplier"}
                    </Text>

                    <Text style={styles.supplierName} numberOfLines={1}>
                      {supplier.fullName || ""}
                    </Text>

                    <Text style={styles.address} numberOfLines={1}>
                      📍 {supplier.address || "No address"}
                    </Text>
                  </View>

                  <Text style={styles.arrow}>›</Text>
                </TouchableOpacity>
              ))
            )}

            <View style={styles.bottomSpace} />
          </ScrollView>
        )}

        {/* BOTTOM NAVIGATION */}

        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.replace("/supplier-staff-dashboard")}
          >
            <Text style={styles.navIcon}>🏠</Text>

            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/supplier-staff-supply-orders")}
          >
            <Text style={styles.navIcon}>📦</Text>

            <Text style={styles.navLabel}>Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/supplier-staff-pickup-orders")}
          >
            <Text style={styles.navIcon}>🚚</Text>

            <Text style={styles.navLabel}>Pickup</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIconActive}>🏪</Text>

            <Text style={styles.navLabelActive}>Suppliers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/supplier-staff-messages")}
          >
            <Text style={styles.navIcon}>💬</Text>

            <Text style={styles.navLabel}>Messages</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
