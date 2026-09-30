import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  backButtonText: {
    fontSize: 27,
    color: "#1E3A8A",
    fontWeight: "700",
  },

  headerContent: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#111827",
  },

  headerSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 3,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  productCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },

  productIconBox: {
    width: 60,
    height: 60,
    borderRadius: 17,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  productIcon: {
    fontSize: 30,
  },

  productInfo: {
    flex: 1,
    marginLeft: 14,
  },

  productLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    marginBottom: 3,
  },

  productName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  productPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E3A8A",
    marginTop: 4,
  },

  stockText: {
    fontSize: 12,
    color: "#047857",
    marginTop: 4,
    fontWeight: "600",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  quantityButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  disabledQuantityButton: {
    opacity: 0.45,
  },

  quantityButtonText: {
    fontSize: 27,
    fontWeight: "700",
    color: "#1E3A8A",
  },

  quantityDisplay: {
    minWidth: 90,
    alignItems: "center",
    marginHorizontal: 18,
  },

  quantityText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },

  quantityUnit: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },

  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 7,
    marginTop: 4,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#FFFFFF",
    marginBottom: 13,
  },

  noteInput: {
    height: 90,
    paddingTop: 13,
  },

  totalCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EEF2FF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },

  totalLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },

  totalSubtext: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
  },

  totalPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E3A8A",
  },

  createButton: {
    minHeight: 54,
    borderRadius: 15,
    backgroundColor: "#1E3A8A",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  disabledCreateButton: {
    opacity: 0.6,
  },

  createButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  bottomSpace: {
    height: 20,
  },
});

export default styles;
