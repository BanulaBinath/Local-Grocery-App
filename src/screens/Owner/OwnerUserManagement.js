import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import { API_URL } from "../../constants/api";
import styles from "./OwnerUserManagement.styles";

const TABS = [
  { key: "customerStaff", label: "Customer Staff" },
  { key: "supplierStaff", label: "Supplier Staff" },
  { key: "suppliers", label: "Suppliers" },
  { key: "customers", label: "Customers" },
];

export default function OwnerUserManagement() {
  const [data, setData] = useState({
    customerStaff: [],
    supplierStaff: [],
    suppliers: [],
    customers: [],
  });
  const [tab, setTab] = useState("customerStaff");
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/owners/user-management`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setData(result);
    } catch (error) {
      console.error("Load owner user management error:", error);
      Alert.alert("Error", error.message || "Could not load user management.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateStaff = async (item, role, patch) => {
    try {
      const response = await fetch(
        `${API_URL}/api/owners/user-management/staff/${role}/${item._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      await loadData();
    } catch (error) {
      Alert.alert("Error", error.message || "Could not update staff.");
    }
  };

  const removeStaff = (item, role) => {
    Alert.alert("Remove staff", `Remove ${item.fullName}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          const response = await fetch(
            `${API_URL}/api/owners/user-management/staff/${role}/${item._id}`,
            { method: "DELETE" },
          );
          if (!response.ok) {
            Alert.alert("Error", "Could not remove staff.");
            return;
          }
          loadData();
        },
      },
    ]);
  };

  const blockCustomer = async (item) => {
    const response = await fetch(
      `${API_URL}/api/owners/user-management/customers/${item._id}/block`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked: !item.isBlocked }),
      },
    );
    if (!response.ok) {
      Alert.alert("Error", "Could not update customer account.");
      return;
    }
    loadData();
  };

  const updateSupplierStatus = async (item, status) => {
    try {
      const response = await fetch(
        `${API_URL}/api/owners/suppliers/${item._id}/${status === "approved" ? "approve" : "reject"}`,
        { method: "PUT" },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      await loadData();
    } catch (error) {
      Alert.alert("Error", error.message || "Could not update supplier.");
    }
  };

  const currentItems = data[tab] || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>User Management</Text>
            <Text style={styles.subtitle}>Manage users and permissions</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          {TABS.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.tab, tab === item.key && styles.activeTab]}
              onPress={() => setTab(item.key)}
            >
              <Text
                style={[
                  styles.tabText,
                  tab === item.key && styles.activeTabText,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {(tab === "customerStaff" || tab === "supplierStaff") && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              router.push(
                tab === "customerStaff"
                  ? "/add-customer-staff"
                  : "/add-supplier-staff",
              )
            }
          >
            <Text style={styles.addButtonText}>
              + Add {tab === "customerStaff" ? "Customer" : "Supplier"} Staff
            </Text>
          </TouchableOpacity>
        )}

        {loading ? (
          <ActivityIndicator style={styles.loader} color="#1E3A8A" />
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            {currentItems.length === 0 ? (
              <Text style={styles.empty}>No records found.</Text>
            ) : (
              currentItems.map((item) => {
                const isStaff = tab === "customerStaff" || tab === "supplierStaff";
                const role =
                  tab === "customerStaff" ? "customer_staff" : "supplier_staff";
                return (
                  <View key={item._id} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {(item.fullName || item.businessName || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.identity}>
                        <Text style={styles.name}>
                          {item.fullName || item.businessName}
                        </Text>
                        <Text style={styles.detail}>{item.email}</Text>
                        <Text style={styles.detail}>
                          {isStaff
                            ? tab === "customerStaff"
                              ? "Customer Staff"
                              : "Supplier Staff"
                            : item.businessName
                              ? `${item.businessName} • ${item.status}`
                              : item.isBlocked
                                ? "Blocked"
                                : "Active"}
                        </Text>
                      </View>
                    </View>

                    {isStaff ? (
                      <>
                        <View style={styles.actionRow}>
                          <Text style={styles.permissionLabel}>
                            {tab === "customerStaff"
                              ? "Customer orders"
                              : "Supply orders"}
                          </Text>
                          <TouchableOpacity
                            style={[
                              styles.smallButton,
                              item.isActive !== false && styles.activeButton,
                            ]}
                            onPress={() =>
                              updateStaff(item, role, {
                                isActive: item.isActive === false,
                                permissions: item.permissions,
                              })
                            }
                          >
                            <Text style={styles.buttonText}>
                              {item.isActive !== false ? "Active" : "Disabled"}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View style={styles.actionRow}>
                          <Text style={styles.permissionLabel}>Permission</Text>
                          <TouchableOpacity
                            style={styles.outlineButton}
                            onPress={() =>
                              updateStaff(item, role, {
                                isActive: item.isActive !== false,
                                permissions:
                                  tab === "customerStaff"
                                    ? {
                                        ...item.permissions,
                                        manageCustomerOrders:
                                          item.permissions?.manageCustomerOrders ===
                                          false,
                                      }
                                    : {
                                        ...item.permissions,
                                        manageSupplyOrders:
                                          item.permissions?.manageSupplyOrders ===
                                          false,
                                      },
                              })
                            }
                          >
                            <Text style={styles.outlineText}>
                              {tab === "customerStaff"
                                ? item.permissions?.manageCustomerOrders !== false
                                  ? "Granted"
                                  : "Revoked"
                                : item.permissions?.manageSupplyOrders !== false
                                  ? "Granted"
                                  : "Revoked"}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => removeStaff(item, role)}
                        >
                          <Text style={styles.removeText}>Remove staff</Text>
                        </TouchableOpacity>
                      </>
                    ) : tab === "suppliers" ? (
                      <View style={styles.supplierActions}>
                        <Text style={styles.statusText}>
                          Registration: {item.status}
                        </Text>
                        {item.status === "pending" ? (
                          <View style={styles.actionButtons}>
                            <TouchableOpacity
                              style={styles.approveButton}
                              onPress={() =>
                                updateSupplierStatus(item, "approved")
                              }
                            >
                              <Text style={styles.buttonText}>Approve</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.rejectButton}
                              onPress={() =>
                                updateSupplierStatus(item, "rejected")
                              }
                            >
                              <Text style={styles.buttonText}>Reject</Text>
                            </TouchableOpacity>
                          </View>
                        ) : null}
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={[
                          styles.smallButton,
                          item.isBlocked && styles.blockedButton,
                        ]}
                        onPress={() => blockCustomer(item)}
                      >
                        <Text style={styles.buttonText}>
                          {item.isBlocked ? "Unblock account" : "Block account"}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
