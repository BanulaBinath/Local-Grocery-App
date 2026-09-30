import { useCallback, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { router, useFocusEffect } from "expo-router";

import { API_URL } from "../../constants/api";

import styles from "./CustomerStaffEditProfile.styles";

export default function CustomerStaffEditProfile() {
  const [staff, setStaff] = useState(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [nic, setNic] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

      setFullName(staffData.fullName || "");
      setEmail(staffData.email || "");
      setNic(staffData.nic || "");
      setAddress(staffData.address || "");
      setPhoneNumber(staffData.phoneNumber || "");
    } catch (error) {
      console.error("Load Customer Staff profile error:", error);

      Alert.alert("Error", "Failed to load profile information.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, []),
  );

  const handleSave = async () => {
    if (!staff) {
      return;
    }

    if (
      !fullName.trim() ||
      !email.trim() ||
      !nic.trim() ||
      !address.trim() ||
      !phoneNumber.trim()
    ) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }

    if (saving) {
      return;
    }

    const staffId = staff._id || staff.id;

    if (!staffId) {
      Alert.alert("Error", "Customer Staff ID not found.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API_URL}/api/staff/customer/${staffId}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          nic: nic.trim(),
          address: address.trim(),
          phoneNumber: phoneNumber.trim(),
        }),
      });

      const data = await response.json();

      console.log("Update Customer Staff response:", data);

      if (!response.ok) {
        Alert.alert("Error", data.message || "Failed to update profile.");
        return;
      }

      const updatedStaff = data.staff ||
        data.data || {
          ...staff,
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          nic: nic.trim(),
          address: address.trim(),
          phoneNumber: phoneNumber.trim(),
        };

      await AsyncStorage.setItem("customerStaff", JSON.stringify(updatedStaff));

      await AsyncStorage.setItem("user", JSON.stringify(updatedStaff));

      setStaff(updatedStaff);

      Alert.alert("Success", "Your profile has been updated successfully.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Update Customer Staff profile error:", error);

      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E3A8A" />

        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={saving}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit Profile</Text>

        <View style={styles.headerSpace} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.profileIcon}>
          <Text style={styles.profileIconText}>
            {(fullName || "S").charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.pageTitle}>Update Your Information</Text>

        <Text style={styles.pageDescription}>
          Keep your customer staff account information up to date.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>

          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter full name"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>Email</Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>NIC</Text>

          <TextInput
            style={styles.input}
            value={nic}
            onChangeText={setNic}
            placeholder="Enter NIC"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>Phone Number</Text>

          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter phone number"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Address</Text>

          <TextInput
            style={[styles.input, styles.addressInput]}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter address"
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.disabledButton]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={saving}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
