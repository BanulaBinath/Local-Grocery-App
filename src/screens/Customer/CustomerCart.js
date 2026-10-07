import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router, useFocusEffect } from "expo-router";

import { API_URL } from "../../constants/api";
import {
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../../utils/cartStorage";
import styles from "./CustomerCart.styles";

export default function CustomerCart() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // 1. Fetch live products from backend
      const res = await fetch(`${API_URL}/api/shop-products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }

      // 2. Fetch saved cart from storage
      const savedCart = await getCart();
      setCart(savedCart);
    } catch (e) {
      console.log("Error fetching cart data:", e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith("file://")) return null;
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    return `${API_URL}${image.startsWith("/") ? image : `/${image}`}`;
  };

  const getProductIcon = (product) => {
    const pCat = (product?.category || "").toLowerCase();
    if (pCat.includes("veg")) return "🥬";
    if (pCat.includes("fruit")) return "🍎";
    if (pCat.includes("spice")) return "🌶️";
    if (pCat.includes("dairy")) return "🥛";
    return "🛒";
  };

  const handleUpdateQty = async (productId, delta) => {
    const product = products.find((p) => p._id === productId);
    const maxStock = product ? Number(product.stockQuantity) || 0 : 999;

    const currentQty = cart[productId] || 0;
    if (currentQty + delta > maxStock && delta > 0) {
      Alert.alert(
        "Stock Limit Reached",
        `Only ${maxStock} ${product?.unit || "units"} available in store stock.`,
      );
      return;
    }

    const updated = await updateCartItem(productId, delta, maxStock);
    setCart({ ...updated });
  };

  const handleRemove = async (productId, productName) => {
    Alert.alert(
      "Remove Item",
      `Are you sure you want to remove ${productName} from your cart?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            const updated = await removeCartItem(productId);
            setCart({ ...updated });
          },
        },
      ],
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            const empty = await clearCart();
            setCart(empty);
          },
        },
      ],
    );
  };

  // Compile cart items
  const cartItems = Object.entries(cart)
    .map(([productId, quantity]) => {
      const product = products.find((p) => p._id === productId);
      if (!product) return null;
      return { product, quantity };
    })
    .filter(Boolean);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E3A8A" />
          <Text style={styles.loadingText}>Loading your cart...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Shopping Cart</Text>

          {cartItems.length > 0 ? (
            <TouchableOpacity onPress={handleClearCart}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 45 }} />
          )}
        </View>

        {/* Body */}
        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
            <Text style={styles.emptyText}>
              You haven't added any groceries to your cart yet. Browse our
              fresh items and add what you need!
            </Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => router.push("/customer-home")}
            >
              <Text style={styles.shopButtonText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <ScrollView
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            >
              {cartItems.map(({ product, quantity }) => {
                const imageUrl = getImageUrl(product.image);
                const stockQty = Number(product.stockQuantity) || 0;

                return (
                  <View key={product._id} style={styles.cartItemCard}>
                    {/* Item Thumbnail */}
                    <View style={styles.itemImageWrap}>
                      {imageUrl ? (
                        <Image
                          source={{ uri: imageUrl }}
                          style={styles.itemImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <Text style={styles.itemIcon}>
                          {getProductIcon(product)}
                        </Text>
                      )}
                    </View>

                    {/* Item Details */}
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {product.name}
                      </Text>
                      <Text style={styles.itemPrice}>
                        Rs. {Number(product.price).toFixed(2)} / {product.unit}
                      </Text>
                      <Text style={styles.itemStockHint}>
                        ✓ In Stock: {stockQty} {product.unit}
                      </Text>

                      {/* Quantity Controls */}
                      <View style={styles.qtyBox}>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => handleUpdateQty(product._id, -1)}
                        >
                          <Text style={styles.qtyBtnText}>−</Text>
                        </TouchableOpacity>

                        <Text style={styles.qtyText}>{quantity}</Text>

                        <TouchableOpacity
                          style={[
                            styles.qtyBtn,
                            quantity >= stockQty && styles.qtyBtnDisabled,
                          ]}
                          onPress={() => handleUpdateQty(product._id, 1)}
                          disabled={quantity >= stockQty}
                        >
                          <Text
                            style={[
                              styles.qtyBtnText,
                              quantity >= stockQty && styles.qtyBtnTextDisabled,
                            ]}
                          >
                            +
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Line Total & Delete */}
                    <View style={styles.itemRight}>
                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => handleRemove(product._id, product.name)}
                      >
                        <Text style={styles.deleteIcon}>🗑️</Text>
                      </TouchableOpacity>

                      <Text style={styles.lineTotal}>
                        Rs. {(product.price * quantity).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                );
              })}

              {/* Order Summary */}
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Order Summary</Text>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    Items ({totalItemsCount})
                  </Text>
                  <Text style={styles.summaryValue}>
                    Rs. {subtotal.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Store Pickup / Packing</Text>
                  <Text style={[styles.summaryValue, { color: "#15803D" }]}>
                    FREE
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>Estimated Total</Text>
                  <Text style={styles.totalValue}>Rs. {subtotal.toFixed(2)}</Text>
                </View>
              </View>
            </ScrollView>

            {/* Bottom Footer Actions */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.addMoreBtn}
                onPress={() => router.push("/customer-home")}
                activeOpacity={0.8}
              >
                <Text style={styles.addMoreBtnText}>+ Add More</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkoutBtn}
                onPress={() => router.push("/customer-checkout")}
                activeOpacity={0.85}
              >
                <Text style={styles.checkoutBtnText}>
                  Checkout ({totalItemsCount}) ›
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
