import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  // ========================================
  // HEADER
  // ========================================
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 22,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  backButtonText: {
    fontSize: 26,
    color: "#1E3A8A",
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },

  // ========================================
  // PRODUCT CARD
  // ========================================
  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  productImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 18,
  },

  productIcon: {
    fontSize: 52,
  },

  productName: {
    fontSize: 25,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  category: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 5,
  },

  price: {
    fontSize: 21,
    fontWeight: "800",
    color: "#1E3A8A",
    textAlign: "center",
    marginTop: 12,
  },

  stockBadge: {
    alignSelf: "center",
    backgroundColor: "#ECFDF5",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginTop: 12,
  },

  stockText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#047857",
  },

  descriptionSection: {
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },

  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 21,
  },

  // ========================================
  // QUANTITY CARD
  // ========================================
  quantityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  quantityButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
  },

  disabledQuantityButton: {
    backgroundColor: "#D1D5DB",
  },

  quantityButtonText: {
    fontSize: 30,
    color: "#FFFFFF",
    fontWeight: "500",
    lineHeight: 32,
  },

  quantityDisplay: {
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 18,
  },

  quantityText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },

  quantityUnit: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  // ========================================
  // TOTAL CARD
  // ========================================
  totalCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  totalSubtext: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },

  totalPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E3A8A",
  },

  // ========================================
  // ADD BUTTON
  // ========================================
  addButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },

  disabledAddButton: {
    backgroundColor: "#9CA3AF",
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default styles;
