import { useState } from "react";

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

import styles from "./SupplierStaffChangePassword.styles";

export default function SupplierStaffChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [saving, setSaving] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword) {
      Alert.alert("Validation", "Please enter your current password.");
      return;
    }

    if (!newPassword) {
      Alert.alert("Validation", "Please enter your new password.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Validation", "New password must be at least 6 characters.");
      return;
    }

    if (!confirmPassword) {
      Alert.alert("Validation", "Please confirm your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Validation", "New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert(
        "Validation",
        "New password must be different from your current password.",
      );
      return;
    }

    try {
      setSaving(true);

      const staffData = await AsyncStorage.getItem("supplierStaff");

      if (!staffData) {
        Alert.alert("Error", "Supplier Staff information not found.");
        return;
      }

      const staff = JSON.parse(staffData);

      const staffId = staff._id || staff.id;

      if (!staffId) {
        Alert.alert("Error", "Supplier Staff ID not found.");
        return;
      }

      const url = `${API_URL}/api/staff/supplier/${staffId}/password`;

      console.log("Changing Supplier Staff password...");

      console.log("Password API URL:", url);

      const response = await fetch(url, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const responseText = await response.text();

      console.log("Password response status:", response.status);

      console.log("Password server response:", responseText);

      let data = null;

      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch (error) {
        console.log("Password JSON parse error:", error);

        Alert.alert("Server Error", "The server returned an invalid response.");

        return;
      }

      if (!response.ok) {
        Alert.alert(
          "Password Update Failed",
          data?.message || "Could not change your password.",
        );

        return;
      }

      Alert.alert("Success", "Your password has been changed successfully.", [
        {
          text: "OK",
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.log("Change password error:", error);

      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setSaving(false);
    }
  };

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
            <Text style={styles.headerTitle}>Change Password</Text>

            <Text style={styles.headerSubtitle}>Keep your account secure</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formCard}>
            <Text style={styles.infoText}>
              Enter your current password and create a new password for your
              account.
            </Text>

            {/* CURRENT PASSWORD */}

            <Text style={styles.label}>Current Password</Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showCurrentPassword}
                editable={!saving}
              />

              <TouchableOpacity
                style={styles.showButton}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <Text style={styles.showText}>
                  {showCurrentPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* NEW PASSWORD */}

            <Text style={styles.label}>New Password</Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showNewPassword}
                editable={!saving}
              />

              <TouchableOpacity
                style={styles.showButton}
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Text style={styles.showText}>
                  {showNewPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* CONFIRM PASSWORD */}

            <Text style={styles.label}>Confirm New Password</Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
                editable={!saving}
              />

              <TouchableOpacity
                style={styles.showButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text style={styles.showText}>
                  {showConfirmPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* PASSWORD REQUIREMENTS */}

            <View style={styles.requirementsBox}>
              <Text style={styles.requirementsTitle}>
                Password Requirements
              </Text>

              <Text style={styles.requirement}>• At least 6 characters</Text>

              <Text style={styles.requirement}>
                • New password must be different from current password
              </Text>

              <Text style={styles.requirement}>• Passwords must match</Text>
            </View>

            {/* CHANGE BUTTON */}

            <TouchableOpacity
              style={[styles.changeButton, saving && styles.disabledButton]}
              onPress={handleChangePassword}
              disabled={saving}
            >
              {saving ? (
                <>
                  <ActivityIndicator color="#FFFFFF" />

                  <Text style={styles.changeButtonText}>Changing...</Text>
                </>
              ) : (
                <Text style={styles.changeButtonText}>Change Password</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
