import { useEffect, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { router } from "expo-router";

import { API_URL } from "../../constants/api";

import styles from "./SupplierStaffEditProfile.styles";

export default function SupplierStaffEditProfile() {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nic, setNic] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    loadStaff();
  }, []);

  // ========================================
  // LOAD STAFF DATA
  // ========================================
  const loadStaff = async () => {
    try {
      const staffData = await AsyncStorage.getItem("supplierStaff");

      if (!staffData) {
        Alert.alert("Error", "Supplier Staff information not found.");

        router.back();
        return;
      }

      const parsedStaff = JSON.parse(staffData);

      console.log("Loaded Supplier Staff:", parsedStaff);

      setStaff(parsedStaff);

      setFullName(parsedStaff.fullName || "");
      setEmail(parsedStaff.email || "");
      setPhoneNumber(parsedStaff.phoneNumber || "");
      setNic(parsedStaff.nic || "");
      setAddress(parsedStaff.address || "");
    } catch (error) {
      console.log("Load staff error:", error);

      Alert.alert("Error", "Could not load your profile.");
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // SAVE PROFILE
  // ========================================
  const handleSave = async () => {
    if (!staff) {
      Alert.alert("Error", "Staff information not available.");
      return;
    }

    if (!fullName.trim()) {
      Alert.alert("Validation", "Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Validation", "Please enter your email.");
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert("Validation", "Please enter your phone number.");
      return;
    }

    if (!nic.trim()) {
      Alert.alert("Validation", "Please enter your NIC.");
      return;
    }

    if (!address.trim()) {
      Alert.alert("Validation", "Please enter your address.");
      return;
    }

    // Get staff ID
    const staffId = staff._id || staff.id;

    if (!staffId) {
      Alert.alert("Error", "Staff ID not found.");

      console.log("Staff object without ID:", staff);

      return;
    }

    try {
      setSaving(true);

      const url = `${API_URL}/api/staff/supplier/${staffId}`;

      console.log("Updating Supplier Staff...");

      console.log("API URL:", url);

      console.log("Staff ID:", staffId);

      const requestBody = {
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        nic: nic.trim(),
        address: address.trim(),
      };

      console.log("Request Body:", requestBody);

      const response = await fetch(url, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify(requestBody),
      });

      console.log("Response Status:", response.status);

      console.log("Response OK:", response.ok);

      const responseText = await response.text();

      console.log("Raw Server Response:", responseText);

      let data = null;

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.log("JSON Parse Error:", parseError);

          Alert.alert(
            "Server Error",
            `Server returned an invalid response.\n\nStatus: ${response.status}`,
          );

          return;
        }
      }

      if (!response.ok) {
        Alert.alert(
          "Update Failed",
          data?.message || `Server error (${response.status}).`,
        );

        return;
      }

      if (!data || !data.staff) {
        console.log("Invalid success response:", data);

        Alert.alert(
          "Error",
          "Profile was updated, but the server returned unexpected data.",
        );

        return;
      }

      // ========================================
      // UPDATE LOCAL STORAGE
      // ========================================

      const updatedStaff = {
        ...staff,
        ...data.staff,
      };

      await AsyncStorage.setItem("supplierStaff", JSON.stringify(updatedStaff));

      setStaff(updatedStaff);

      console.log("Updated Supplier Staff:", updatedStaff);

      Alert.alert("Success", "Your profile has been updated successfully.", [
        {
          text: "OK",
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.log("Update supplier staff error:", error);

      Alert.alert(
        "Connection Error",
        "Could not connect to the backend server.\n\nPlease make sure the backend server is running.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // LOADING
  // ========================================

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

  // ========================================
  // UI
  // ========================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View>
            <Text style={styles.headerTitle}>Edit Profile</Text>

            <Text style={styles.headerSubtitle}>
              Update your personal information
            </Text>
          </View>
        </View>

        {/* FORM */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            {/* FULL NAME */}

            <Text style={styles.label}>Full Name</Text>

            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
              editable={!saving}
            />

            {/* EMAIL */}

            <Text style={styles.label}>Email</Text>

            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!saving}
            />

            {/* PHONE */}

            <Text style={styles.label}>Phone Number</Text>

            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter your phone number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              editable={!saving}
            />

            {/* NIC */}

            <Text style={styles.label}>NIC</Text>

            <TextInput
              style={styles.input}
              value={nic}
              onChangeText={setNic}
              placeholder="Enter your NIC"
              placeholderTextColor="#9CA3AF"
              editable={!saving}
            />

            {/* ADDRESS */}

            <Text style={styles.label}>Address</Text>

            <TextInput
              style={[styles.input, styles.addressInput]}
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your address"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              editable={!saving}
            />

            {/* SAVE BUTTON */}

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.disabledButton]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <ActivityIndicator color="#FFFFFF" />

                  <Text style={styles.saveButtonText}>Saving...</Text>
                </>
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
