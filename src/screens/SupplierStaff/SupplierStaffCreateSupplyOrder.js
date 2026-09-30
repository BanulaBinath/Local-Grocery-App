import { useState } from "react";

import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import DateTimePicker from "@react-native-community/datetimepicker";

import { router, useLocalSearchParams } from "expo-router";

import { API_URL } from "../../constants/api";

import styles from "./SupplierStaffCreateSupplyOrder.styles";

export default function SupplierStaffCreateSupplyOrder() {
  const {
    productId,
    supplierId,
    supplierName,
    supplierAddress,
    productName,
    price,
    stockQuantity,
    unit,
  } = useLocalSearchParams();

  const [quantity, setQuantity] = useState(1);

  const [pickupDate, setPickupDate] = useState(null);

  const [pickupTime, setPickupTime] = useState(null);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showTimePicker, setShowTimePicker] = useState(false);

  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);

  const numericPrice = Number(price) || 0;

  const numericStock = Number(stockQuantity) || 0;

  const totalPrice = numericPrice * quantity;

  // ==================================================
  // DATE HELPERS
  // ==================================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    let hours = date.getHours();

    const minutes = String(date.getMinutes()).padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;

    if (hours === 0) {
      hours = 12;
    }

    return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
  };

  // ==================================================
  // QUANTITY
  // ==================================================

  const increaseQuantity = () => {
    if (quantity < numericStock) {
      setQuantity((current) => current + 1);
    } else {
      Alert.alert(
        "Stock Limit",
        `Only ${numericStock} ${unit || "unit"} available.`,
      );
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((current) => current - 1);
    }
  };

  // ==================================================
  // DATE PICKER
  // ==================================================

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);

    if (event?.type === "dismissed") {
      return;
    }

    if (!selectedDate) {
      return;
    }

    const now = new Date();

    const selectedDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
    );

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Cannot select past date
    if (selectedDay < today) {
      Alert.alert("Invalid Date", "You cannot select a past date.");

      return;
    }

    setPickupDate(selectedDate);

    // Clear previously selected time
    // when changing the date
    if (pickupTime) {
      const sameDay =
        selectedDate.getFullYear() === pickupTime.getFullYear() &&
        selectedDate.getMonth() === pickupTime.getMonth() &&
        selectedDate.getDate() === pickupTime.getDate();

      if (!sameDay) {
        setPickupTime(null);
      }
    }
  };

  // ==================================================
  // TIME PICKER
  // ==================================================

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);

    if (event?.type === "dismissed") {
      return;
    }

    if (!selectedTime) {
      return;
    }

    if (!pickupDate) {
      Alert.alert("Select Date First", "Please select the pickup date first.");

      return;
    }

    const now = new Date();

    const selectedDateTime = new Date(
      pickupDate.getFullYear(),
      pickupDate.getMonth(),
      pickupDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes(),
      0,
      0,
    );

    const todayDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const selectedDateOnly = new Date(
      pickupDate.getFullYear(),
      pickupDate.getMonth(),
      pickupDate.getDate(),
    );

    // If pickup date is today,
    // time must be in the future.
    if (selectedDateOnly.getTime() === todayDate.getTime()) {
      if (selectedDateTime <= now) {
        Alert.alert(
          "Invalid Time",
          "You cannot select a past time. Please select a future time.",
        );

        return;
      }
    }

    setPickupTime(selectedTime);
  };

  // ==================================================
  // CREATE SUPPLY ORDER
  // ==================================================

  const handleCreateOrder = async () => {
    // ----------------------------------------------
    // STOCK VALIDATION
    // ----------------------------------------------

    if (numericStock <= 0) {
      Alert.alert("Out of Stock", "This product is currently out of stock.");

      return;
    }

    // ----------------------------------------------
    // SUPPLIER LOCATION VALIDATION
    // ----------------------------------------------

    if (!supplierAddress || !String(supplierAddress).trim()) {
      Alert.alert(
        "Supplier Location Missing",
        "Supplier location could not be found.",
      );

      return;
    }

    // ----------------------------------------------
    // DATE VALIDATION
    // ----------------------------------------------

    if (!pickupDate) {
      Alert.alert("Pickup Date Required", "Please select the pickup date.");

      return;
    }

    // ----------------------------------------------
    // TIME VALIDATION
    // ----------------------------------------------

    if (!pickupTime) {
      Alert.alert("Pickup Time Required", "Please select the pickup time.");

      return;
    }

    // ----------------------------------------------
    // FINAL DATE + TIME VALIDATION
    // ----------------------------------------------

    const now = new Date();

    const selectedDateTime = new Date(
      pickupDate.getFullYear(),
      pickupDate.getMonth(),
      pickupDate.getDate(),
      pickupTime.getHours(),
      pickupTime.getMinutes(),
      0,
      0,
    );

    if (selectedDateTime <= now) {
      Alert.alert(
        "Invalid Pickup Time",
        "Pickup date and time must be in the future.",
      );

      return;
    }

    try {
      setLoading(true);

      // --------------------------------------------
      // GET LOGGED-IN SUPPLIER STAFF
      // --------------------------------------------

      const staffData = await AsyncStorage.getItem("supplierStaff");

      if (!staffData) {
        Alert.alert(
          "Login Required",
          "Supplier Staff account information was not found.",
        );

        return;
      }

      const supplierStaff = JSON.parse(staffData);

      if (!supplierStaff.id) {
        Alert.alert("Account Error", "Supplier Staff ID was not found.");

        return;
      }

      // --------------------------------------------
      // FORMAT VALUES
      // --------------------------------------------

      const formattedLocation = String(supplierAddress).trim();

      const formattedDate = formatDate(pickupDate);

      const formattedTime = formatTime(pickupTime);

      const formattedNote = String(note || "").trim();

      // --------------------------------------------
      // DATA SENT TO BACKEND
      // --------------------------------------------

      const orderData = {
        supplierStaffId: supplierStaff.id,

        supplierId: String(supplierId),

        productId: String(productId),

        quantity: Number(quantity),

        pickupLocation: formattedLocation,

        pickupDate: formattedDate,

        pickupTime: formattedTime,

        note: formattedNote,
      };

      // --------------------------------------------
      // DEBUG LOG
      // --------------------------------------------

      console.log("========================================");

      console.log("SUPPLY ORDER DATA SENT TO BACKEND:");

      console.log(JSON.stringify(orderData, null, 2));

      console.log("========================================");

      // --------------------------------------------
      // SEND REQUEST
      // --------------------------------------------

      const response = await fetch(`${API_URL}/api/supply-orders`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      // --------------------------------------------
      // RESPONSE DEBUG
      // --------------------------------------------

      console.log("SUPPLY ORDER RESPONSE:");

      console.log(JSON.stringify(data, null, 2));

      // --------------------------------------------
      // SUCCESS
      // --------------------------------------------

      if (response.ok) {
        Alert.alert(
          "Order Created Successfully ✅",

          `${quantity} ${unit || "unit"} of ${
            productName || "product"
          } has been added to your supply orders.`,

          [
            {
              text: "View Orders",

              onPress: () => router.replace("/supplier-staff-supply-orders"),
            },

            {
              text: "Done",

              onPress: () => router.replace("/supplier-staff-dashboard"),
            },
          ],
        );
      }

      // --------------------------------------------
      // BACKEND ERROR
      // --------------------------------------------
      else {
        Alert.alert(
          "Order Failed",

          data.message || "Could not create supply order.",
        );
      }
    } catch (error) {
      console.log("Create supply order error:", error);

      Alert.alert("Connection Error", "Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Create Supply Order</Text>

            <Text style={styles.headerSubtitle}>
              {supplierName || "Supplier"}
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* PRODUCT */}

          <View style={styles.productCard}>
            <View style={styles.productIconBox}>
              <Text style={styles.productIcon}>📦</Text>
            </View>

            <View style={styles.productInfo}>
              <Text style={styles.productLabel}>Product</Text>

              <Text style={styles.productName}>{productName || "Product"}</Text>

              <Text style={styles.productPrice}>
                Rs. {numericPrice.toFixed(2)}
                {unit ? ` / ${unit}` : ""}
              </Text>

              <Text style={styles.stockText}>
                Available: {numericStock} {unit || "unit"}
              </Text>
            </View>
          </View>

          {/* QUANTITY */}

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Select Quantity</Text>

            <View style={styles.quantityRow}>
              <TouchableOpacity
                style={[
                  styles.quantityButton,

                  quantity <= 1 && styles.disabledQuantityButton,
                ]}
                onPress={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </TouchableOpacity>

              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityText}>{quantity}</Text>

                <Text style={styles.quantityUnit}>{unit || "unit"}</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.quantityButton,

                  quantity >= numericStock && styles.disabledQuantityButton,
                ]}
                onPress={increaseQuantity}
                disabled={quantity >= numericStock}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* PICKUP DETAILS */}

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Pickup Details</Text>

            {/* SUPPLIER LOCATION */}

            <Text style={styles.inputLabel}>Supplier Location</Text>

            <View
              style={[
                styles.input,

                {
                  justifyContent: "center",

                  backgroundColor: "#F3F4F6",
                },
              ]}
            >
              <Text
                style={{
                  color: "#374151",

                  fontSize: 14,
                }}
              >
                📍 {supplierAddress || "Supplier location not available"}
              </Text>
            </View>

            {/* PICKUP DATE */}

            <Text style={styles.inputLabel}>Pickup Date</Text>

            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  color: pickupDate ? "#374151" : "#9CA3AF",

                  fontSize: 14,
                }}
              >
                📅 {pickupDate ? formatDate(pickupDate) : "Select pickup date"}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={pickupDate || new Date()}
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={handleDateChange}
              />
            )}

            {/* PICKUP TIME */}

            <Text style={styles.inputLabel}>Pickup Time</Text>

            <TouchableOpacity
              style={[
                styles.input,

                !pickupDate && {
                  opacity: 0.5,
                },
              ]}
              onPress={() => {
                if (!pickupDate) {
                  Alert.alert(
                    "Select Date First",
                    "Please select the pickup date first.",
                  );

                  return;
                }

                setShowTimePicker(true);
              }}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  color: pickupTime ? "#374151" : "#9CA3AF",

                  fontSize: 14,
                }}
              >
                ⏰ {pickupTime ? formatTime(pickupTime) : "Select pickup time"}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={pickupTime || new Date()}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}

            {/* NOTE */}

            <Text style={styles.inputLabel}>Note (Optional)</Text>

            <TextInput
              style={[styles.input, styles.noteInput]}
              placeholder="Add any additional note"
              placeholderTextColor="#9CA3AF"
              value={note}
              onChangeText={setNote}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* TOTAL */}

          <View style={styles.totalCard}>
            <View>
              <Text style={styles.totalLabel}>Total Amount</Text>

              <Text style={styles.totalSubtext}>
                {quantity} {unit || "unit"} × Rs. {numericPrice.toFixed(2)}
              </Text>
            </View>

            <Text style={styles.totalPrice}>Rs. {totalPrice.toFixed(2)}</Text>
          </View>

          {/* CREATE BUTTON */}

          <TouchableOpacity
            style={[
              styles.createButton,

              loading && styles.disabledCreateButton,
            ]}
            onPress={handleCreateOrder}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.createButtonText}>
                ✅ Create Supply Order
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.bottomSpace} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
