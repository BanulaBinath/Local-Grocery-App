import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

import { router, useFocusEffect } from "expo-router";

import { API_URL } from "../../constants/api";
import styles from "./CustomerStaffInventory.styles";

const CATEGORIES = [
  { id: "all", label: "All", icon: "🛍️" },
  { id: "Vegetables", label: "Vegetables", icon: "🥬" },
  { id: "Fruits", label: "Fruits", icon: "🍎" },
  { id: "Grocery", label: "Grocery", icon: "🛒" },
  { id: "Grains", label: "Grains", icon: "🌾" },
  { id: "Spices", label: "Spices", icon: "🌶️" },
];

const emptyForm = {
  name: "",
  category: "Vegetables",
  price: "",
  stockQuantity: "",
  unit: "kg",
  description: "",
  image: "",         // local URI or server path
  imageBase64: null, // base64 string to upload
  imageMime: "image/jpeg",
};

export default function CustomerStaffInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [staffId, setStaffId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const getImageUrl = (item) => {
    if (!item) return null;
    const imgPath = typeof item === "string" ? item : item.image;
    if (!imgPath) return null;
    if (
      imgPath.startsWith("http://") ||
      imgPath.startsWith("https://") ||
      imgPath.startsWith("file://") ||
      imgPath.startsWith("content://") ||
      imgPath.startsWith("data:") ||
      imgPath.startsWith("blob:")
    ) {
      return imgPath;
    }
    return `${API_URL}${imgPath.startsWith("/") ? imgPath : `/${imgPath}`}`;
  };

  const getCategoryIcon = (category) => {
    const map = {
      Vegetables: "🥬",
      Fruits: "🍎",
      Grocery: "🛒",
      Grains: "🌾",
      Spices: "🌶️",
    };
    return map[category] || "🛍️";
  };

  // ─── Fetch Products ──────────────────────────────────────────────────────────

  const fetchProducts = async () => {
    try {
      const staffData = await AsyncStorage.getItem("customerStaff");
      if (staffData) {
        const staff = JSON.parse(staffData);
        setStaffId(staff.id);
      }
      const response = await fetch(`${API_URL}/api/shop-products?all=true`);
      const data = await response.json();
      if (response.ok) {
        setProducts((data.products || []).filter((p) => p.status === "active"));
      } else {
        Alert.alert("Error", data.message || "Could not load inventory.");
      }
    } catch (error) {
      console.log("Fetch inventory error:", error);
      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchProducts();
    }, []),
  );

  // ─── Open Forms ──────────────────────────────────────────────────────────────

  const openAdd = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setModalVisible(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || "",
      category: product.category || "Vegetables",
      price: String(product.price ?? ""),
      stockQuantity: String(product.stockQuantity ?? ""),
      unit: product.unit || "kg",
      description: product.description || "",
      image: product.image || "",
      imageBase64: null,
      imageMime: "image/jpeg",
    });
    setModalVisible(true);
  };

  // ─── Pick Image (base64) ─────────────────────────────────────────────────────

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Required", "Please allow photo library access.");
        return;
      }

      // base64:true makes Expo handle the conversion internally —
      // this works correctly on Android content:// URIs, iOS, and web.
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const asset = result.assets[0];
        setForm((prev) => ({
          ...prev,
          image: asset.uri,            // for preview thumbnail
          imageBase64: asset.base64,   // already base64, no FileSystem needed
          imageMime: asset.mimeType || "image/jpeg",
        }));
      }
    } catch (error) {
      console.log("Image picker error:", error);
      Alert.alert("Error", "Could not open image picker. Please try again.");
    }
  };

  // ─── Handle Save (JSON + Base64) ────────────────────────────────────────────

  const handleSave = async () => {
    if (!form.name.trim() || !form.price || form.stockQuantity === "") {
      Alert.alert("Missing Fields", "Name, price and stock are required.");
      return;
    }

    try {
      setSaving(true);

      // Build the JSON payload — NO FormData, NO multipart
      const payload = {
        name: form.name.trim(),
        category: form.category.trim(),
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity),
        unit: form.unit.trim(),
        description: form.description.trim(),
        inStock: Number(form.stockQuantity) > 0,
        createdBy: staffId || undefined,
      };

      // Attach image as base64 if a new one was picked
      if (form.imageBase64) {
        payload.imageBase64 = form.imageBase64;
        payload.imageMime = form.imageMime || "image/jpeg";
      } else if (form.image && form.image.startsWith("/uploads/")) {
        // Keep existing server image path
        payload.image = form.image;
      }

      const url = editingProduct
        ? `${API_URL}/api/shop-products/${editingProduct._id}`
        : `${API_URL}/api/shop-products`;

      const response = await fetch(url, {
        method: editingProduct ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setModalVisible(false);
        setForm(emptyForm);
        Alert.alert(
          "✅ Success",
          editingProduct ? "Product updated successfully." : "Product added to store.",
        );
        fetchProducts();
      } else {
        Alert.alert("Error", data.message || "Could not save product.");
      }
    } catch (error) {
      console.log("Save product error:", error);
      Alert.alert("Error", "Failed to save product. Please check your connection.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Handle Delete ───────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!editingProduct) return;
    Alert.alert(
      "Remove Product",
      `Remove "${editingProduct.name}" from the store?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              setSaving(true);
              const response = await fetch(
                `${API_URL}/api/shop-products/${editingProduct._id}`,
                { method: "DELETE" },
              );
              if (response.ok) {
                setModalVisible(false);
                fetchProducts();
                Alert.alert("Removed", "Product removed from store.");
              } else {
                const data = await response.json();
                Alert.alert("Error", data.message || "Could not remove product.");
              }
            } catch (error) {
              console.log("Remove product error:", error);
              Alert.alert("Error", "Could not connect to the server.");
            } finally {
              setSaving(false);
            }
          },
        },
      ],
    );
  };

  // ─── Filter ──────────────────────────────────────────────────────────────────

  const filteredProducts = products.filter((product) => {
    const matchesSearch = search
      ? product.name?.toLowerCase().includes(search.toLowerCase()) ||
        product.category?.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesCategory =
      selectedCategory === "all"
        ? true
        : product.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // ─── Loading ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <View style={styles.loadingSpinner}>
            <ActivityIndicator size="large" color="#15803D" />
          </View>
          <Text style={styles.loadingText}>Loading inventory...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.headerTitle}>🏪 Store Inventory</Text>
              <Text style={styles.headerSubtitle}>
                {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} listed
              </Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={openAdd} activeOpacity={0.85}>
              <Text style={styles.addButtonText}>＋ Add</Text>
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Text style={{ color: "#94A3B8", fontSize: 16, paddingLeft: 8 }}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Category Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryContainer}
          >
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                  onPress={() => setSelectedCategory(cat.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Product Grid ── */}
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); fetchProducts(); }}
              colors={["#15803D"]}
              tintColor="#15803D"
            />
          }
        >
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyTitle}>No Products Found</Text>
              <Text style={styles.emptyText}>
                {selectedCategory !== "all"
                  ? `No items in "${selectedCategory}" category.`
                  : "Tap '＋ Add' to add your first product."}
              </Text>
            </View>
          ) : (
            filteredProducts.map((product) => {
              const imageUrl = getImageUrl(product);
              const inStock = product.inStock && product.stockQuantity > 0;
              return (
                <TouchableOpacity
                  key={product._id}
                  style={styles.productCard}
                  onPress={() => openEdit(product)}
                  activeOpacity={0.88}
                >
                  {/* Image */}
                  <View style={styles.productImageBox}>
                    {imageUrl ? (
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.productImagePlaceholder}>
                        <Text style={styles.productImageIcon}>
                          {getCategoryIcon(product.category)}
                        </Text>
                      </View>
                    )}
                    {/* Stock badge */}
                    <View style={[styles.stockBadgeOverlay, !inStock && styles.stockBadgeOverlayOut]}>
                      <Text style={[styles.stockBadgeOverlayText, !inStock && styles.stockBadgeOverlayTextOut]}>
                        {inStock ? "In Stock" : "Out"}
                      </Text>
                    </View>
                    {/* Edit hint */}
                    <View style={styles.editOverlay}>
                      <Text style={styles.editOverlayText}>✏️</Text>
                    </View>
                  </View>

                  {/* Info */}
                  <View style={styles.productBody}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {product.name}
                    </Text>
                    <View style={styles.categoryPillSmall}>
                      <Text style={styles.categoryPillSmallText}>
                        {getCategoryIcon(product.category)} {product.category}
                      </Text>
                    </View>
                    <View style={styles.productBottom}>
                      <Text style={styles.productPrice}>
                        Rs.{Number(product.price).toFixed(0)}
                      </Text>
                      <Text style={styles.productUnit}>/{product.unit || "kg"}</Text>
                    </View>
                    <Text style={styles.productQty}>
                      {inStock ? `${product.stockQuantity} available` : "No stock"}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>

        {/* ── Bottom Nav ── */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.replace("/customer-staff-dashboard")}
          >
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <View style={styles.navActiveIndicator} />
            <Text style={styles.navIconActive}>📦</Text>
            <Text style={styles.navLabelActive}>Inventory</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/customer-staff-messages")}
          >
            <Text style={styles.navIcon}>💬</Text>
            <Text style={styles.navLabel}>Messages</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/customer-staff-profile")}
          >
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navLabel}>Profile</Text>
          </TouchableOpacity>
        </View>

        {/* ── Add / Edit Modal ── */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.modalCard}>
                {/* Modal Handle */}
                <View style={styles.modalHandle} />

                <Text style={styles.modalTitle}>
                  {editingProduct ? "✏️ Edit Product" : "➕ Add New Product"}
                </Text>

                {/* Image Picker */}
                <Text style={styles.inputLabel}>Product Photo</Text>
                <TouchableOpacity
                  onPress={pickImage}
                  style={styles.imagePicker}
                  activeOpacity={0.85}
                >
                  {form.image ? (
                    <Image
                      source={{ uri: form.image.startsWith("/") ? getImageUrl({ image: form.image }) : form.image }}
                      style={styles.imagePickerPreview}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.imagePickerPlaceholder}>
                      <Text style={styles.imagePickerIcon}>📷</Text>
                      <Text style={styles.imagePickerText}>Tap to select photo</Text>
                    </View>
                  )}
                  <View style={styles.imagePickerBadge}>
                    <Text style={styles.imagePickerBadgeText}>
                      {form.imageBase64 ? "✓ Photo ready" : form.image ? "Change Photo" : "Upload Photo"}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Name */}
                <Text style={styles.inputLabel}>Product Name *</Text>
                <TextInput
                  style={styles.input}
                  value={form.name}
                  onChangeText={(text) => setForm({ ...form, name: text })}
                  placeholder="e.g. Fresh Tomatoes"
                  placeholderTextColor="#94A3B8"
                />

                {/* Category */}
                <Text style={styles.inputLabel}>Category *</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: 12 }}
                >
                  <View style={styles.categorySelectRow}>
                    {["Vegetables", "Fruits", "Grocery", "Grains", "Spices"].map((cat) => {
                      const isSelected = form.category === cat;
                      return (
                        <TouchableOpacity
                          key={cat}
                          style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                          onPress={() => setForm({ ...form, category: cat })}
                        >
                          <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextSelected]}>
                            {getCategoryIcon(cat)} {cat}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>

                {/* Price & Stock Row */}
                <View style={styles.rowInputs}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.inputLabel}>Price (Rs.) *</Text>
                    <TextInput
                      style={styles.input}
                      value={form.price}
                      onChangeText={(text) => setForm({ ...form, price: text })}
                      keyboardType="numeric"
                      placeholder="350"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>Stock Qty *</Text>
                    <TextInput
                      style={styles.input}
                      value={form.stockQuantity}
                      onChangeText={(text) => setForm({ ...form, stockQuantity: text })}
                      keyboardType="numeric"
                      placeholder="40"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                </View>

                {/* Unit */}
                <Text style={styles.inputLabel}>Unit</Text>
                <TextInput
                  style={styles.input}
                  value={form.unit}
                  onChangeText={(text) => setForm({ ...form, unit: text })}
                  placeholder="kg / pack / bottle / pcs"
                  placeholderTextColor="#94A3B8"
                />

                {/* Description */}
                <Text style={styles.inputLabel}>Description (optional)</Text>
                <TextInput
                  style={[styles.input, { height: 70, textAlignVertical: "top", paddingTop: 10 }]}
                  value={form.description}
                  onChangeText={(text) => setForm({ ...form, description: text })}
                  placeholder="Brief product description..."
                  placeholderTextColor="#94A3B8"
                  multiline
                />

                {/* Save Button */}
                <TouchableOpacity
                  style={[styles.saveButton, saving && { opacity: 0.7 }]}
                  onPress={handleSave}
                  disabled={saving}
                >
                  <Text style={styles.saveButtonText}>
                    {saving
                      ? "Saving..."
                      : editingProduct
                        ? "💾 Save Changes"
                        : "✅ Add to Inventory"}
                  </Text>
                </TouchableOpacity>

                {/* Remove Button (edit only) */}
                {editingProduct && (
                  <TouchableOpacity
                    style={[styles.saveButton, styles.deleteButton, saving && { opacity: 0.7 }]}
                    onPress={handleDelete}
                    disabled={saving}
                  >
                    <Text style={styles.saveButtonText}>🗑️ Remove Product</Text>
                  </TouchableOpacity>
                )}

                {/* Cancel */}
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
