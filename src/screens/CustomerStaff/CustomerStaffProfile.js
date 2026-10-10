import { useCallback, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { router, useFocusEffect } from "expo-router";

import styles from "./CustomerStaffProfile.styles";

export default function CustomerStaffProfile() {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const storedStaff = await AsyncStorage.getItem("customerStaff");

      if (!storedStaff) {
        Alert.alert("Error", "Customer Staff information not found.");
        return;
      }

      const staffData = JSON.parse(storedStaff);

      setStaff(staffData);
    } catch (error) {
      console.error("Load Customer Staff profile error:", error);

      Alert.alert("Error", "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, []),
  );

  const handleEditProfile = () => {
    router.push("/customer-staff-edit-profile");
  };

  const handleChangePassword = () => {
    router.push("/customer-staff-change-password");
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
            await AsyncStorage.removeItem("customerStaff");
            await AsyncStorage.removeItem("user");
            await AsyncStorage.removeItem("userRole");

            router.replace("/login");
          } catch (error) {
            console.error("Customer Staff logout error:", error);
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

  if (!staff) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>👤</Text>

          <Text style={styles.emptyTitle}>Profile Not Found</Text>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButtonIcon}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/customer-staff-dashboard");
              }
            }}
          >
            <Text style={styles.backButtonIconText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Profile</Text>

          <View style={styles.headerSpace} />
        </View>

        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(staff.fullName || "S").charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.name}>{staff.fullName || "Customer Staff"}</Text>

          <Text style={styles.role}>Customer Staff</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name</Text>

              <Text style={styles.infoValue}>
                {staff.fullName || "Not provided"}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>NIC</Text>

              <Text style={styles.infoValue}>
                {staff.nic || "Not provided"}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>

              <Text style={styles.infoValue}>
                {staff.email || "Not provided"}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone Number</Text>

              <Text style={styles.infoValue}>
                {staff.phoneNumber || "Not provided"}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address</Text>

              <Text style={styles.infoValue}>
                {staff.address || "Not provided"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.statusCard}>
            <View style={styles.statusDot} />

            <View style={styles.statusContent}>
              <Text style={styles.statusTitle}>Account Role</Text>

              <Text style={styles.statusValue}>Customer Staff</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editButtonText}>✏️ Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.passwordButton}
            onPress={handleChangePassword}
          >
            <Text style={styles.passwordButtonText}>🔐 Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
