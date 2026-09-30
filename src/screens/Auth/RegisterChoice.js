import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

import { router } from "expo-router";
import styles from "./RegisterChoice.styles";

export default function RegisterChoice() {
  const handleBack = () => {
    router.back();
  };

  const handleCustomerRegister = () => {
    router.push("/customer-register");
  };

  const handleSupplierRegister = () => {
    router.push("/supplier-register");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.logo}>Local Grocery</Text>

          <Text style={styles.title}>Create Your Account</Text>

          <Text style={styles.subtitle}>
            Choose the type of account you want to create
          </Text>
        </View>

        <View style={styles.options}>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={handleCustomerRegister}
          >
            <Text style={styles.icon}>👤</Text>

            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Customer</Text>

              <Text style={styles.optionDescription}>
                Order groceries from local shops and pick them up easily.
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={handleSupplierRegister}
          >
            <Text style={styles.icon}>🏪</Text>

            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Supplier</Text>

              <Text style={styles.optionDescription}>
                Manage your shop and supply products to customers.
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Select an account type to continue</Text>
      </View>
    </SafeAreaView>
  );
}
