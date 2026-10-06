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
  Platform,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";

import { API_URL } from "../../constants/api";
import styles from "./CustomerStaffInventory.styles";

const CATEGORIES = [
  { id: "all", label: "All Items", icon: "🛍️" },
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
  image: "",
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

  const getImageUrl = (product) => {
    if (product.image) {
      if (
        product.image.startsWith("http://") ||
        product.image.startsWith("https://") ||
        product.image.startsWith("file://") || 
        product.image.startsWith("content://") || 
        product.image.startsWith("data:") || 
        product.image.startsWith("blob:")
      ) {
        return product.image;
      }
      return `${API_URL}${product.image.startsWith("/") ? product.image : `/${product.image}`}`;
    }
    const name = (product.name || "").toLowerCase();
    if (name.includes("banana")) return "https://images.unsplash.com/photo-1571501478200-720615709ee0?auto=format&fit=crop&w=200&q=80";
    if (product.category === "Vegetables") return "https://images.unsplash.com/photo-1566385101042-1a0e10ccff12?auto=format&fit=crop&w=200&q=80";
    if (product.category === "Fruits") return "https://images.unsplash.com/photo-1610832958506-aa56368149eb?auto=format&fit=crop&w=200&q=80";
    if (product.category === "Grains") return "https://images.unsplash.com/photo-1586201375761-83865001e8aa?auto=format&fit=crop&w=200&q=80";
    if (product.category === "Spices") return "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=200&q=80";
    return null;
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Vegetables":
        return "🥬";
      case "Fruits":
        return "🍎";
      case "Grocery":
        return "🛒";
      case "Grains":
        return "🌾";
      case "Spices":
        return "🌶️";
      default:
        return "🥬";
    }
  };

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
    });
    setModalVisible(true);
  };

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
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

      if (!result.canceled && result.assets?.length > 0) {
        setForm({ ...form, image: result.assets[0].uri });
      }
    } catch (error) {
      console.log("Image picker error:", error);
      Alert.alert("Error", "Could not select image.");
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.price || form.stockQuantity === "") {
      Alert.alert("Missing fields", "Name, price and stock are required.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("category", form.category.trim());
      formData.append("price", String(form.price));
      formData.append("stockQuantity", String(form.stockQuantity));
      formData.append("unit", form.unit.trim());
      formData.append("description", form.description.trim());
      formData.append("inStock", String(Number(form.stockQuantity) > 0));
      if (staffId) formData.append("createdBy", staffId);

      if (form.image && !form.image.startsWith("http://") && !form.image.startsWith("https://")) {
        const filename = form.image.split("/").pop() || "product-image.jpg";
        
        if (Platform.OS === 'web') {
          const response = await fetch(form.image);
          const blob = await response.blob();
          formData.append("image", blob, "product-image.jpg");
        } else {
          formData.append("image", {
            uri: form.image,
            name: filename,
            type: "image/jpeg"
          });
        }
      }

      const url = editingProduct
        ? `${API_URL}/api/shop-products/${editingProduct._id}`
        : `${API_URL}/api/shop-products`;

      const response = await fetch(url, {
        method: editingProduct ? "PUT" : "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setModalVisible(false);
        Alert.alert(
          "Success",
          editingProduct ? "Product updated." : "Product added to store.",
        );
        fetchProducts();
      } else {
        Alert.alert("Error", data.message || "Could not save product.");
      }
    } catch (error) {
      console.log("Save product error:", error);
      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingProduct) return;
    
    Alert.alert(
      "Confirm Removal",
      "Are you sure you want to remove this product?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: async () => {
            try {
              setSaving(true);
              const response = await fetch(`${API_URL}/api/shop-products/${editingProduct._id}`, {
                method: "DELETE"
              });
              
              if (response.ok) {
                setModalVisible(false);
                fetchProducts();
                Alert.alert("Success", "Product removed.");
              } else {
                const data = await response.json();
                Alert.alert("Error", data.message || "Could not remove product.");
              }
            } catch (error) {
              console.log("Remove product error:", error);
              Alert.alert("Connection Error", "Could not connect to the server.");
            } finally {
              setSaving(false);
            }
          }
        }
      ]
    );
  };

  // Filter products by category and search string
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

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#15803D" />
          <Text style={styles.loadingText}>Loading inventory items...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with Search and Add Item Button */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.headerTitle}>Store Inventory</Text>
              <Text style={styles.headerSubtitle}>
                {filteredProducts.length} items available
              </Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={openAdd}>
              <Text style={styles.addButtonText}>+ Add Product</Text>
            </TouchableOpacity>
          </View>

          {/* Search Box */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by product name..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Category Filter Pills */}
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
                  style={[
                    styles.categoryPill,
                    isSelected && styles.categoryPillActive,
                  ]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text
                    style={[
                      styles.categoryText,
                      isSelected && styles.categoryTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Product Grid List */}
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchProducts();
              }}
              colors={["#15803D"]}
            />
          }
        >
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyTitle}>No Products Found</Text>
              <Text style={styles.emptyText}>
                {selectedCategory !== "all"
                  ? `No items found under "${selectedCategory}".`
                  : "Add grocery items so customers can place orders."}
              </Text>
            </View>
          ) : (
            filteredProducts.map((product) => {
              const imageUrl = getImageUrl(product);
              const inStock = product.inStock && product.stockQuantity > 0;
              const catIcon = getCategoryIcon(product.category);

              return (
                <TouchableOpacity
                  key={product._id}
                  style={styles.productCard}
                  onPress={() => openEdit(product)}
                  activeOpacity={0.88}
                >
                  <View style={styles.productImageBox}>
                    {imageUrl ? (
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={styles.productImageIcon}>{catIcon}</Text>
                    )}
                    <View style={styles.categoryBadgeTop}>
                      <Text style={styles.categoryBadgeTopText}>
                        {product.category || "Grocery"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.productBody}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {product.name}
                    </Text>
                    <Text style={styles.productMeta}>
                      Unit: {product.unit || "kg"}
                    </Text>

                    <Text style={styles.productPrice}>
                      Rs. {Number(product.price).toFixed(2)}
                    </Text>

                    <View style={styles.stockRow}>
                      <View
                        style={[
                          styles.stockBadge,
                          !inStock && styles.stockBadgeOut,
                        ]}
                      >
                        <Text
                          style={[
                            styles.stockText,
                            !inStock && styles.stockTextOut,
                          ]}
                        >
                          {inStock ? `${product.stockQuantity} in stock` : "Out of Stock"}
                        </Text>
                      </View>
                      <Text style={styles.editLink}>Edit ✏️</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>

        {/* 5-Tab Bottom Navigation Bar */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.replace("/customer-staff-dashboard")}
          >
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>📦</Text>
            <Text style={styles.navLabelActive}>Inventory</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.replace("/customer-staff-orders")}
          >
            <Text style={styles.navIcon}>📋</Text>
            <Text style={styles.navLabel}>Orders</Text>
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

        {/* Add/Edit Product Modal */}
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
                <Text style={styles.modalTitle}>
                  {editingProduct ? "Edit Product Details" : "Add New Product"}
                </Text>

                <Text style={styles.inputLabel}>Product Image</Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                  <TouchableOpacity
                    onPress={pickImage}
                    style={{
                      width: 80,
                      height: 80,
                      backgroundColor: "#F1F5F9",
                      borderRadius: 8,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 16,
                      borderWidth: 1,
                      borderColor: "#E2E8F0",
                      overflow: 'hidden'
                    }}
                  >
                    {form.image ? (
                      <Image
                        source={{ uri: getImageUrl({ image: form.image }) }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={{ fontSize: 24 }}>📷</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={pickImage}>
                    <Text style={{ color: "#15803D", fontWeight: "600" }}>
                      {form.image ? "Change Image" : "Upload Image"}
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.inputLabel}>Product Name</Text>
                <TextInput
                  style={styles.input}
                  value={form.name}
                  onChangeText={(text) => setForm({ ...form, name: text })}
                  placeholder="e.g. Fresh Tomatoes"
                  placeholderTextColor="#94A3B8"
                />

                <Text style={styles.inputLabel}>Select Category</Text>
                <View style={styles.categorySelectRow}>
                  {["Vegetables", "Fruits", "Grocery", "Grains", "Spices"].map(
                    (cat) => {
                      const isSelected = form.category === cat;
                      return (
                        <TouchableOpacity
                          key={cat}
                          style={[
                            styles.categoryChip,
                            isSelected && styles.categoryChipSelected,
                          ]}
                          onPress={() => setForm({ ...form, category: cat })}
                        >
                          <Text
                            style={[
                              styles.categoryChipText,
                              isSelected && styles.categoryChipTextSelected,
                            ]}
                          >
                            {cat}
                          </Text>
                        </TouchableOpacity>
                      );
                    },
                  )}
                </View>

                <Text style={styles.inputLabel}>Price per Unit (Rs.)</Text>
                <TextInput
                  style={styles.input}
                  value={form.price}
                  onChangeText={(text) => setForm({ ...form, price: text })}
                  keyboardType="numeric"
                  placeholder="350"
                  placeholderTextColor="#94A3B8"
                />

                <Text style={styles.inputLabel}>Stock Quantity</Text>
                <TextInput
                  style={styles.input}
                  value={form.stockQuantity}
                  onChangeText={(text) =>
                    setForm({ ...form, stockQuantity: text })
                  }
                  keyboardType="numeric"
                  placeholder="40"
                  placeholderTextColor="#94A3B8"
                />

                <Text style={styles.inputLabel}>Measurement Unit</Text>
                <TextInput
                  style={styles.input}
                  value={form.unit}
                  onChangeText={(text) => setForm({ ...form, unit: text })}
                  placeholder="kg / pack / bottle"
                  placeholderTextColor="#94A3B8"
                />

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                  disabled={saving}
                >
                  <Text style={styles.saveButtonText}>
                    {saving
                      ? "Saving Product..."
                      : editingProduct
                        ? "Save Changes"
                        : "Add to Store Inventory"}
                  </Text>
                </TouchableOpacity>
                {editingProduct && (
                  <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: "#DC2626", marginTop: 8 }]}
                    onPress={handleDelete}
                    disabled={saving}
                  >
                    <Text style={styles.saveButtonText}>
                      Remove Product
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{ marginTop: 12, alignItems: "center", padding: 8 }}
                >
                  <Text style={{ color: "#64748B", fontWeight: "600" }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

