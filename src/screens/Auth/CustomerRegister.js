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
import styles from "./CustomerRegister.styles";

export default function CustomerRegister() {
  const [nic, setNic] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
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
    if (!nic || !email || !fullName || !password || !address) {
      Alert.alert("Missing Information", "Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/customers/register`, {
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
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Registration Successful",
          "Your customer account has been created.",
          [
            {
              text: "Login",
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
      console.log("Registration error:", error);

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
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>Local Grocery</Text>

            <Text style={styles.title}>Customer Registration</Text>

            <Text style={styles.subtitle}>
              Create your account and start ordering groceries from local shops.
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

          {/* Form */}
          <View style={styles.form}>
            {/* NIC */}
            <Text style={styles.label}>NIC</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your NIC"
              placeholderTextColor="#999"
              value={nic}
              onChangeText={setNic}
              autoCapitalize="characters"
            />

            {/* Email */}
            <Text style={styles.label}>Email</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            {/* Full Name */}
            <Text style={styles.label}>Full Name</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
            />

            {/* Password */}
            <Text style={styles.label}>Password</Text>

            <TextInput
              style={styles.input}
              placeholder="Create a password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {/* Address */}
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

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, loading && { opacity: 0.6 }]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? "Creating Account..." : "Create Account"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Section */}
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
