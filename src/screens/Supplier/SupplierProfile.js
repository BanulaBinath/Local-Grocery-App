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

import styles from "./SupplierProfile.styles";

export default function SupplierProfile() {
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);

  const [profileImage, setProfileImage] = useState(null);

  // ==========================================
  // LOAD SUPPLIER
  // ==========================================

  const loadSupplier = async () => {
    try {
      setLoading(true);

      const storedSupplier = await AsyncStorage.getItem("supplier");

      if (!storedSupplier) {
        Alert.alert("Error", "Supplier information not found.");

        return;
      }

      const supplierData = JSON.parse(storedSupplier);

      console.log("Supplier profile data:", supplierData);

      setSupplier(supplierData);

      // ==========================================
      // PROFILE IMAGE URL
      // ==========================================

      const storedImage = supplierData.profileImage;

      console.log("Supplier profile image:", storedImage);

      if (storedImage && typeof storedImage === "string") {
        const imageUri = storedImage.trim();

        if (imageUri.startsWith("http://") || imageUri.startsWith("https://")) {
          setProfileImage(imageUri);
        } else if (imageUri.startsWith("/")) {
          setProfileImage(`${API_URL}${imageUri}`);
        } else if (imageUri.startsWith("file://")) {
          setProfileImage(imageUri);
        } else {
          console.log("Invalid profile image:", imageUri);

          setProfileImage(null);
        }
      } else {
        setProfileImage(null);
      }
    } catch (error) {
      console.error("Load supplier profile error:", error);

      Alert.alert("Error", "Failed to load supplier profile.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RELOAD WHEN SCREEN FOCUSES
  // ==========================================

  useFocusEffect(
    useCallback(() => {
      loadSupplier();
    }, []),
  );

  // ==========================================
  // EDIT PROFILE
  // ==========================================

  const handleEditProfile = () => {
    router.push("/supplier-edit-profile");
  };

  // ==========================================
  // LOGOUT
  // ==========================================

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
            await AsyncStorage.removeItem("supplier");

            await AsyncStorage.removeItem("user");

            await AsyncStorage.removeItem("userRole");

            router.replace("/login");
          } catch (error) {
            console.error("Logout error:", error);
          }
        },
      },
    ]);
  };

  // ==========================================
  // LOADING
  // ==========================================

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

  // ==========================================
  // EMPTY
  // ==========================================

  if (!supplier) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>👤</Text>

          <Text style={styles.emptyTitle}>Supplier Profile Not Found</Text>

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

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* HEADER */}

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

        {/* PROFILE HEADER */}

        <View style={styles.profileHeader}>
          {profileImage ? (
            <Image
              source={{
                uri: profileImage,
              }}
              style={styles.avatarImage}
              onError={(error) => {
                console.log("Profile image loading error:", error.nativeEvent);

                setProfileImage(null);
              }}
            />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(supplier.fullName || supplier.businessName || "S")
                  .charAt(0)
                  .toUpperCase()}
              </Text>
            </View>
          )}

          <Text style={styles.name}>{supplier.fullName || "Supplier"}</Text>

          <Text style={styles.role}>Supplier</Text>
        </View>

        {/* BUSINESS INFORMATION */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Business Name</Text>

              <Text style={styles.infoValue}>
                {supplier.businessName || "Not provided"}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Business Registration No.</Text>

              <Text style={styles.infoValue}>
                {supplier.businessRegistrationNo || "Not provided"}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address</Text>

              <Text style={styles.infoValue}>
                {supplier.address || "Not provided"}
              </Text>
            </View>
          </View>
        </View>

        {/* PERSONAL INFORMATION */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name</Text>

              <Text style={styles.infoValue}>
                {supplier.fullName || "Not provided"}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>NIC</Text>

              <Text style={styles.infoValue}>
                {supplier.nic || "Not provided"}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>

              <Text style={styles.infoValue}>
                {supplier.email || "Not provided"}
              </Text>
            </View>
          </View>
        </View>

        {/* ACCOUNT STATUS */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Status</Text>

          <View style={styles.statusCard}>
            <View style={styles.statusDot} />

            <View>
              <Text style={styles.statusTitle}>Account Status</Text>

              <Text style={styles.statusValue}>
                {supplier.status || "Active"}
              </Text>
            </View>
          </View>
        </View>

        {/* ACTIONS */}

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editButtonText}>✏️ Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
