import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  backButton: {
    paddingVertical: 6,
    paddingRight: 12,
  },

  backButtonText: {
    fontSize: 14,
    color: "#1E3A8A",
    fontWeight: "700",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 140,
  },

  // Pickup Banner
  pickupNoticeBanner: {
    backgroundColor: "#EFF6FF",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },

  pickupNoticeIcon: {
    fontSize: 26,
    marginRight: 12,
  },

  pickupNoticeTextWrap: {
    flex: 1,
  },

  pickupNoticeTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E3A8A",
  },

  pickupNoticeSubtitle: {
    fontSize: 12,
    color: "#3B82F6",
    marginTop: 2,
    lineHeight: 16,
  },

  // Section Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 6,
    marginTop: 10,
  },

  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#0F172A",
  },

  textArea: {
    minHeight: 65,
    textAlignVertical: "top",
  },

  // Date and Time Chips
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 6,
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  chipActive: {
    backgroundColor: "#1E3A8A",
    borderColor: "#1E3A8A",
  },

  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },

  chipTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  // Location selector
  locationOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 8,
  },

  locationOptionActive: {
    backgroundColor: "#EFF6FF",
    borderColor: "#1E3A8A",
  },

  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#94A3B8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  radioCircleActive: {
    borderColor: "#1E3A8A",
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1E3A8A",
  },

  locationTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },

  locationDesc: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 1,
  },

  // Items Summary in Checkout
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
    flex: 1,
  },

  itemQty: {
    fontSize: 13,
    color: "#64748B",
    marginHorizontal: 10,
  },

  itemPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  summaryLabel: {
    fontSize: 13,
    color: "#64748B",
  },

  summaryValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0F172A",
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 12,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },

  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E3A8A",
  },

  // Footer Button
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },

  orderBtn: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  orderBtnDisabled: {
    backgroundColor: "#94A3B8",
  },

  orderBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});

export default styles;
