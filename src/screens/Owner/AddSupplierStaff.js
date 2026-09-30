import { useState } from "react";

import {
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

import { router } from "expo-router";

import { API_URL } from "../../constants/api";
import styles from "./AddSupplierStaff.styles";

export default function AddSupplierStaff() {
  const [fullName, setFullName] = useState("");
  const [nic, setNic] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [loading, setLoading] = useState(false);

  const handleAddStaff = async () => {
    if (
      !fullName.trim() ||
      !nic.trim() ||
      !email.trim() ||
      !address.trim() ||
      !phoneNumber.trim()
    ) {
      Alert.alert("Missing Information", "Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/staff/supplier`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          nic: nic.trim(),
          email: email.trim(),
          address: address.trim(),
          phoneNumber: phoneNumber.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Supplier Staff Created",
          `Account created successfully.\n\nEmail: ${data.staff.email}\nPhone: ${data.staff.phoneNumber}\n\nTemporary Password:\n${data.temporaryPassword}`,
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ],
        );
      } else {
        Alert.alert(
          "Failed",
          data.message || "Could not create Supplier Staff account.",
        );
      }
    } catch (error) {
      console.log("Add Supplier Staff error:", error);

      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View>
              <Text style={styles.headerTitle}>Add Supplier Staff</Text>

              <Text style={styles.headerSubtitle}>
                Create a supplier staff account
              </Text>
            </View>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Staff Information</Text>

            <Text style={styles.label}>Full Name</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter full name"
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={styles.label}>NIC</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter NIC number"
              value={nic}
              onChangeText={setNic}
              autoCapitalize="characters"
            />

            <Text style={styles.label}>Email</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Phone Number</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Address</Text>

            <TextInput
              style={[styles.input, styles.addressInput]}
              placeholder="Enter address"
              value={address}
              onChangeText={setAddress}
              multiline
            />

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                🔐 A temporary password will be automatically generated for this
                staff account.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.disabledButton]}
              onPress={handleAddStaff}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? "Creating..." : "Create Supplier Staff"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
