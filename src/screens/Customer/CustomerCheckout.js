import { useCallback, useMemo, useState } from "react";
import {
  Alert,
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
import { clearCartItems, getCartItems } from "./customerCartStorage";
import styles from "./CustomerCheckout.styles";

const TIME_SLOTS = [
  "09:00 AM - 11:00 AM",
  "11:00 AM - 01:00 PM",
  "01:00 PM - 03:00 PM",
  "03:00 PM - 05:00 PM",
];

const buildPickupDates = () => {
  const labels = [];
  for (let i = 0; i < 4; i += 1) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    if (i === 0) {
      labels.push({ id: "today", label: "Today", value: date.toDateString() });
    } else if (i === 1) {
      labels.push({
        id: "tomorrow",
        label: "Tomorrow",
        value: date.toDateString(),
      });
    } else {
      labels.push({
        id: `day-${i}`,
        label: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        value: date.toDateString(),
      });
    }
  }
  return labels;
};

export default function CustomerCheckout() {
  const pickupDates = useMemo(buildPickupDates, []);
  const [items, setItems] = useState([]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState(pickupDates[0].id);
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0]);
  const [placing, setPlacing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const cart = await getCartItems();
        setItems(cart);

        const customerData = await AsyncStorage.getItem("customer");
        if (customerData) {
          const customer = JSON.parse(customerData);
          setFullName(customer.fullName || "");
          setPhone(customer.phoneNumber || customer.customerPhone || "");
        }
      };
      load();
    }, []),
  );

  const itemsTotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  const placeOrder = async () => {
    if (items.length === 0) {
      Alert.alert("Empty Cart", "Add products before placing an order.");
      return;
    }

    if (!String(phone).trim()) {
      Alert.alert(
        "Phone Required",
        "Please enter your phone number for pickup.",
      );
      return;
    }

    try {
      setPlacing(true);
      const customerData = await AsyncStorage.getItem("customer");

      if (!customerData) {
        Alert.alert("Error", "Please log in to place an order.");
        return;
      }

      const customer = JSON.parse(customerData);
      const selectedPickup =
        pickupDates.find((date) => date.id === selectedDate) || pickupDates[0];
      const pickupDate = selectedPickup.label;
      const pickupDateValue = selectedPickup.value;

      const response = await fetch(`${API_URL}/api/customer-orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customer.id,
          deliveryFee: 0,
          customerPhone: String(phone).trim(),
          pickupDate: pickupDateValue,
          pickupTime: selectedSlot,
          note: `In-store pickup · ${pickupDate} · ${selectedSlot}${
            fullName ? ` · ${fullName}` : ""
          }`,
          items: items.map((item) => ({
            productId: item.product._id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await clearCartItems();
        Alert.alert(
          "Order Placed 🎉",
          `Order #${data.order.orderNumber} placed successfully! Pick up at ${pickupDate}, ${selectedSlot}.`,
          [
            {
              text: "View Orders",
              onPress: () => router.replace("/order-history"),
            },
            {
              text: "Home",
              onPress: () => router.replace("/customer-home"),
            },
          ],
        );
      } else {
        Alert.alert("Order Failed", data.message || "Could not place order.");
      }
    } catch (error) {
      console.log("Place pickup order error:", error);
      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>← Cart</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <View style={styles.headerIconWrap}>
              <Text>🛍️</Text>
            </View>
            <Text style={styles.headerTitle}>Pickup Checkout</Text>
          </View>
          <View style={styles.headerSpace} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.infoBanner}>
            <Text style={styles.infoTitle}>🏪 In-Store Pre-Order Pickup</Text>
            <Text style={styles.infoText}>
              No waiting in long queues! Staff packs your fresh items so you can
              pick them up at your chosen time slot.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>👤 Customer Details</Text>
            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={[styles.input, styles.inputReadonly]}
              value={fullName}
              editable={false}
              placeholder="Customer name"
              placeholderTextColor="#94A3B8"
            />
            <Text style={styles.label}>Phone Number (Required for pickup)</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>📦 Order Summary</Text>
            {items.length === 0 ? (
              <Text style={styles.summaryMuted}>No items in cart.</Text>
            ) : (
              items.map((item) => (
                <View key={item.product._id} style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    {item.product.name} × {item.quantity}
                  </Text>
                  <Text style={styles.summaryValue}>
                    Rs. {(Number(item.product.price) * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Items ({items.reduce((sum, item) => sum + item.quantity, 0)})
              </Text>
              <Text style={styles.summaryValue}>
                Rs. {itemsTotal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Store Pickup / Packing</Text>
              <Text style={styles.freeText}>FREE</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>Rs. {itemsTotal.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>📅 Schedule Pickup</Text>
            <Text style={styles.label}>Pickup Date</Text>
            <View style={styles.dateRow}>
              {pickupDates.map((date) => {
                const active = selectedDate === date.id;
                return (
                  <TouchableOpacity
                    key={date.id}
                    style={[styles.datePill, active && styles.datePillActive]}
                    onPress={() => setSelectedDate(date.id)}
                  >
                    <Text
                      style={[
                        styles.datePillText,
                        active && styles.datePillTextActive,
                      ]}
                    >
                      {date.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Pickup Time Slot</Text>
            {TIME_SLOTS.map((slot) => {
              const active = selectedSlot === slot;
              return (
                <TouchableOpacity
                  key={slot}
                  style={[styles.timeSlot, active && styles.timeSlotActive]}
                  onPress={() => setSelectedSlot(slot)}
                >
                  <Text>⏰</Text>
                  <Text
                    style={[
                      styles.timeSlotText,
                      active && styles.timeSlotTextActive,
                    ]}
                  >
                    {slot}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              placing && styles.confirmButtonDisabled,
            ]}
            onPress={placeOrder}
            disabled={placing}
          >
            <Text style={styles.confirmText}>
              {placing
                ? "Placing Order..."
                : `Confirm & Place Order • Rs. ${itemsTotal.toFixed(2)}`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
