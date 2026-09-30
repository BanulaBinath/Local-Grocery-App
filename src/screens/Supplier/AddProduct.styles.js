import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // ========================================
  // MAIN
  // ========================================

  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  keyboardView: {
    flex: 1,
  },

  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: "#F5F7FB",
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F7FB",
  },

  loadingText: {
    fontSize: 15,
    color: "#6B7280",
  },

  // ========================================
  // HEADER
  // ========================================

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 18,
    paddingBottom: 20,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  backButtonText: {
    fontSize: 25,
    color: "#111827",
    marginTop: -2,
  },

  headerContent: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: "#111827",
  },

  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },

  // ========================================
  // IMAGE
  // ========================================

  imageSection: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  productImage: {
    width: 150,
    height: 150,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
  },

  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  imageIcon: {
    fontSize: 52,
  },

  imageButton: {
    marginTop: 14,
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 11,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  imageButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E3A8A",
  },

  // ========================================
  // FORM
  // ========================================

  form: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 7,
    marginTop: 4,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 11,
    paddingHorizontal: 13,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#FFFFFF",
    marginBottom: 15,
  },

  descriptionInput: {
    height: 100,
    paddingTop: 13,
    paddingBottom: 13,
  },

  // ========================================
  // STATUS
  // ========================================

  statusOptions: {
    marginBottom: 18,
  },

  statusOption: {
    minHeight: 68,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 13,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },

  activeStatusOption: {
    borderColor: "#16A34A",
    backgroundColor: "#F0FDF4",
  },

  inactiveStatusOption: {
    borderColor: "#9CA3AF",
    backgroundColor: "#F9FAFB",
  },

  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#9CA3AF",
    alignItems: "center",
    justifyContent: "center",
  },

  radioCircleActive: {
    borderColor: "#16A34A",
  },

  radioCircleInactive: {
    borderColor: "#6B7280",
  },

  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#16A34A",
  },

  radioDotInactive: {
    backgroundColor: "#6B7280",
  },

  statusOptionContent: {
    flex: 1,
    marginLeft: 12,
  },

  statusOptionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  statusOptionText: {
    marginTop: 3,
    fontSize: 12,
    color: "#6B7280",
  },

  // ========================================
  // OUT OF STOCK
  // ========================================

  outOfStockStatusBox: {
    minHeight: 72,
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 13,
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  outOfStockStatusIcon: {
    fontSize: 23,
  },

  statusContent: {
    flex: 1,
    marginLeft: 12,
  },

  outOfStockStatusTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#DC2626",
  },

  outOfStockStatusText: {
    marginTop: 3,
    fontSize: 12,
    color: "#991B1B",
  },

  // ========================================
  // SAVE
  // ========================================

  saveButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#1E3A8A",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  saveButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});

export default styles;
