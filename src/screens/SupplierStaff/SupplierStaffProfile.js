import { useEffect, useState } from "react";

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

import { router } from "expo-router";

import styles from "./SupplierStaffProfile.styles";

export default function SupplierStaffProfile() {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const staffData = await AsyncStorage.getItem("supplierStaff");

      if (!staffData) {
        Alert.alert("Error", "Supplier Staff information not found.");

        router.back();
        return;
      }

      const parsedStaff = JSON.parse(staffData);

      setStaff(parsedStaff);
    } catch (error) {
      console.log("Load supplier staff profile error:", error);

      Alert.alert("Error", "Could not load your profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    router.push("/supplier-staff-edit-profile");
  };

  const handleChangePassword = () => {
    router.push("/supplier-staff-change-password");
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
            await AsyncStorage.multiRemove([
              "user",
              "userRole",
              "supplierStaff",
            ]);

            router.replace("/login");
          } catch (error) {
            console.log("Logout error:", error);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#1E3A8A" />

          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!staff) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>
            Profile information not available.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View>
            <Text style={styles.headerTitle}>My Profile</Text>

            <Text style={styles.headerSubtitle}>Supplier Staff Account</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Header */}

          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {staff.fullName ? staff.fullName.charAt(0).toUpperCase() : "S"}
              </Text>
            </View>

            <Text style={styles.name}>
              {staff.fullName || "Supplier Staff"}
            </Text>

            <Text style={styles.role}>Supplier Staff</Text>
          </View>

          {/* Edit Profile Button */}

          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editButtonIcon}>✏️</Text>

            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          {/* Personal Information */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Full Name</Text>

                <Text style={styles.infoValue}>
                  {staff.fullName || "Not available"}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>

                <Text style={styles.infoValue}>
                  {staff.email || "Not available"}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>NIC</Text>

                <Text style={styles.infoValue}>
                  {staff.nic || "Not available"}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone</Text>

                <Text style={styles.infoValue}>
                  {staff.phoneNumber || "Not available"}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRowColumn}>
                <Text style={styles.infoLabel}>Address</Text>

                <Text style={styles.addressValue}>
                  {staff.address || "Not available"}
                </Text>
              </View>
            </View>
          </View>

          {/* Account Information */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Information</Text>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Role</Text>

                <Text style={styles.roleValue}>Supplier Staff</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Account Status</Text>

                <Text style={styles.activeValue}>Active</Text>
              </View>
            </View>
          </View>

          {/* Change Password */}

          <TouchableOpacity
            style={styles.passwordButton}
            onPress={handleChangePassword}
          >
            <View>
              <Text style={styles.passwordButtonTitle}>Change Password</Text>

              <Text style={styles.passwordButtonDescription}>
                Update your account password
              </Text>
            </View>

            <Text style={styles.passwordArrow}>›</Text>
          </TouchableOpacity>

          {/* Logout */}

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
