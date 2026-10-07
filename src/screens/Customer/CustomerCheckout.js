import { useCallback, useState } from "react";
import {
  ActivityIndicator,
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
import { router, useFocusEffect } from "expo-router";

import { API_URL } from "../../constants/api";
import { SAMPLE_PRODUCTS } from "../../constants/sampleProducts";
import { clearCart, getCart } from "../../utils/cartStorage";
import styles from "./CustomerCheckout.styles";

const TIME_SLOTS = [
  "09:00 AM - 11:00 AM",
  "11:00 AM - 01:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
  "06:00 PM - 08:00 PM",
];

const LOCATIONS = [
  {
    id: "loc1",
    title: "Main Store - Counter A (Express Pickup)",
    desc: "Dedicated fast pickup desk at main entrance",
  },
  {
    id: "loc2",
    title: "Main Store - Customer Service Desk",
    desc: "Convenient pickup counter inside store hall",
  },
  {
    id: "loc3",
    title: "City Center Branch - Pickup Point",
    desc: "Colombo Central branch pickup outlet",
  },
];

export default function CustomerCheckout() {
  const [customer, setCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0]);
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0].title);
  const [note, setNote] = useState("");

  // Generate Date Choices (Today, Tomorrow, +2 days)
  const generateDateOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 4; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const label =
        i === 0
          ? "Today"
          : i === 1
          ? "Tomorrow"
          : d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      const value = d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      options.push({ label, value });
    }
    return options;
  };

  const dateOptions = generateDateOptions();

  const loadData = async () => {
    try {
      // 1. Load customer info
      const custData = await AsyncStorage.getItem("customer");
      if (custData) {
        const parsed = JSON.parse(custData);
        setCustomer(parsed);
        setCustomerName(parsed.fullName || "");
        setCustomerPhone(parsed.phoneNumber || parsed.phone || "");
      }

      // 2. Load live products and include the same fallback products as the cart.
      let availableProducts = SAMPLE_PRODUCTS;
      try {
        const pRes = await fetch(`${API_URL}/api/shop-products`);
        if (pRes.ok) {
          const pData = await pRes.json();
          if (Array.isArray(pData.products) && pData.products.length > 0) {
            availableProducts = pData.products;
          }
        }
      } catch (error) {
        console.log("Error loading checkout products:", error);
      }

      const mergedProducts = [...availableProducts];
      for (const sampleProduct of SAMPLE_PRODUCTS) {
        if (!mergedProducts.some((product) => product._id === sampleProduct._id)) {
          mergedProducts.push(sampleProduct);
        }
      }
      setProducts(mergedProducts);

      // 3. Load cart after products, so every saved item can be resolved.
      const currentCart = await getCart();
      setCart(currentCart);

      // Default date to today
      if (!selectedDate && dateOptions.length > 0) {
        setSelectedDate(dateOptions[0].value);
      }
    } catch (e) {
      console.log("Error loading checkout data:", e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const cartItems = Object.entries(cart)
    .map(([pId, qty]) => {
      const product = products.find((p) => p._id === pId);
      if (!product) return null;
      return { product, quantity: qty };
    })
    .filter(Boolean);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Empty Cart", "Your cart has no items to order.");
      router.replace("/customer-home");
      return;
    }

    if (!customerName.trim()) {
      Alert.alert("Missing Name", "Please enter your name for pickup identification.");
      return;
    }

    if (!customerPhone.trim()) {
      Alert.alert(
        "Missing Phone",
        "Please enter your contact phone number so staff can reach you.",
      );
      return;
    }

    if (!selectedDate) {
      Alert.alert("Select Date", "Please pick a pickup date.");
      return;
    }

    if (!selectedTime) {
      Alert.alert("Select Time", "Please pick a pickup time slot.");
      return;
    }

    try {
      setSubmitting(true);
      const customerId = customer?._id || customer?.id;

      if (!customerId) {
        Alert.alert("Error", "Please log in to complete your checkout.");
        router.push("/login");
        return;
      }

      const orderPayload = {
        customerId,
        customerPhone: customerPhone.trim(),
        pickupDate: selectedDate,
        pickupTime: selectedTime,
        pickupLocation: selectedLocation,
        note: note.trim(),
        deliveryFee: 0, // Free store pickup
        items: cartItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
      };

      const response = await fetch(`${API_URL}/api/customer-orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (response.ok) {
        // Clear customer cart
        await clearCart();
        setCart({});

        Alert.alert(
          "Order Placed! 🎉",
          `Order #${data.order.orderNumber} placed successfully!\n\nStaff will review and update your order status. You will receive notifications once confirmed.`,
          [
            {
              text: "View My Orders",
              onPress: () => router.replace("/order-history"),
            },
          ],
        );
      } else {
        Alert.alert("Order Failed", data.message || "Could not place order.");
      }
    } catch (error) {
      console.log("Place order error:", error);
      Alert.alert("Connection Error", "Could not connect to the grocery backend.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#1E3A8A" />
          <Text style={{ marginTop: 10, color: "#64748B" }}>Preparing checkout...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Cart</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pickup Checkout</Text>
          <View style={{ width: 45 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Pickup Banner Notice */}
          <View style={styles.pickupNoticeBanner}>
            <Text style={styles.pickupNoticeIcon}>🏪</Text>
            <View style={styles.pickupNoticeTextWrap}>
              <Text style={styles.pickupNoticeTitle}>In-Store Pre-Order Pickup</Text>
              <Text style={styles.pickupNoticeSubtitle}>
                No waiting in long queues! Staff packs your fresh items so you
                can pick them up at your chosen time slot.
              </Text>
            </View>
          </View>

          {/* Customer Details */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>👤 Customer Details</Text>

            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={customerName}
              onChangeText={setCustomerName}
            />

            <Text style={styles.label}>Phone Number (Required for pickup)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 077 123 4567"
              keyboardType="phone-pad"
              value={customerPhone}
              onChangeText={setCustomerPhone}
            />
          </View>

          {/* Schedule Pickup */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📅 Schedule Pickup</Text>

            <Text style={styles.label}>Pickup Date</Text>
            <View style={styles.chipRow}>
              {dateOptions.map((opt) => {
                const isActive = selectedDate === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.chip, isActive && styles.chipActive]}
                    onPress={() => setSelectedDate(opt.value)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isActive && styles.chipTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Pickup Time Slot</Text>
            <View style={styles.chipRow}>
              {TIME_SLOTS.map((slot) => {
                const isActive = selectedTime === slot;
                return (
                  <TouchableOpacity
                    key={slot}
                    style={[styles.chip, isActive && styles.chipActive]}
                    onPress={() => setSelectedTime(slot)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isActive && styles.chipTextActive,
                      ]}
                    >
                      ⏰ {slot}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Pickup Location */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📍 Store Pickup Location</Text>

            {LOCATIONS.map((loc) => {
              const isSelected = selectedLocation === loc.title;
              return (
                <TouchableOpacity
                  key={loc.id}
                  style={[
                    styles.locationOption,
                    isSelected && styles.locationOptionActive,
                  ]}
                  onPress={() => setSelectedLocation(loc.title)}
                  activeOpacity={0.85}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleActive,
                    ]}
                  >
                    {isSelected ? <View style={styles.radioInner} /> : null}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.locationTitle}>{loc.title}</Text>
                    <Text style={styles.locationDesc}>{loc.desc}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            <Text style={styles.label}>Special Note / Instructions (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="e.g. Please pick ripe vegetables, pack tightly in paper bags"
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              value={note}
              onChangeText={setNote}
            />
          </View>

          {/* Order Summary */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🛍️ Order Items ({totalItemsCount})</Text>

            {cartItems.map((item) => (
              <View key={item.product._id} style={styles.itemRow}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.product.name}
                </Text>
                <Text style={styles.itemQty}>
                  {item.quantity} {item.product.unit}
                </Text>
                <Text style={styles.itemPrice}>
                  Rs. {(item.product.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>Rs. {subtotal.toFixed(2)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Pickup / Service Fee</Text>
              <Text style={[styles.summaryValue, { color: "#15803D" }]}>
                FREE
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total to Pay at Pickup</Text>
              <Text style={styles.totalValue}>Rs. {subtotal.toFixed(2)}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Place Order Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.orderBtn, submitting && styles.orderBtnDisabled]}
            onPress={handlePlaceOrder}
            disabled={submitting}
            activeOpacity={0.85}
          >
            <Text style={styles.orderBtnText}>
              {submitting
                ? "Submitting Order..."
                : `Confirm & Place Order • Rs. ${subtotal.toFixed(2)}`}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
