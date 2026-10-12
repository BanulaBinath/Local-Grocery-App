import { useCallback, useState } from "react";
import {
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
import CustomerBottomNav from "./CustomerBottomNav";
import {
  clearCartItems,
  getCartItems,
  getProductImageUrl,
  saveCartItems,
} from "./customerCartStorage";
import styles from "./CustomerCart.styles";

export default function CustomerCart() {
  const [items, setItems] = useState([]);

  const loadCart = async () => {
    const cart = await getCartItems();
    setItems(cart);
  };

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, []),
  );

  const persist = async (next) => {
    setItems(next);
    await saveCartItems(next);
  };

  const updateQty = (productId, delta) => {
    const item = items.find((entry) => entry.product._id === productId);
    if (!item) return;

    const stockQty = Number(item.product.stockQuantity) || 0;
    const nextQty = item.quantity + delta;

    if (delta > 0 && nextQty > stockQty) {
      Alert.alert(
        "Stock Limit Reached",
        `Only ${stockQty} ${item.product.unit || "pcs"} available in stock.`,
      );
      return;
    }

    if (nextQty <= 0) {
      persist(items.filter((entry) => entry.product._id !== productId));
      return;
    }

    persist(
      items.map((entry) =>
        entry.product._id === productId
          ? { ...entry, quantity: nextQty }
          : entry,
      ),
    );
  };

  const removeItem = (productId) => {
    persist(items.filter((entry) => entry.product._id !== productId));
  };

  const handleClear = () => {
    if (items.length === 0) return;
    Alert.alert("Clear Cart", "Remove all items from your cart?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          await clearCartItems();
          setItems([]);
        },
      },
    ]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const itemsTotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace("/customer-home")}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <View style={styles.headerIconWrap}>
              <Text style={styles.headerIcon}>🛒</Text>
            </View>
            <Text style={styles.headerTitle}>Shopping Cart</Text>
          </View>

          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {items.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Your cart is empty</Text>
              <Text style={styles.emptyText}>
                Tap a product on Home to add it and continue checkout.
              </Text>
            </View>
          ) : (
            items.map((item) => {
              const imageUrl = getProductImageUrl(item.product, API_URL);
              const lineTotal = Number(item.product.price) * item.quantity;
              const stockQty = Number(item.product.stockQuantity) || 0;

              return (
                <View key={item.product._id} style={styles.itemCard}>
                  <View style={styles.itemTop}>
                    {imageUrl ? (
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.itemImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={[styles.itemImage, styles.itemImagePlaceholder]}
                      >
                        <Text>🛍️</Text>
                      </View>
                    )}

                    <View style={styles.itemBody}>
                      <Text style={styles.itemName}>{item.product.name}</Text>
                      <Text style={styles.itemPrice}>
                        Rs. {Number(item.product.price).toFixed(2)} /{" "}
                        {item.product.unit || "pcs"}
                      </Text>
                      <View style={styles.stockRow}>
                        <Text style={styles.stockText}>
                          ✓ In Stock: {stockQty} {item.product.unit || "pcs"}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.trashButton}
                      onPress={() => removeItem(item.product._id)}
                    >
                      <Text>🗑️</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.itemBottom}>
                    <View style={styles.qtyRow}>
                      <TouchableOpacity
                        style={styles.qtyButton}
                        onPress={() => updateQty(item.product._id, -1)}
                      >
                        <Text style={styles.qtyButtonText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyValue}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.qtyButton}
                        onPress={() => updateQty(item.product._id, 1)}
                      >
                        <Text style={styles.qtyButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.lineTotal}>
                      Rs. {lineTotal.toFixed(2)}
                    </Text>
                  </View>
                </View>
              );
            })
          )}

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items ({itemCount})</Text>
              <Text style={styles.summaryValue}>
                Rs. {itemsTotal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Store Pickup / Packing</Text>
              <Text style={[styles.summaryValue, styles.freeText]}>FREE</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Estimated Total</Text>
              <Text style={styles.totalValue}>
                Rs. {itemsTotal.toFixed(2)}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.addMoreButton}
            onPress={() => router.replace("/customer-home")}
          >
            <Text style={styles.addMoreText}>+ Add More</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.checkoutButton,
              items.length === 0 && styles.checkoutButtonDisabled,
            ]}
            disabled={items.length === 0}
            onPress={() => router.push("/customer-checkout")}
          >
            <Text style={styles.checkoutText}>Checkout ({itemCount}) ›</Text>
          </TouchableOpacity>
        </View>
        <CustomerBottomNav active="cart" />
      </View>
    </SafeAreaView>
  );
}
