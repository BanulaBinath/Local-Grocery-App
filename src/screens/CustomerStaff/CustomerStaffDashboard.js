import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

import { router } from "expo-router";

import styles from "./CustomerStaffDashboard.styles";

export default function CustomerStaffDashboard() {
  const handleOrders = () => {
    router.push("/customer-staff-orders");
  };

  const handlePickup = () => {
    router.push("/customer-staff-pickup");
  };

  const handleMessages = () => {
    router.push("/customer-staff-messages");
  };

  const handleProfile = () => {
    router.push("/customer-staff-profile");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>Local Grocery</Text>
            <Text style={styles.headerSubtitle}>Customer Staff</Text>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleProfile}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.title}>Welcome, Staff 👋</Text>

          <Text style={styles.description}>
            Manage customer orders, pickups and handovers.
          </Text>
        </View>

        <View style={styles.cards}>
          <TouchableOpacity style={styles.card} onPress={handleOrders}>
            <Text style={styles.cardIcon}>🛒</Text>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Customer Orders</Text>

              <Text style={styles.cardDescription}>
                View and manage customer orders.
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={handlePickup}>
            <Text style={styles.cardIcon}>📦</Text>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Pickup & Handover</Text>

              <Text style={styles.cardDescription}>
                Manage customer pickups and order handovers.
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={handleMessages}>
            <Text style={styles.cardIcon}>💬</Text>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Messages</Text>

              <Text style={styles.cardDescription}>
                Communicate about customer orders and pickups.
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={handleProfile}>
            <Text style={styles.cardIcon}>👤</Text>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>My Profile</Text>

              <Text style={styles.cardDescription}>
                View and manage your staff profile.
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
