import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import styles from "./SupplierStaffSupplierDetails.styles";

export default function SupplierStaffSupplierDetails() {
  const params = useLocalSearchParams();

  const supplierId = params.supplierId || "";

  const supplierName = params.supplierName || "Supplier";

  const fullName = params.fullName || "Not available";

  const email = params.email || "Not available";

  const address = params.address || "Not available";

  const businessName = params.businessName || supplierName;

  const businessRegistrationNo =
    params.businessRegistrationNo || "Not available";

  const status = params.status || "approved";

  const handleViewProducts = () => {
    router.push({
      pathname: "/supplier-staff-products",

      params: {
        supplierId: supplierId,

        supplierName: businessName,

        // Supplier registration address
        supplierAddress: address,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Supplier Details</Text>

            <Text style={styles.headerSubtitle}>View supplier information</Text>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push("/supplier-staff-profile")}
            activeOpacity={0.8}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* SUPPLIER TITLE */}

          <View style={styles.supplierHero}>
            <View style={styles.supplierIconBox}>
              <Text style={styles.supplierIcon}>🏪</Text>
            </View>

            <Text style={styles.supplierTitle}>{businessName}</Text>

            <Text style={styles.supplierSubtitle}>Supplier</Text>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {status === "approved" ? "Approved" : status}
              </Text>
            </View>
          </View>

          {/* DETAILS */}

          <Text style={styles.sectionTitle}>Supplier Information</Text>

          <View style={styles.detailBox}>
            <Text style={styles.detailIcon}>👤</Text>

            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Supplier Name</Text>

              <Text style={styles.detailValue}>{fullName}</Text>
            </View>
          </View>

          <View style={styles.detailBox}>
            <Text style={styles.detailIcon}>🏪</Text>

            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Business Name</Text>

              <Text style={styles.detailValue}>{businessName}</Text>
            </View>
          </View>

          <View style={styles.detailBox}>
            <Text style={styles.detailIcon}>📧</Text>

            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Email</Text>

              <Text style={styles.detailValue}>{email}</Text>
            </View>
          </View>

          <View style={styles.detailBox}>
            <Text style={styles.detailIcon}>📍</Text>

            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Address</Text>

              <Text style={styles.detailValue}>{address}</Text>
            </View>
          </View>

          <View style={styles.detailBox}>
            <Text style={styles.detailIcon}>📄</Text>

            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Business Registration No.</Text>

              <Text style={styles.detailValue}>{businessRegistrationNo}</Text>
            </View>
          </View>

          {/* PRODUCTS BUTTON */}

          <TouchableOpacity
            style={styles.productsButton}
            onPress={handleViewProducts}
            activeOpacity={0.8}
          >
            <Text style={styles.productsButtonIcon}>📦</Text>

            <View style={styles.productsButtonContent}>
              <Text style={styles.productsButtonTitle}>
                View Supplier Products
              </Text>

              <Text style={styles.productsButtonSubtitle}>
                View products available from this supplier
              </Text>
            </View>

            <Text style={styles.productsArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.bottomSpace} />
        </ScrollView>

        {/* BOTTOM NAVIGATION */}

        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.replace("/supplier-staff-dashboard")}
          >
            <Text style={styles.navIcon}>🏠</Text>

            <Text style={styles.navLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/supplier-staff-supply-orders")}
          >
            <Text style={styles.navIcon}>📦</Text>

            <Text style={styles.navLabel}>Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/supplier-staff-pickup-orders")}
          >
            <Text style={styles.navIcon}>🚚</Text>

            <Text style={styles.navLabel}>Pickup</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/supplier-staff-suppliers")}
          >
            <Text style={styles.navIconActive}>🏪</Text>

            <Text style={styles.navLabelActive}>Suppliers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/supplier-staff-messages")}
          >
            <Text style={styles.navIcon}>💬</Text>

            <Text style={styles.navLabel}>Messages</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
