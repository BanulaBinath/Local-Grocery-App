import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

import { router } from "expo-router";

import styles from "./OwnerDashboard.styles";

export default function OwnerDashboard() {
  const handleSuppliers = () => {
    router.push("/owner-supplier-requests");
  };

  const handleStaff = () => {
    router.push("/owner-staff-management");
  };

  const handleReports = () => {
    console.log("Reports");
  };

  const handleProfile = () => {
    router.push("/owner-profile");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>Local Grocery</Text>

            <Text style={styles.welcome}>Owner Dashboard</Text>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleProfile}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* WELCOME SECTION */}
        <View style={styles.welcomeSection}>
          <Text style={styles.title}>Welcome, Owner 👋</Text>

          <Text style={styles.description}>
            Manage supplier registrations, staff accounts and business
            activities.
          </Text>
        </View>

        {/* DASHBOARD CARDS */}
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
    </SafeAreaView>
  );
}
