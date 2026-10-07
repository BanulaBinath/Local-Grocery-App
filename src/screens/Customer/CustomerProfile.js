import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import styles from "./CustomerProfile.styles";

export default function CustomerProfile() {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomer();
  }, []);

  const loadCustomer = async () => {
    try {
      const customerData = await AsyncStorage.getItem("customer");

      if (customerData) {
        setCustomer(JSON.parse(customerData));
      } else {
        router.replace("/login");
      }
    } catch (error) {
      console.log("Load customer error:", error);

      Alert.alert("Error", "Could not load your profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleOrders = () => {
    router.push("/order-history");
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("customer");

            router.replace("/login");
          } catch (error) {
            console.log("Logout error:", error);

            Alert.alert("Error", "Could not logout. Please try again.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E3A8A" />

          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Profile</Text>

          <View style={styles.headerSpace} />
        </View>

        {/* Profile Image */}
        <View style={styles.profileSection}>
          {customer.profileImage ? (
            <Image
              source={{
                uri: customer.profileImage,
              }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Text style={styles.profileIcon}>👤</Text>
            </View>
          )}

          <Text style={styles.customerName}>{customer.fullName}</Text>

          <Text style={styles.customerEmail}>{customer.email}</Text>
        </View>

        {/* Profile Information */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          {/* Full Name */}
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>👤</Text>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Full Name</Text>

              <Text style={styles.infoValue}>{customer.fullName}</Text>
            </View>
          </View>

          {/* Email */}
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📧</Text>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>

              <Text style={styles.infoValue}>{customer.email}</Text>
            </View>
          </View>

          {/* NIC */}
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🪪</Text>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>NIC</Text>

              <Text style={styles.infoValue}>{customer.nic}</Text>
            </View>
          </View>

          {/* Address */}
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Address</Text>

              <Text style={styles.infoValue}>{customer.address}</Text>
            </View>
          </View>
        </View>

        {/* My Orders */}
        <TouchableOpacity style={styles.ordersButton} onPress={handleOrders}>
          <View style={styles.ordersLeft}>
            <Text style={styles.ordersIcon}>📦</Text>

            <View>
              <Text style={styles.ordersTitle}>My Orders</Text>

              <Text style={styles.ordersSubtitle}>View your order history & status</Text>
            </View>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* My Cart */}
        <TouchableOpacity
          style={styles.ordersButton}
          onPress={() => router.push("/customer-cart")}
        >
          <View style={styles.ordersLeft}>
            <Text style={styles.ordersIcon}>🛒</Text>

            <View>
              <Text style={styles.ordersTitle}>My Cart</Text>

              <Text style={styles.ordersSubtitle}>View selected items & checkout</Text>
            </View>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* Notifications */}
        <TouchableOpacity
          style={styles.ordersButton}
          onPress={() => router.push("/customer-notifications")}
        >
          <View style={styles.ordersLeft}>
            <Text style={styles.ordersIcon}>🔔</Text>

            <View>
              <Text style={styles.ordersTitle}>Order Notifications</Text>

              <Text style={styles.ordersSubtitle}>Status updates & store alerts</Text>
            </View>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* Feedback & Reviews */}
        <TouchableOpacity
          style={styles.ordersButton}
          onPress={() => router.push("/customer-feedbacks")}
        >
          <View style={styles.ordersLeft}>
            <Text style={styles.ordersIcon}>⭐</Text>

            <View>
              <Text style={styles.ordersTitle}>Feedback & Reviews</Text>

              <Text style={styles.ordersSubtitle}>Share feedback or view community ratings</Text>
            </View>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutIcon}>🚪</Text>

          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
