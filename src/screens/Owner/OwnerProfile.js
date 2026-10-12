import { useCallback, useState } from "react";

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

import { router, useFocusEffect } from "expo-router";

import { API_URL } from "../../constants/api";
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

  const handleDeleteAccount = () => {
    const ownerId = owner?._id || owner?.id;
    if (!ownerId) {
      Alert.alert("Error", "Owner ID not found.");
      return;
    }

    Alert.alert(
      "Delete account",
      "This permanently deletes your owner account. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(
                `${API_URL}/api/owners/profile/${ownerId}`,
                { method: "DELETE" },
              );
              const data = await response.json();
              if (!response.ok) {
                throw new Error(data.message || "Could not delete account.");
              }

              await AsyncStorage.multiRemove([
                "owner",
                "user",
                "userRole",
              ]);
              router.replace("/login");
            } catch (error) {
              console.error("Delete owner account error:", error);
              Alert.alert(
                "Delete Failed",
                error.message || "Could not delete your account.",
              );
            }
          },
        },
      ],
    );
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

  const profileImage =
    typeof owner.profileImage === "string" && owner.profileImage
      ? owner.profileImage.startsWith("/")
        ? `${API_URL}${owner.profileImage}`
        : owner.profileImage
      : null;

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
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(owner.fullName || "O").charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

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
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push("/owner-edit-profile")}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
