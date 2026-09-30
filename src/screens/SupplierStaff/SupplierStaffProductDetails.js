import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import styles from "./SupplierStaffProductDetails.styles";

export default function SupplierStaffProductDetails() {
  const {
    productId,
    supplierId,
    supplierName,
    supplierAddress,
    productName,
    category,
    description,
    price,
    stockQuantity,
    unit,
  } = useLocalSearchParams();

  const numericPrice = Number(price) || 0;
  const numericStock = Number(stockQuantity) || 0;

  const handleCreateSupplyOrder = () => {
    if (numericStock <= 0) {
      Alert.alert("Out of Stock", "This product is currently out of stock.");

      return;
    }

    router.push({
      pathname: "/supplier-staff-create-supply-order",

      params: {
        productId,
        supplierId,
        supplierName: supplierName || "Supplier",

        // Supplier registration address
        supplierAddress: supplierAddress || "",

        productName: productName || "Product",
        price: String(numericPrice),
        stockQuantity: String(numericStock),
        unit: unit || "",
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View>
            <Text style={styles.headerTitle}>Product Details</Text>

            <Text style={styles.headerSubtitle}>
              {supplierName || "Supplier"}
            </Text>
          </View>
        </View>

        {/* PRODUCT CARD */}

        <View style={styles.productCard}>
          <View style={styles.productImage}>
            <Text style={styles.productIcon}>🛒</Text>
          </View>

          <Text style={styles.productName}>{productName || "Product"}</Text>

          <Text style={styles.category}>{category || "General"}</Text>

          <Text style={styles.price}>
            Rs. {numericPrice.toFixed(2)}
            {unit ? ` / ${unit}` : ""}
          </Text>

          <View style={styles.stockBadge}>
            <Text style={styles.stockText}>
              {numericStock > 0
                ? `In Stock: ${numericStock} ${unit || ""}`
                : "Out of Stock"}
            </Text>
          </View>

          {description ? (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Description</Text>

              <Text style={styles.description}>{description}</Text>
            </View>
          ) : null}
        </View>

        {/* CREATE SUPPLY ORDER */}

        <TouchableOpacity
          style={[
            styles.addButton,
            numericStock <= 0 && styles.disabledAddButton,
          ]}
          onPress={handleCreateSupplyOrder}
          disabled={numericStock <= 0}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>📦 Create Supply Order</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}
