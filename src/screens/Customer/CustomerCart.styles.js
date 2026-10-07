import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    flex: 1,
  },

  // Header
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

  clearText: {
    fontSize: 13,
    color: "#EF4444",
    fontWeight: "600",
  },

  // Loading & Empty
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#64748B",
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },

  shopButton: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },

  shopButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },

  // Cart List
  listContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 150,
  },

  cartItemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },

  itemImageWrap: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    overflow: "hidden",
  },

  itemImage: {
    width: "100%",
    height: "100%",
  },

  itemIcon: {
    fontSize: 28,
  },

  itemDetails: {
    flex: 1,
    marginRight: 8,
  },

  itemName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 2,
  },

  itemPrice: {
    fontSize: 13,
    color: "#1E3A8A",
    fontWeight: "600",
  },

  itemStockHint: {
    fontSize: 11,
    color: "#15803D",
    marginTop: 2,
  },

  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },

  qtyBtnDisabled: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
  },

  qtyBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E3A8A",
  },

  qtyBtnTextDisabled: {
    color: "#94A3B8",
  },

  qtyText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginHorizontal: 10,
    minWidth: 16,
    textAlign: "center",
  },

  itemRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 60,
  },

  deleteBtn: {
    padding: 4,
  },

  deleteIcon: {
    fontSize: 16,
    color: "#94A3B8",
  },

  lineTotal: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },

  // Summary Card
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
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
    marginVertical: 10,
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

  // Footer Actions
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
    flexDirection: "row",
    gap: 12,
  },

  addMoreBtn: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },

  addMoreBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
  },

  checkoutBtn: {
    flex: 1.4,
    backgroundColor: "#1E3A8A",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },

  checkoutBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});

export default styles;
