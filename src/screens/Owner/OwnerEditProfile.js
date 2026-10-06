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
import styles from "./OwnerEditProfile.styles";

const toImageUri = (image) => {
  if (!image || typeof image !== "string") {
    return null;
  }
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  if (image.startsWith("/")) {
    return `${API_URL}${image}`;
  }
  return image.startsWith("file://") || image.startsWith("blob:")
    ? image
    : null;
};

export default function OwnerEditProfile() {
  const [owner, setOwner] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadOwner = async () => {
    try {
      setLoading(true);
      const storedOwner = await AsyncStorage.getItem("owner");
      if (!storedOwner) {
        Alert.alert("Error", "Owner information not found.");
        return;
      }

      const ownerData = JSON.parse(storedOwner);
      setOwner(ownerData);
      setFullName(ownerData.fullName || "");
      setEmail(ownerData.email || "");
      setProfileImage(toImageUri(ownerData.profileImage));
    } catch (error) {
      console.error("Load owner edit profile error:", error);
      Alert.alert("Error", "Could not load owner profile.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOwner();
    }, []),
  );

  const handleSelectImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Required", "Please allow photo library access.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Owner image picker error:", error);
      Alert.alert("Error", "Could not select the profile photo.");
    }
  };

  const handleSave = async () => {
    const ownerId = owner?._id || owner?.id;
    if (!ownerId) {
      Alert.alert("Error", "Owner ID not found.");
      return;
    }
    if (!fullName.trim() || !email.trim()) {
      Alert.alert("Missing Information", "Please enter your name and email.");
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("fullName", fullName.trim());
      formData.append("email", email.trim());

      if (profileImage?.startsWith("file://")) {
        const fileName =
          profileImage.split("/").pop() || `owner-${Date.now()}.jpg`;
        formData.append("profileImage", new File(profileImage), fileName);
      }

      const response = await fetch(`${API_URL}/api/owners/profile/${ownerId}`, {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update owner profile.");
      }

      const updatedOwner = data.owner;
      await AsyncStorage.setItem("owner", JSON.stringify(updatedOwner));
      await AsyncStorage.setItem("user", JSON.stringify(updatedOwner));
      Alert.alert("Success", "Your profile has been updated.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Update owner profile error:", error);
      Alert.alert("Update Failed", error.message || "Could not update profile.");
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.headerSpace} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={handleSelectImage}
          activeOpacity={0.8}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(fullName || "O").charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.cameraButton}>
            <Text style={styles.cameraText}>📷</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSelectImage}>
          <Text style={styles.changePhotoText}>Change Profile Photo</Text>
        </TouchableOpacity>

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

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.disabledButton]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
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
