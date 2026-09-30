import { useEffect, useState } from "react";
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

import { router } from "expo-router";

import { API_URL } from "../../constants/api";
import styles from "./SupplierRequests.styles";

export default function SupplierRequests() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ========================================
  // LOAD PENDING SUPPLIERS
  // ========================================
  const loadSuppliers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/owners/suppliers/pending`);

      const data = await response.json();

      if (response.ok) {
        setSuppliers(data.suppliers || []);
      } else {
        Alert.alert(
          "Error",
          data.message || "Could not load supplier requests.",
        );
      }
    } catch (error) {
      console.log("Load suppliers error:", error);

      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ========================================
  // LOAD WHEN SCREEN OPENS
  // ========================================
  useEffect(() => {
    loadSuppliers();
  }, []);

  // ========================================
  // REFRESH
  // ========================================
  const handleRefresh = () => {
    setRefreshing(true);
    loadSuppliers();
  };

  // ========================================
  // APPROVE SUPPLIER
  // ========================================
  const handleApprove = (supplier) => {
    Alert.alert(
      "Approve Supplier",
      `Are you sure you want to approve ${supplier.businessName}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Approve",
          onPress: async () => {
            try {
              const response = await fetch(
                `${API_URL}/api/owners/suppliers/${supplier._id}/approve`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                },
              );

              const data = await response.json();

              if (response.ok) {
                Alert.alert("Success", "Supplier approved successfully.");

                loadSuppliers();
              } else {
                Alert.alert(
                  "Error",
                  data.message || "Could not approve supplier.",
                );
              }
            } catch (error) {
              console.log("Approve supplier error:", error);

              Alert.alert(
                "Connection Error",
                "Could not connect to the server.",
              );
            }
          },
        },
      ],
    );
  };

  // ========================================
  // REJECT SUPPLIER
  // ========================================
  const handleReject = (supplier) => {
    Alert.alert(
      "Reject Supplier",
      `Are you sure you want to reject ${supplier.businessName}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(
                `${API_URL}/api/owners/suppliers/${supplier._id}/reject`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                },
              );

              const data = await response.json();

              if (response.ok) {
                Alert.alert("Supplier Rejected", "Supplier has been rejected.");

                loadSuppliers();
              } else {
                Alert.alert(
                  "Error",
                  data.message || "Could not reject supplier.",
                );
              }
            } catch (error) {
              console.log("Reject supplier error:", error);

              Alert.alert(
                "Connection Error",
                "Could not connect to the server.",
              );
            }
          },
        },
      ],
    );
  };

  // ========================================
  // LOADING
  // ========================================
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E3A8A" />

          <Text style={styles.loadingText}>Loading supplier requests...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ========================================
  // SCREEN
  // ========================================
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Supplier Requests</Text>

            <Text style={styles.headerSubtitle}>
              Review pending supplier registrations
            </Text>
          </View>

          <View style={styles.countBadge}>
            <Text style={styles.countText}>{suppliers.length}</Text>
          </View>
        </View>

        {/* SUPPLIERS */}
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {suppliers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>✓</Text>

              <Text style={styles.emptyTitle}>No Pending Requests</Text>

              <Text style={styles.emptyText}>
                There are currently no supplier registrations waiting for
                approval.
              </Text>
            </View>
          ) : (
            suppliers.map((supplier) => (
              <View key={supplier._id} style={styles.supplierCard}>
                {/* BUSINESS */}
                <View style={styles.cardHeader}>
                  <View style={styles.businessIcon}>
                    <Text style={styles.businessIconText}>🏪</Text>
                  </View>

                  <View style={styles.businessInfo}>
                    <Text style={styles.businessName}>
                      {supplier.businessName}
                    </Text>

                    <Text style={styles.supplierName}>{supplier.fullName}</Text>
                  </View>

                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingText}>Pending</Text>
                  </View>
                </View>

                {/* DETAILS */}
                <View style={styles.details}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Email</Text>

                    <Text style={styles.detailValue}>{supplier.email}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>NIC</Text>

                    <Text style={styles.detailValue}>{supplier.nic}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Business Reg. No.</Text>

                    <Text style={styles.detailValue}>
                      {supplier.businessRegistrationNo}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Address</Text>

                    <Text style={styles.detailValue}>{supplier.address}</Text>
                  </View>
                </View>

                {/* ACTIONS */}
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => handleReject(supplier)}
                  >
                    <Text style={styles.rejectText}>Reject</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.approveButton}
                    onPress={() => handleApprove(supplier)}
                  >
                    <Text style={styles.approveText}>Approve</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
