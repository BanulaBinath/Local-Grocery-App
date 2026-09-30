import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

import { router } from "expo-router";

import styles from "./StaffManagement.styles";

export default function StaffManagement() {
  const handleSupplierStaff = () => {
    router.push("/add-supplier-staff");
  };

  const handleCustomerStaff = () => {
    router.push("/add-customer-staff");
  };

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

          <View>
            <Text style={styles.headerTitle}>Staff Management</Text>

            <Text style={styles.headerSubtitle}>
              Add and manage staff accounts
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Add Staff</Text>

          <Text style={styles.description}>
            Select the type of staff account you want to create.
          </Text>

          <TouchableOpacity style={styles.card} onPress={handleSupplierStaff}>
            <Text style={styles.icon}>🏪</Text>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Supplier Staff</Text>

              <Text style={styles.cardDescription}>
                Create an account for supplier staff.
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={handleCustomerStaff}>
            <Text style={styles.icon}>👥</Text>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Customer Staff</Text>

              <Text style={styles.cardDescription}>
                Create an account for customer staff.
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
