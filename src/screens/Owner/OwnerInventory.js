import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import { API_URL } from "../../constants/api";
import styles from "./OwnerInventory.styles";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "in_stock", label: "In stock" },
  { key: "low_stock", label: "Low stock" },
  { key: "out_of_stock", label: "Out of stock" },
];

const getStockState = (quantity) => {
  const stock = Number(quantity) || 0;

  if (stock === 0) {
    return "out_of_stock";
  }

  return stock <= 10 ? "low_stock" : "in_stock";
};

const getSupplierName = (supplier) =>
  supplier?.businessName || supplier?.fullName || "Unknown supplier";

export default function OwnerInventory() {
  const [products, setProducts] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadInventory = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setErrorMessage("");
      const response = await fetch(`${API_URL}/api/owners/inventory`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load inventory.");
      }

      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (error) {
      console.error("Load owner inventory error:", error);
      setErrorMessage("Could not load inventory. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadInventory();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadInventory]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesFilter =
        selectedFilter === "all" ||
        getStockState(product.stockQuantity) === selectedFilter;
      const matchesSearch =
        !query ||
        product.name?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        getSupplierName(product.supplierId).toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [products, searchQuery, selectedFilter]);

  const stockSummary = useMemo(
    () => ({
      total: products.length,
      low: products.filter(
        (product) => getStockState(product.stockQuantity) === "low_stock",
      ).length,
      out: products.filter(
        (product) => getStockState(product.stockQuantity) === "out_of_stock",
      ).length,
    }),
    [products],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadInventory(true)}
            tintColor="#1E3A8A"
          />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Inventory</Text>
            <Text style={styles.headerSubtitle}>
              Monitor stock across all suppliers
            </Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{stockSummary.total}</Text>
            <Text style={styles.summaryLabel}>Products</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, styles.warningText]}>
              {stockSummary.low}
            </Text>
            <Text style={styles.summaryLabel}>Low stock</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, styles.dangerText]}>
              {stockSummary.out}
            </Text>
            <Text style={styles.summaryLabel}>Out of stock</Text>
          </View>
        </View>

        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search products or suppliers"
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        >
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                selectedFilter === filter.key && styles.activeFilterButton,
              ]}
              onPress={() => setSelectedFilter(filter.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter.key && styles.activeFilterText,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading ? (
          <ActivityIndicator style={styles.loader} size="large" color="#1E3A8A" />
        ) : errorMessage ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => loadInventory()}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No inventory found</Text>
            <Text style={styles.emptyDescription}>
              Try another search or stock filter.
            </Text>
          </View>
        ) : (
          <View style={styles.productList}>
            {filteredProducts.map((product) => {
              const stockState = getStockState(product.stockQuantity);
              const stockLabel =
                stockState === "out_of_stock"
                  ? "Out of stock"
                  : stockState === "low_stock"
                    ? "Low stock"
                    : "In stock";

              return (
                <View key={product._id} style={styles.productCard}>
                  <View style={styles.productDetails}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productCategory}>
                      {product.category}
                    </Text>
                    <Text style={styles.supplierName}>
                      Supplier: {getSupplierName(product.supplierId)}
                    </Text>
                  </View>
                  <View style={styles.stockColumn}>
                    <Text style={styles.stockQuantity}>
                      {Number(product.stockQuantity) || 0} {product.unit}
                    </Text>
                    <View style={[styles.statusBadge, styles[`${stockState}Badge`]]}>
                      <Text
                        style={[
                          styles.statusText,
                          styles[`${stockState}Text`],
                        ]}
                      >
                        {stockLabel}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
