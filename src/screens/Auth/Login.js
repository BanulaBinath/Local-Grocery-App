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

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import { API_URL } from "../../constants/api";
import styles from "./Login.styles";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        "Missing Information",
        "Please enter your email and password.",
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      // ========================================
      // LOGIN SUCCESS
      // ========================================

      if (response.ok) {
        await AsyncStorage.setItem("user", JSON.stringify(data.user));

        await AsyncStorage.setItem("userRole", data.role);

        console.log("Logged in user:", data.user);
        console.log("User role:", data.role);

        // ========================================
        // CUSTOMER
        // ========================================

        if (data.role === "customer") {
          await AsyncStorage.setItem("customer", JSON.stringify(data.user));

          router.replace("/customer-home");
          return;
        }

        // ========================================
        // SUPPLIER
        // ========================================

        if (data.role === "supplier") {
          await AsyncStorage.setItem("supplier", JSON.stringify(data.user));

          router.replace("/supplier-dashboard");
          return;
        }

        // ========================================
        // OWNER
        // ========================================

        if (data.role === "owner") {
          await AsyncStorage.setItem("owner", JSON.stringify(data.user));

          router.replace("/owner-dashboard");
          return;
        }

        // ========================================
        // SUPPLIER STAFF
        // ========================================

        if (data.role === "supplier_staff") {
          await AsyncStorage.setItem(
            "supplierStaff",
            JSON.stringify(data.user),
          );

          router.replace("/supplier-staff-dashboard");
          return;
        }

        // ========================================
        // CUSTOMER STAFF
        // ========================================

        if (data.role === "customer_staff") {
          await AsyncStorage.setItem(
            "customerStaff",
            JSON.stringify(data.user),
          );

          router.replace("/customer-staff-dashboard");
          return;
        }

        // ========================================
        // UNKNOWN ROLE
        // ========================================

        Alert.alert("Login Error", "Unknown account role.");
      } else {
        Alert.alert(
          "Login Failed",
          data.message || "Invalid email or password.",
        );
      }
    } catch (error) {
      console.log("Login error:", error);

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

            <Text style={styles.title}>Welcome Back 👋</Text>

            <Text style={styles.subtitle}>
              Login to continue to your account
            </Text>
          </View>

          {/* Login Form */}

          <View style={styles.form}>
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

            <Text style={styles.label}>Password</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              style={[styles.loginButton, loading && { opacity: 0.6 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? "Logging in..." : "Login"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.forgotButton}
              onPress={() =>
                Alert.alert(
                  "Forgot Password",
                  "Password reset feature will be added later.",
                )
              }
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Register */}

          <View style={styles.registerSection}>
            <Text style={styles.registerText}>Don't have an account?</Text>

            <TouchableOpacity onPress={() => router.push("/register-choice")}>
              <Text style={styles.registerLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
