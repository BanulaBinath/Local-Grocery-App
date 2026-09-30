import { useCallback, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import * as ImagePicker from "expo-image-picker";

import { File } from "expo-file-system";

import { router, useFocusEffect } from "expo-router";

import { API_URL } from "../../constants/api";

import styles from "./SupplierEditProfile.styles";

export default function SupplierEditProfile() {
  const [supplier, setSupplier] = useState(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [nic, setNic] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessRegistrationNo, setBusinessRegistrationNo] = useState("");
  const [address, setAddress] = useState("");

  const [profileImage, setProfileImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

      console.log("Stored supplier:", supplierData);

      setSupplier(supplierData);

      setFullName(supplierData.fullName || "");
      setEmail(supplierData.email || "");
      setNic(supplierData.nic || "");

      setBusinessName(supplierData.businessName || "");

      setBusinessRegistrationNo(supplierData.businessRegistrationNo || "");

      setAddress(supplierData.address || "");

      // ==========================================
      // LOAD PROFILE IMAGE SAFELY
      // ==========================================

      const storedImage = supplierData.profileImage;

      console.log("Stored profile image:", storedImage);

      if (storedImage && typeof storedImage === "string") {
        const imageUri = storedImage.trim();

        if (imageUri.startsWith("http://") || imageUri.startsWith("https://")) {
          setProfileImage(imageUri);
        } else if (imageUri.startsWith("/")) {
          setProfileImage(`${API_URL}${imageUri}`);
        } else if (imageUri.startsWith("file://")) {
          setProfileImage(imageUri);
        } else {
          console.log("Invalid stored image URI:", imageUri);

          setProfileImage(null);
        }
      } else {
        setProfileImage(null);
      }
    } catch (error) {
      console.error("Load supplier error:", error);

      Alert.alert("Error", "Failed to load supplier information.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD WHEN SCREEN OPENS
  // ==========================================

  useFocusEffect(
    useCallback(() => {
      loadSupplier();
    }, []),
  );

  // ==========================================
  // SELECT PROFILE IMAGE
  // ==========================================

  const handleSelectImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow photo library access.",
        );

        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];

        const selectedUri = selectedAsset.uri;

        console.log("Selected image URI:", selectedUri);

        setProfileImage(selectedUri);
      }
    } catch (error) {
      console.error("Image picker error:", error);

      Alert.alert("Error", "Could not select the image.");
    }
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSave = async () => {
    if (!supplier) {
      Alert.alert("Error", "Supplier information not loaded.");

      return;
    }

    if (
      !fullName.trim() ||
      !email.trim() ||
      !nic.trim() ||
      !businessName.trim() ||
      !businessRegistrationNo.trim() ||
      !address.trim()
    ) {
      Alert.alert("Missing Information", "Please fill in all fields.");

      return;
    }

    if (saving) {
      return;
    }

    const supplierId = supplier._id || supplier.id;

    if (!supplierId) {
      Alert.alert("Error", "Supplier ID not found.");

      return;
    }

    try {
      setSaving(true);

      console.log("================================");

      console.log("Updating supplier...");

      console.log("Supplier ID:", supplierId);

      console.log("API URL:", `${API_URL}/api/suppliers/${supplierId}`);

      // ==========================================
      // CREATE FORMDATA
      // ==========================================

      const formData = new FormData();

      formData.append("fullName", fullName.trim());

      formData.append("email", email.trim());

      formData.append("nic", nic.trim());

      formData.append("businessName", businessName.trim());

      formData.append("businessRegistrationNo", businessRegistrationNo.trim());

      formData.append("address", address.trim());

      // ==========================================
      // IMAGE UPLOAD
      // ==========================================

      if (
        profileImage &&
        typeof profileImage === "string" &&
        profileImage.startsWith("file://")
      ) {
        console.log("Preparing image upload...");

        console.log("Image URI:", profileImage);

        const fileName =
          profileImage.split("/").pop() || `supplier-${Date.now()}.jpg`;

        console.log("Image file name:", fileName);

        const imageFile = new File(profileImage);

        console.log("Expo File created:", imageFile);

        console.log("File exists:", imageFile.exists);

        console.log("File size:", imageFile.size);

        formData.append("profileImage", imageFile, fileName);

        console.log("Image added to FormData.");
      }

      console.log("FormData created successfully.");

      console.log("Sending request...");

      // ==========================================
      // SEND REQUEST
      // ==========================================

      const response = await fetch(`${API_URL}/api/suppliers/${supplierId}`, {
        method: "PUT",
        body: formData,
      });

      console.log("Response status:", response.status);

      const responseText = await response.text();

      console.log("Server response:", responseText);

      // ==========================================
      // PARSE SERVER RESPONSE
      // ==========================================

      let data;

      try {
        data = JSON.parse(responseText);
      } catch (error) {
        console.error("JSON parsing error:", error);

        Alert.alert("Server Error", "The server returned an invalid response.");

        return;
      }

      // ==========================================
      // SERVER ERROR
      // ==========================================

      if (!response.ok) {
        Alert.alert(
          "Update Failed",
          data.message || "Failed to update supplier profile.",
        );

        return;
      }

      // ==========================================
      // UPDATED SUPPLIER
      // ==========================================

      const updatedSupplier = data.supplier || {
        ...supplier,

        fullName: fullName.trim(),

        email: email.trim(),

        nic: nic.trim(),

        businessName: businessName.trim(),

        businessRegistrationNo: businessRegistrationNo.trim(),

        address: address.trim(),
      };

      console.log("Updated supplier:", updatedSupplier);

      // ==========================================
      // SAVE TO ASYNC STORAGE
      // ==========================================

      await AsyncStorage.setItem("supplier", JSON.stringify(updatedSupplier));

      await AsyncStorage.setItem("user", JSON.stringify(updatedSupplier));

      setSupplier(updatedSupplier);

      // ==========================================
      // UPDATE PROFILE IMAGE
      // ==========================================

      const updatedImage = updatedSupplier.profileImage;

      if (updatedImage && typeof updatedImage === "string") {
        const imageUri = updatedImage.trim();

        if (imageUri.startsWith("http://") || imageUri.startsWith("https://")) {
          setProfileImage(imageUri);
        } else if (imageUri.startsWith("/")) {
          setProfileImage(`${API_URL}${imageUri}`);
        } else {
          setProfileImage(null);
        }
      }

      console.log("Supplier profile updated successfully.");

      // ==========================================
      // SUCCESS MESSAGE
      // ==========================================

      Alert.alert("Success", "Your profile has been updated successfully.", [
        {
          text: "OK",
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error("================================");

      console.error("SUPPLIER UPDATE ERROR:");

      console.error(error);

      console.error("================================");

      Alert.alert(
        "Update Error",
        error?.message || "Could not update supplier profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E3A8A" />

        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
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
        {/* PROFILE IMAGE */}

        <TouchableOpacity
          style={styles.imageContainer}
          onPress={handleSelectImage}
          activeOpacity={0.8}
        >
          {profileImage ? (
            <Image
              source={{
                uri: profileImage,
              }}
              style={styles.profileImage}
              onError={(error) => {
                console.log("Profile image loading error:", error.nativeEvent);

                setProfileImage(null);
              }}
            />
          ) : (
            <View style={styles.profileIcon}>
              <Text style={styles.profileIconText}>
                {(fullName || businessName || "S").charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          <View style={styles.cameraButton}>
            <Text style={styles.cameraIcon}>📷</Text>
          </View>
        </TouchableOpacity>

        {/* CHANGE PHOTO */}

        <TouchableOpacity onPress={handleSelectImage}>
          <Text style={styles.changePhotoText}>Change Profile Photo</Text>
        </TouchableOpacity>

        {/* TITLE */}

        <Text style={styles.pageTitle}>Update Your Information</Text>

        <Text style={styles.pageDescription}>
          Keep your supplier account information up to date.
        </Text>

        {/* FORM */}

        <View style={styles.form}>
          {/* FULL NAME */}

          <Text style={styles.label}>Full Name</Text>

          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter full name"
            placeholderTextColor="#9CA3AF"
          />

          {/* EMAIL */}

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

          {/* NIC */}

          <Text style={styles.label}>NIC</Text>

          <TextInput
            style={styles.input}
            value={nic}
            onChangeText={setNic}
            placeholder="Enter NIC"
            placeholderTextColor="#9CA3AF"
          />

          {/* BUSINESS NAME */}

          <Text style={styles.label}>Business Name</Text>

          <TextInput
            style={styles.input}
            value={businessName}
            onChangeText={setBusinessName}
            placeholder="Enter business name"
            placeholderTextColor="#9CA3AF"
          />

          {/* BUSINESS REGISTRATION */}

          <Text style={styles.label}>Business Registration No.</Text>

          <TextInput
            style={styles.input}
            value={businessRegistrationNo}
            onChangeText={setBusinessRegistrationNo}
            placeholder="Enter registration number"
            placeholderTextColor="#9CA3AF"
          />

          {/* ADDRESS */}

          <Text style={styles.label}>Address</Text>

          <TextInput
            style={[styles.input, styles.addressInput]}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter business address"
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* SAVE BUTTON */}

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

        {/* CANCEL BUTTON */}

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
