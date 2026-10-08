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
  View
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";

import { API_URL } from "../../constants/api";
import {
  SAMPLE_PRODUCTS,
  resolveProductImageUrl,
} from "../../constants/sampleProducts";
import {
  getCart,
  setCartItemQuantity,
  updateCartItem,
} from "../../utils/cartStorage";
import styles from "./CustomerHome.styles";

const CATEGORIES = [
  { id: "All", label: "All Items", icon: "🛍️" },
  { id: "Vegetables", label: "Vegetables", icon: "🥬" },
  { id: "Fruits", label: "Fruits", icon: "🍎" },
  { id: "Grocery", label: "Grocery", icon: "🛒" },
  { id: "Spices", label: "Spices", icon: "🌶️" },
];

export default function CustomerHome() {
  const [customer, setCustomer] = useState(null);
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Product Details Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalQty, setModalQty] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch logged in customer info
  const loadCustomer = async () => {
    try {
      const data = await AsyncStorage.getItem("customer");
      if (data) {
        const parsed = JSON.parse(data);
        setCustomer(parsed);
        fetchNotificationsCount(parsed._id || parsed.id);
      }
    } catch (e) {
      console.log("Error loading customer profile:", e);
    }
  };

  // Fetch unread notifications count
  const fetchNotificationsCount = async (customerId) => {
    if (!customerId) return;
    try {
      const res = await fetch(
        `${API_URL}/api/notifications/customer/${customerId}`,
      );
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {
      // ignore silent notification error
    }
  };

  // Fetch products from staff inventory (fallback to SAMPLE_PRODUCTS if empty)
  const fetchProducts = async (isSilent = false) => {
    try {
      const response = await fetch(`${API_URL}/api/shop-products`);
      const data = await response.json();

      if (response.ok && Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products);
      } else {
        // Fallback to sample products with images so screen is never empty
        setProducts(SAMPLE_PRODUCTS);
      }
    } catch (error) {
      if (!isSilent) {
        console.log("Fetch shop products error:", error);
      }
      setProducts(SAMPLE_PRODUCTS);
    } finally {
      if (!isSilent) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  // Load persistent cart
  const syncCart = async () => {
    const currentCart = await getCart();
    setCart(currentCart);
  };

  useFocusEffect(
    useCallback(() => {
      loadCustomer();
      syncCart();
      fetchProducts();

      const interval = setInterval(() => {
        fetchProducts(true);
      }, 5000);

      return () => clearInterval(interval);
    }, []),
  );


  const getImageUrl = (product) => {
    // Use the project's standard image resolver first
    const resolvedUrl = resolveProductImageUrl(product);

    if (resolvedUrl) {
      return resolvedUrl;
    }

    // Fallback for staff-added products with relative image paths
    if (product?.image && !product.image.startsWith("file://")) {
      if (
        product.image.startsWith("http://") ||
        product.image.startsWith("https://")
      ) {
        return product.image;
      }

      return `${API_URL}${
        product.image.startsWith("/") ? product.image : `/${product.image}`
      }`;
    }

    // Fallback images
    const name = (product?.name || "").toLowerCase();

    if (name.includes("banana")) {
      return "https://images.unsplash.com/photo-1571501478200-720615709ee0?auto=format&fit=crop&w=200&q=80";
    }

    if (product?.category === "Vegetables") {
      return "https://images.unsplash.com/photo-1566385101042-1a0e10ccff12?auto=format&fit=crop&w=200&q=80";
    }

    if (product?.category === "Fruits") {
      return "https://images.unsplash.com/photo-1610832958506-aa56368149eb?auto=format&fit=crop&w=200&q=80";
    }

    if (product?.category === "Grains") {
      return "https://images.unsplash.com/photo-1586201375761-83865001e8aa?auto=format&fit=crop&w=200&q=80";
    }

    if (product?.category === "Spices") {
      return "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=200&q=80";
    }

    return null;
  };

  const getProductIcon = (product) => {
    const pCat = (product?.category || "").toLowerCase();

    if (pCat.includes("veg")) return "🥬";
    if (pCat.includes("fruit")) return "🍎";
    if (pCat.includes("spice")) return "🌶️";
    if (pCat.includes("dairy")) return "🥛";

    return "🛒";
  };

  const handleProfile = () => {
    router.push("/customer-profile");
  };

  // Update Cart Quantity
  const handleUpdateQty = async (product, delta) => {
    const stockQty = Number(product.stockQuantity) || 0;
    const isOutOfStock = !product.inStock || stockQty <= 0;

    if (isOutOfStock && delta > 0) {
      Alert.alert("Out of Stock", `${product.name} is currently out of stock.`);
      return;
    }

    const currentQty = cart[product._id] || 0;
    if (currentQty + delta > stockQty && delta > 0) {
      Alert.alert(
        "Stock Limit Reached",
        `Only ${stockQty} ${product.unit} available in stock.`,
      );
      return;
    }

    const updated = await updateCartItem(product._id, delta, stockQty);
    setCart({ ...updated });
  };

  // Open Details Modal
  const openProductDetails = (product) => {
    setSelectedProduct(product);
    const existingQty = cart[product._id] || 1;
    const stockQty = Number(product.stockQuantity) || 0;
    const initialQty = stockQty > 0 ? Math.min(existingQty, stockQty) : 1;
    setModalQty(initialQty);
    setModalVisible(true);
  };

  // Add from Details Modal to Cart
  const handleModalAddToCart = async () => {
    if (!selectedProduct) return;
    const stockQty = Number(selectedProduct.stockQuantity) || 0;
    if (!selectedProduct.inStock || stockQty <= 0) {
      Alert.alert("Out of Stock", "This product is currently out of stock.");
      return;
    }

    const updated = await setCartItemQuantity(
      selectedProduct._id,
      modalQty,
      stockQty,
    );
    setCart({ ...updated });
    setModalVisible(false);

    Alert.alert(
      "Added to Cart 🛒",
      `${modalQty} ${selectedProduct.unit} of ${selectedProduct.name} added to your cart.`,
      [
        {
          text: "Go to Cart",
          onPress: () => router.push("/customer-cart"),
        },
        { text: "Continue Shopping" },
      ],
    );
  };

  // Filter products by category and search query
  const filteredProducts = products.filter((product) => {
    // 1. Category check
    let categoryMatches = true;
    if (selectedCategory !== "All") {
      const pCat = (product.category || "").toLowerCase().trim();
      const target = selectedCategory.toLowerCase();
      if (target === "vegetables") categoryMatches = pCat.includes("veg");
      else if (target === "fruits") categoryMatches = pCat.includes("fruit");
      else if (target === "grocery") {
        categoryMatches =
          pCat.includes("groc") ||
          pCat.includes("dairy") ||
          pCat.includes("general");
      } else if (target === "spices") categoryMatches = pCat.includes("spice");
      else categoryMatches = pCat === target;
    }

    if (!categoryMatches) return false;

    // 2. Search query check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const name = (product.name || "").toLowerCase();
      const cat = (product.category || "").toLowerCase();
      const desc = (product.description || "").toLowerCase();

      // Check name, category or description matching
      return name.includes(q) || cat.includes(q) || desc.includes(q);
    }

    return true;
  });

  // Calculate cart counts and total
  const cartItemCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [pId, qty]) => {
    const prod = products.find((p) => p._id === pId);
    return prod ? sum + prod.price * qty : sum;
  }, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Header - ONLY Notification Icon kept at top */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>Local Grocery</Text>
            <Text style={styles.welcome}>
              {customer ? `${customer.fullName.split(" ")[0]} 👋` : "Fresh Store 👋"}
            </Text>
          </View>

          <View style={styles.headerRight}>
            {/* Notification Bell Only */}
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() => router.push("/customer-notifications")}
              activeOpacity={0.8}
            >
              <Text style={styles.headerIconText}>🔔</Text>
              {unreadCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar Section */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search groceries (e.g. carrot, milk, onion)..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.trim() ? (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={styles.clearSearchButton}
              >
                <Text style={styles.clearSearchText}>✕</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          {searchQuery.trim() ? (
            <Text style={styles.searchResultsCount}>
              Found {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""} matching "{searchQuery}"
            </Text>
          ) : null}
        </View>

        {/* Main Scroll Content */}
        <View style={styles.content}>
          {loading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1E3A8A" />
              <Text style={styles.loadingText}>Fetching available stock...</Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => {
                    setRefreshing(true);
                    fetchProducts();
                    syncCart();
                    loadCustomer();
                  }}
                  colors={["#1E3A8A"]}
                />
              }
            >
              {/* Hero Banner */}
              {!searchQuery.trim() && (
                <View style={styles.heroBanner}>
                  <Text style={styles.heroTag}>⚡ DIRECT FROM STORE</Text>
                  <Text style={styles.heroTitle}>Fresh Groceries,</Text>
                  <Text style={styles.heroTitle}>Real-Time Live Stock.</Text>
                  <Text style={styles.heroSubtitle}>
                    Select items, reserve for pickup, and receive live status
                    updates as staff prepares your order!
                  </Text>
                </View>
              )}

              {/* Categories */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {searchQuery.trim() ? "Search Results" : "Categories"}
                </Text>
                <Text style={styles.sectionSubtitle}>
                  {filteredProducts.length} Product
                  {filteredProducts.length !== 1 ? "s" : ""}
                </Text>
              </View>

              {!searchQuery.trim() && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.categoriesScroll}
                  contentContainerStyle={styles.categoriesContainer}
                >
                  {CATEGORIES.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          styles.categoryPill,
                          isActive && styles.categoryPillActive,
                        ]}
                        onPress={() => setSelectedCategory(cat.id)}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.categoryIcon}>{cat.icon}</Text>
                        <Text
                          style={[
                            styles.categoryText,
                            isActive && styles.categoryTextActive,
                          ]}
                        >
                          {cat.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}

              {/* Products List */}
              {filteredProducts.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyIcon}>🔍</Text>
                  <Text style={styles.emptyTitle}>No Products Found</Text>
                  <Text style={styles.emptyText}>
                    {searchQuery.trim()
                      ? `No items match "${searchQuery}". Please check spelling or search another item.`
                      : "No products currently available in this category."}
                  </Text>
                </View>
              ) : (
                filteredProducts.map((product) => {
                  const qty = cart[product._id] || 0;
                  const stockQuantity = Number(product.stockQuantity) || 0;
                  const isOutOfStock = !product.inStock || stockQuantity <= 0;
                  const imageUrl = getImageUrl(product);

                  return (
                    <TouchableOpacity
                      key={product._id}
                      style={[styles.card, isOutOfStock && styles.cardDisabled]}
                      activeOpacity={0.88}
                      onPress={() => openProductDetails(product)}
                    >
                      {/* Product Thumbnail */}
                      <View
                        style={[
                          styles.cardLeft,
                          isOutOfStock && styles.cardLeftDisabled,
                          { overflow: 'hidden' }
                        ]}
                      >
{imageUrl ? (
  <Image
    source={{ uri: imageUrl }}
    style={styles.productThumbImage}
    resizeMode="cover"
  />
                        ) : (
                          <Text style={styles.productIcon}>
                            {getProductIcon(product)}
                          </Text>
                        )}
                      </View>

                      {/* Info */}
                      <View style={styles.cardBody}>
                        <View style={styles.productHeaderRow}>
                          <Text style={styles.productName}>{product.name}</Text>
                          {product.category ? (
                            <Text style={styles.categoryTag}>
                              {product.category}
                            </Text>
                          ) : null}
                        </View>

                        <Text style={styles.productPrice}>
                          Rs. {Number(product.price).toFixed(2)} / {product.unit}
                        </Text>

                        {/* Stock status pill */}
                        <View style={styles.stockRow}>
                          {isOutOfStock ? (
                            <View style={styles.outOfStockBadge}>
                              <Text style={styles.outOfStockText}>
                                ✕ Out of Stock
                              </Text>
                            </View>
                          ) : (
                            <View style={styles.inStockBadge}>
                              <Text style={styles.inStockText}>
                                ✓ In Stock: {stockQuantity} {product.unit}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>

                      {/* Controls */}
                      {isOutOfStock ? (
                        <TouchableOpacity
                          style={[styles.addButton, styles.addButtonDisabled]}
                          disabled={true}
                        >
                          <Text style={styles.addButtonTextDisabled}>Out</Text>
                        </TouchableOpacity>
                      ) : qty > 0 ? (
                        <View
                          style={styles.qtyControls}
                          onStartShouldSetResponder={() => true}
                        >
                          <TouchableOpacity
                            style={styles.qtyButton}
                            onPress={() => handleUpdateQty(product, -1)}
                          >
                            <Text style={styles.qtyButtonText}>−</Text>
                          </TouchableOpacity>
                          <Text style={styles.qtyValue}>{qty}</Text>
                          <TouchableOpacity
                            style={[
                              styles.qtyButton,
                              qty >= stockQuantity && styles.qtyButtonDisabled,
                            ]}
                            onPress={() => handleUpdateQty(product, 1)}
                            disabled={qty >= stockQuantity}
                          >
                            <Text
                              style={[
                                styles.qtyButtonText,
                                qty >= stockQuantity &&
                                  styles.qtyButtonTextDisabled,
                              ]}
                            >
                              +
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.addButton}
                          onPress={() => handleUpdateQty(product, 1)}
                        >
                          <Text style={styles.addButtonText}>+ Add</Text>
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>
          )}
        </View>

        {/* Floating Cart Footer */}
        {cartItemCount > 0 ? (
          <View style={styles.cartFooter}>
            <View style={styles.cartInfo}>
              <Text style={styles.cartCount}>
                🛒 {cartItemCount} item{cartItemCount > 1 ? "s" : ""} selected
              </Text>
              <Text style={styles.cartTotal}>Rs. {cartTotal.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => router.push("/customer-cart")}
              activeOpacity={0.85}
            >
              <Text style={styles.checkoutButtonText}>View Cart & Checkout ›</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Bottom Navigation: 4 clean items (Home, Cart, Feedback, Profile) */}
        <View style={styles.bottomNavigation}>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.activeNavText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/customer-cart")}
          >
            <Text style={styles.navIcon}>🛒</Text>
            <Text style={styles.navText}>Cart</Text>
            {cartItemCount > 0 ? (
              <View style={styles.navBadge}>
                <Text style={styles.navBadgeText}>{cartItemCount}</Text>
              </View>
            ) : null}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/customer-feedbacks")}
          >
            <Text style={styles.navIcon}>⭐</Text>
            <Text style={styles.navText}>Feedback</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/customer-profile")}
          >
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Product Details Modal */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHandleBar} />

              {selectedProduct && (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Top Row: Title + Close Button */}
                  <View style={styles.modalHeaderRow}>
                    <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                    <TouchableOpacity
                      style={styles.modalCloseButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.modalCloseText}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Product Image */}
                  <View style={styles.modalImageWrapper}>
                    {getImageUrl(selectedProduct) ? (
                      <Image
                        source={{ uri: getImageUrl(selectedProduct) }}
                        style={styles.modalImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={styles.modalPlaceholderIcon}>
                        {getProductIcon(selectedProduct)}
                      </Text>
                    )}
                  </View>

                  {/* Price & Category */}
                  <View style={styles.modalMetaRow}>
                    <View style={styles.modalCategoryBadge}>
                      <Text style={styles.modalCategoryBadgeText}>
                        {selectedProduct.category || "General"}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 13, color: "#64748B" }}>
                      Unit: {selectedProduct.unit}
                    </Text>
                  </View>

                  <Text style={styles.modalPriceTag}>
                    Rs. {Number(selectedProduct.price).toFixed(2)}{" "}
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#64748B",
                        fontWeight: "normal",
                      }}
                    >
                      per {selectedProduct.unit}
                    </Text>
                  </Text>

                  {/* Available Stock Box */}
                  <View style={styles.modalStockInfoRow}>
                    <Text style={styles.modalStockLabel}>Available Stock:</Text>
                    <Text style={styles.modalStockValue}>
                      {Number(selectedProduct.stockQuantity) > 0
                        ? `${selectedProduct.stockQuantity} ${selectedProduct.unit} In Stock`
                        : "Out of Stock"}
                    </Text>
                  </View>

                  {/* Description */}
                  <View style={styles.modalDescriptionBox}>
                    <Text style={styles.modalDescriptionLabel}>
                      Product Description:
                    </Text>
                    <Text style={styles.modalDescriptionText}>
                      {selectedProduct.description ||
                        `Fresh, quality-inspected ${selectedProduct.name} sourced directly from local markets and stored under optimal grocery conditions.`}
                    </Text>
                  </View>

                  {/* Quantity Selector */}
                  {Number(selectedProduct.stockQuantity) > 0 ? (
                    <View style={styles.modalQtyRow}>
                      <Text style={styles.modalQtyLabel}>Quantity:</Text>
                      <View style={styles.modalQtyControls}>
                        <TouchableOpacity
                          style={[
                            styles.modalQtyBtn,
                            modalQty <= 1 && styles.modalQtyBtnDisabled,
                          ]}
                          onPress={() => setModalQty(Math.max(1, modalQty - 1))}
                          disabled={modalQty <= 1}
                        >
                          <Text style={styles.modalQtyBtnText}>−</Text>
                        </TouchableOpacity>

                        <Text style={styles.modalQtyValue}>{modalQty}</Text>

                        <TouchableOpacity
                          style={[
                            styles.modalQtyBtn,
                            modalQty >= Number(selectedProduct.stockQuantity) &&
                              styles.modalQtyBtnDisabled,
                          ]}
                          onPress={() =>
                            setModalQty(
                              Math.min(
                                Number(selectedProduct.stockQuantity),
                                modalQty + 1,
                              ),
                            )
                          }
                          disabled={
                            modalQty >= Number(selectedProduct.stockQuantity)
                          }
                        >
                          <Text style={styles.modalQtyBtnText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : null}

                  {/* Buttons */}
                  <View style={styles.modalActionsRow}>
                    <TouchableOpacity
                      style={[
                        styles.modalAddToCartBtn,
                        Number(selectedProduct.stockQuantity) <= 0 &&
                          styles.modalAddToCartDisabled,
                      ]}
                      onPress={handleModalAddToCart}
                      disabled={Number(selectedProduct.stockQuantity) <= 0}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.modalAddToCartText}>
                        {Number(selectedProduct.stockQuantity) > 0
                          ? `Add to Cart • Rs. ${(selectedProduct.price * modalQty).toFixed(2)}`
                          : "Out of Stock"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.modalGoToCartBtn}
                      onPress={() => {
                        setModalVisible(false);
                        router.push("/customer-cart");
                      }}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.modalGoToCartText}>
                        Cart ({cartItemCount})
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
  