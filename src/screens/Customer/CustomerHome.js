import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

import { router } from "expo-router";

import styles from "./CustomerHome.styles";

export default function CustomerHome() {
  const handleProfile = () => {
    router.push("/customer-profile");
  };

  const handleOrders = () => {
    router.push("/order-history");
  };

  const handleProducts = () => {
    router.push("/customer-products");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>Local Grocery</Text>
            <Text style={styles.welcome}>Welcome 👋</Text>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={handleProfile}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Fresh Groceries,</Text>

          <Text style={styles.subtitle}>Easy Pickup.</Text>

          <Text style={styles.description}>
            Find your favorite groceries from local shops and pre-order them for
            convenient pickup.
          </Text>

          {/* Products */}
          <TouchableOpacity style={styles.primaryCard} onPress={handleProducts}>
            <View>
              <Text style={styles.cardIcon}>🛒</Text>
              <Text style={styles.cardTitle}>Browse Products</Text>
              <Text style={styles.cardDescription}>
                Explore groceries available from local shops.
              </Text>
            </View>

            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>

          {/* Orders */}
          <TouchableOpacity style={styles.secondaryCard} onPress={handleOrders}>
            <View>
              <Text style={styles.cardIcon}>📦</Text>
              <Text style={styles.cardTitle}>My Orders</Text>
              <Text style={styles.cardDescription}>
                View your previous and current orders.
              </Text>
            </View>

            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNavigation}>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.activeNavText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={handleProducts}>
            <Text style={styles.navIcon}>🛒</Text>
            <Text style={styles.navText}>Products</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={handleOrders}>
            <Text style={styles.navIcon}>📦</Text>
            <Text style={styles.navText}>Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={handleProfile}>
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
