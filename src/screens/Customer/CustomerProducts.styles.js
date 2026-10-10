import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F6FF",
  },

  container: {
    flex: 1,
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
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonText: {
    fontSize: 20,
    color: "#1E3A8A",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  headerSpace: {
    width: 40,
  },

  // Category Filters
  categoriesScroll: {
    maxHeight: 56,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  categoriesContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    marginRight: 8,
  },

  categoryPillActive: {
    backgroundColor: "#1E3A8A",
  },

  categoryIcon: {
    fontSize: 14,
    marginRight: 6,
  },

  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },

  categoryTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  list: {
    padding: 16,
    paddingBottom: 120,
  },

  emptyContainer: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 24,
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
  },

  cardDisabled: {
    backgroundColor: "#FAFAFA",
    borderColor: "#E5E7EB",
  },

  cardLeft: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  cardLeftDisabled: {
    backgroundColor: "#F3F4F6",
  },

  productIcon: {
    fontSize: 24,
  },

  cardBody: {
    flex: 1,
    marginRight: 8,
  },

  productName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  productMeta: {
    marginTop: 2,
    fontSize: 12,
    color: "#6B7280",
  },

  productPrice: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "700",
    color: "#1E3A8A",
  },

  stockRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  outOfStockBadge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },

  outOfStockText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#B91C1C",
  },

  inStockBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },

  inStockText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#15803D",
  },

  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
  },

  qtyButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  qtyButtonDisabled: {
    backgroundColor: "#F3F4F6",
  },

  qtyButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A8A",
  },

  qtyButtonTextDisabled: {
    color: "#9CA3AF",
  },

  qtyValue: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    minWidth: 16,
    textAlign: "center",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  footerLabel: {
    fontSize: 13,
    color: "#6B7280",
    maxWidth: 180,
  },

  placeButton: {
    height: 46,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: "#1E3A8A",
    alignItems: "center",
    justifyContent: "center",
  },

  placeButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});

