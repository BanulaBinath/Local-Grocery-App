import { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

import { API_URL } from "../../constants/api";
import styles from "./SupplierRegister.styles";

export default function SupplierRegister() {
  const [nic, setNic] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessRegNo, setBusinessRegNo] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    // Check required fields
    if (
      !nic ||
      !email ||
      !fullName ||
      !password ||
      !address ||
      !businessName ||
      !businessRegNo
    ) {
      Alert.alert("Missing Information", "Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/suppliers/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileImage: profileImage || "",
          nic,
          email,
          fullName,
          password,
          address,
          businessName,
          businessRegistrationNo: businessRegNo,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Registration Submitted",
          "Your supplier account has been submitted successfully. Please wait for Owner approval.",
          [
            {
              text: "OK",
              onPress: () => router.push("/login"),
            },
          ],
        );
      } else {
        Alert.alert(
          "Registration Failed",
          data.message || "Something went wrong.",
        );
      }
    } catch (error) {
      console.log("Supplier registration error:", error);

      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.logo}>Local Grocery</Text>

            <Text style={styles.title}>Supplier Registration</Text>

            <Text style={styles.subtitle}>
              Register your shop and start supplying products to local
              customers.
            </Text>
          </View>

          {/* Profile Image */}
          <View style={styles.profileSection}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Text style={styles.profileIcon}>👤</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.imageButton}
              onPress={handlePickImage}
            >
              <Text style={styles.imageButtonText}>
                {profileImage ? "Change Profile Image" : "Choose Profile Image"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>NIC</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your NIC"
              placeholderTextColor="#999"
              value={nic}
              onChangeText={setNic}
              autoCapitalize="characters"
            />

            <Text style={styles.label}>Email</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Full Name</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={styles.label}>Password</Text>

            <TextInput
              style={styles.input}
              placeholder="Create a password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Text style={styles.label}>Address</Text>

            <TextInput
              style={[styles.input, styles.addressInput]}
              placeholder="Enter your address"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={address}
              onChangeText={setAddress}
            />

            <Text style={styles.label}>Business Name</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your business name"
              placeholderTextColor="#999"
              value={businessName}
              onChangeText={setBusinessName}
            />

            <Text style={styles.label}>Business Registration No.</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter registration number"
              placeholderTextColor="#999"
              value={businessRegNo}
              onChangeText={setBusinessRegNo}
              autoCapitalize="characters"
            />

            <View style={styles.noticeBox}>
              <Text style={styles.noticeTitle}>Account Approval</Text>

              <Text style={styles.noticeText}>
                Your supplier account will be reviewed by the shop owner. You
                can access the supplier account after approval.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.registerButton, loading && { opacity: 0.6 }]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? "Submitting..." : "Submit Registration"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.loginSection}>
            <Text style={styles.loginText}>Already have an account?</Text>

            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
