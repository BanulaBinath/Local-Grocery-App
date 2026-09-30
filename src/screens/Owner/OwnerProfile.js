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

import styles from "./OwnerProfile.styles";

export default function OwnerProfile() {
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOwner = async () => {
    try {
      setLoading(true);

      const storedOwner = await AsyncStorage.getItem("owner");

      if (!storedOwner) {
        Alert.alert("Error", "Owner information not found.");
        return;
      }

      const ownerData = JSON.parse(storedOwner);

      setOwner(ownerData);
    } catch (error) {
      console.error("Load owner profile error:", error);

      Alert.alert("Error", "Failed to load owner profile.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOwner();
    }, []),
  );

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
            await AsyncStorage.removeItem("owner");
            await AsyncStorage.removeItem("user");
            await AsyncStorage.removeItem("userRole");

            router.replace("/login");
          } catch (error) {
            console.error("Owner logout error:", error);
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

  if (!owner) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>👤</Text>

          <Text style={styles.emptyTitle}>Owner Profile Not Found</Text>

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
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonIconText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Profile</Text>

          <View style={styles.headerSpace} />
        </View>

        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(owner.fullName || "O").charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.name}>{owner.fullName || "Owner"}</Text>

          <Text style={styles.role}>Owner</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name</Text>

              <Text style={styles.infoValue}>
                {owner.fullName || "Not provided"}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>

              <Text style={styles.infoValue}>
                {owner.email || "Not provided"}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Role</Text>

              <Text style={styles.infoValue}>Owner</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Status</Text>

          <View style={styles.statusCard}>
            <View style={styles.statusDot} />

            <View>
              <Text style={styles.statusTitle}>Account Status</Text>

              <Text style={styles.statusValue}>Active</Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
