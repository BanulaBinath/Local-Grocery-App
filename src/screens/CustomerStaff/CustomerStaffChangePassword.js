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

import styles from "./CustomerStaffChangePassword.styles";

export default function CustomerStaffChangePassword() {
  const [staff, setStaff] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadStaff = async () => {
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
      console.error("Load Customer Staff error:", error);

      Alert.alert("Error", "Failed to load account information.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadStaff();
    }, []),
  );

  const handleChangePassword = async () => {
    if (!staff) {
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Missing Information", "Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        "Invalid Password",
        "New password must be at least 6 characters.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Password Mismatch",
        "New password and confirm password do not match.",
      );
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert(
        "Invalid Password",
        "New password must be different from the current password.",
      );
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

      const response = await fetch(
        `${API_URL}/api/staff/customer/${staffId}/password`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      const data = await response.json();

      console.log("Change Customer Staff password response:", data);

      if (!response.ok) {
        Alert.alert("Error", data.message || "Failed to change password.");
        return;
      }

      const updatedStaff = {
        ...staff,
        mustChangePassword: false,
      };

      await AsyncStorage.setItem("customerStaff", JSON.stringify(updatedStaff));

      await AsyncStorage.setItem("user", JSON.stringify(updatedStaff));

      setStaff(updatedStaff);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      Alert.alert("Success", "Your password has been changed successfully.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Change Customer Staff password error:", error);

      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E3A8A" />

        <Text style={styles.loadingText}>Loading...</Text>
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

        <Text style={styles.headerTitle}>Change Password</Text>

        <View style={styles.headerSpace} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🔐</Text>
        </View>

        <Text style={styles.pageTitle}>Change Your Password</Text>

        <Text style={styles.pageDescription}>
          Use a strong password that you do not use for other accounts.
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Current Password</Text>

          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            autoCapitalize="none"
          />

          <Text style={styles.label}>New Password</Text>

          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            autoCapitalize="none"
          />

          <Text style={styles.passwordHint}>Minimum 6 characters</Text>

          <Text style={styles.label}>Confirm New Password</Text>

          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.disabledButton]}
          onPress={handleChangePassword}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>Change Password</Text>
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
