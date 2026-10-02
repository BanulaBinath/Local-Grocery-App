import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";

import { API_URL } from "../../constants/api";
import styles from "./CustomerProducts.styles";

export default function CustomerProducts() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [placing, setPlacing] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/shop-products`);
      const data = await response.json();

      if (response.ok) {
        setProducts(
          (data.products || []).filter(
            (p) => p.status === "active" && p.inStock,
          ),
        );
      } else {
        Alert.alert("Error", data.message || "Could not load products.");
      }
    } catch (error) {
      console.log("Fetch shop products error:", error);
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

  const updateQty = (productId, delta) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);

      if (next === 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }

      return { ...prev, [productId]: next };
    });
  };

  const cartItems = Object.entries(cart)
    .map(([productId, quantity]) => {
      const product = products.find((p) => p._id === productId);
      if (!product) return null;
      return { product, quantity };
    })
    .filter(Boolean);

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Empty cart", "Add at least one product to place an order.");
      return;
    }

    try {
      setPlacing(true);

      const customerData = await AsyncStorage.getItem("customer");

      if (!customerData) {
        Alert.alert("Error", "Please log in as a customer.");
        return;
      }

      const customer = JSON.parse(customerData);

      const response = await fetch(`${API_URL}/api/customer-orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customer.id,
          deliveryFee: 100,
          items: cartItems.map((item) => ({
            productId: item.product._id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCart({});
        Alert.alert(
          "Order Placed",
          `Order #${data.order.orderNumber} placed successfully.`,
          [
            {
              text: "View Orders",
              onPress: () => router.push("/order-history"),
            },
            { text: "OK" },
          ],
        );
        fetchProducts();
      } else {
        Alert.alert("Error", data.message || "Could not place order.");
      }
    } catch (error) {
      console.log("Place order error:", error);
      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E3A8A" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Browse Products</Text>
          <View style={styles.headerSpace} />
        </View>

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
              colors={["#1E3A8A"]}
            />
          }
        >
          {products.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🛒</Text>
              <Text style={styles.emptyTitle}>No Products Available</Text>
              <Text style={styles.emptyText}>
                Check back soon for fresh groceries.
              </Text>
            </View>
          ) : (
            products.map((product) => {
              const qty = cart[product._id] || 0;

              return (
                <View key={product._id} style={styles.card}>
                  <View style={styles.cardLeft}>
                    <Text style={styles.productIcon}>🥬</Text>
                  </View>

                  <View style={styles.cardBody}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productMeta}>
                      {product.unit} · Stock {product.stockQuantity}
                    </Text>
                    <Text style={styles.productPrice}>
                      Rs. {Number(product.price).toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.qtyControls}>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => updateQty(product._id, -1)}
                    >
                      <Text style={styles.qtyButtonText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyValue}>{qty}</Text>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => updateQty(product._id, 1)}
                    >
                      <Text style={styles.qtyButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {cartItems.length > 0 ? (
          <View style={styles.footer}>
            <View>
              <Text style={styles.footerLabel}>
                {cartItems.length} item(s) · Rs. {cartTotal.toFixed(2)} + fee
              </Text>
            </View>
            <TouchableOpacity
              style={styles.placeButton}
              onPress={placeOrder}
              disabled={placing}
            >
              <Text style={styles.placeButtonText}>
                {placing ? "Placing..." : "Place Order"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
