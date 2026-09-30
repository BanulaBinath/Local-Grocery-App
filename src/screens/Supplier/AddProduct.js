import { useState } from "react";

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

import { File } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";

import { API_URL } from "../../constants/api";

import styles from "./AddProduct.styles";

export default function AddProduct() {
  const { supplierId, productId } = useLocalSearchParams();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(false);

  // ========================================
  // SELECT IMAGE
  // ========================================
  const pickImage = async () => {
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

      if (!result.canceled && result.assets?.length > 0) {
        const selectedImage = result.assets[0].uri;

        console.log("Selected image:", selectedImage);

        setImage(selectedImage);
      }
    } catch (error) {
      console.log("Image picker error:", error);

      Alert.alert("Error", "Could not select image.");
    }
  };

  // ========================================
  // SAVE PRODUCT
  // ========================================
  const handleSave = async () => {
    if (!supplierId) {
      Alert.alert("Error", "Supplier ID is missing.");
      return;
    }

    if (!name.trim()) {
      Alert.alert("Required", "Please enter product name.");
      return;
    }

    if (!category.trim()) {
      Alert.alert("Required", "Please enter category.");
      return;
    }

    if (!price.trim()) {
      Alert.alert("Required", "Please enter price.");
      return;
    }

    if (!stockQuantity.trim()) {
      Alert.alert("Required", "Please enter stock quantity.");
      return;
    }

    if (!unit.trim()) {
      Alert.alert("Required", "Please enter unit.");
      return;
    }

    const numericPrice = Number(price);
    const numericStock = Number(stockQuantity);

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      Alert.alert("Invalid Price", "Please enter a valid price.");
      return;
    }

    if (Number.isNaN(numericStock) || numericStock < 0) {
      Alert.alert("Invalid Stock", "Please enter a valid stock quantity.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      // ========================================
      // TEXT DATA
      // ========================================

      formData.append("supplierId", String(supplierId));

      formData.append("name", name.trim());

      formData.append("category", category.trim());

      formData.append("description", description.trim());

      formData.append("price", String(numericPrice));

      formData.append("stockQuantity", String(numericStock));

      formData.append("unit", unit.trim());

      // ========================================
      // IMAGE
      // ========================================

      if (
        image &&
        (image.startsWith("file://") || image.startsWith("content://"))
      ) {
        const filename = image.split("/").pop() || "product-image.jpg";

        console.log("Uploading new image:", filename);

        const imageFile = new File(image);

        formData.append("image", imageFile);
      } else {
        console.log("No new image selected.");
      }

      // ========================================
      // API URL
      // ========================================

      const url = productId
        ? `${API_URL}/api/products/${productId}`
        : `${API_URL}/api/products`;

      const method = productId ? "PUT" : "POST";

      console.log("Saving product:", {
        name: name.trim(),
        category: category.trim(),
        price: numericPrice,
        stockQuantity: numericStock,
        unit: unit.trim(),
        supplierId: String(supplierId),
        productId: productId || "new",
      });

      // ========================================
      // SEND REQUEST
      // ========================================

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const data = await response.json();

      console.log("Server response:", data);

      if (!response.ok) {
        Alert.alert("Error", data.message || "Could not save product.");

        return;
      }

      Alert.alert(
        "Success",
        productId
          ? "Product updated successfully."
          : "Product added successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              router.back();
            },
          },
        ],
      );
    } catch (error) {
      console.log("Save product error:", error);

      Alert.alert("Error", "Could not save product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ========================================
            HEADER
        ======================================== */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>
              {productId ? "Edit Product" : "Add Product"}
            </Text>

            <Text style={styles.headerSubtitle}>
              Manage your grocery product
            </Text>
          </View>
        </View>

        {/* ========================================
            IMAGE
        ======================================== */}

        <View style={styles.imageSection}>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={pickImage}
            activeOpacity={0.8}
          >
            {image ? (
              <Image
                source={{
                  uri: image,
                }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imageIcon}>🛒</Text>

                <Text style={styles.imagePlaceholderText}>Add Image</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.chooseImageButton}
            onPress={pickImage}
            activeOpacity={0.8}
          >
            <Text style={styles.chooseImageButtonText}>
              {image ? "Change Image" : "Choose Image"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ========================================
            PRODUCT NAME
        ======================================== */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product Name *</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter product name"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* ========================================
            CATEGORY
        ======================================== */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category *</Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. Fruits, Vegetables"
            placeholderTextColor="#9CA3AF"
            value={category}
            onChangeText={setCategory}
          />
        </View>

        {/* ========================================
            DESCRIPTION
        ======================================== */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter product description"
            placeholderTextColor="#9CA3AF"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* ========================================
            PRICE
        ======================================== */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price *</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter price"
            placeholderTextColor="#9CA3AF"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </View>

        {/* ========================================
            STOCK
        ======================================== */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Stock Quantity *</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter stock quantity"
            placeholderTextColor="#9CA3AF"
            value={stockQuantity}
            onChangeText={setStockQuantity}
            keyboardType="numeric"
          />
        </View>

        {/* ========================================
            UNIT
        ======================================== */}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Unit *</Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. kg, g, litre, pack"
            placeholderTextColor="#9CA3AF"
            value={unit}
            onChangeText={setUnit}
          />
        </View>

        {/* ========================================
            SAVE BUTTON
        ======================================== */}

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveButtonText}>
              {productId ? "Update Product" : "Add Product"}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
