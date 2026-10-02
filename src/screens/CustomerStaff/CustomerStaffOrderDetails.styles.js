import { StyleSheet } from "react-native";

const PRIMARY = "#2E7D32";
const PRIMARY_SOFT = "#E8F5E9";
const BG = "#F5F7F5";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },

  container: {
    flex: 1,
    backgroundColor: BG,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#6B7280",
  },

  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PRIMARY_SOFT,
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonText: {
    fontSize: 20,
    color: PRIMARY,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  headerSpace: {
    width: 40,
  },

  content: {
    padding: 16,
    paddingBottom: 140,
  },

  stepperCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  stepperTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 14,
  },

  stepperRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  stepItem: {
    alignItems: "center",
    flex: 1,
  },

  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  stepCircleActive: {
    borderColor: PRIMARY,
    backgroundColor: PRIMARY,
  },

  stepCircleDone: {
    borderColor: PRIMARY,
    backgroundColor: PRIMARY,
  },

  stepCheck: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  stepLabel: {
    marginTop: 6,
    fontSize: 10,
    color: "#9CA3AF",
    textAlign: "center",
  },

  stepLabelActive: {
    color: PRIMARY,
    fontWeight: "700",
  },

  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },

  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: PRIMARY_SOFT,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    overflow: "hidden",
  },

  itemImageSrc: {
    width: "100%",
    height: "100%",
  },

  itemInfo: {
    flex: 1,
  },

  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  itemQty: {
    marginTop: 2,
    fontSize: 12,
    color: "#6B7280",
  },

  itemPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  priceLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  priceValue: {
    fontSize: 13,
    color: "#374151",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },

  totalLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  totalValue: {
    fontSize: 15,
    fontWeight: "700",
    color: PRIMARY,
  },

  detailLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 2,
  },

  detailValue: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 12,
  },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  primaryButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  cancelLink: {
    marginTop: 10,
    alignItems: "center",
    padding: 8,
  },

  cancelLinkText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "600",
  },

  chatButton: {
    marginTop: 8,
    height: 44,
    borderRadius: 12,
    backgroundColor: PRIMARY_SOFT,
    alignItems: "center",
    justifyContent: "center",
  },

  chatButtonText: {
    color: PRIMARY,
    fontSize: 14,
    fontWeight: "700",
  },
});
