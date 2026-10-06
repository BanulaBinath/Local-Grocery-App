import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  logo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A",
  },

  welcome: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginTop: 2,
  },

  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E8EEF9",
    justifyContent: "center",
    alignItems: "center",
  },

  profileIcon: {
    fontSize: 20,
  },

  content: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
  },

  heroSection: {
    marginBottom: 16,
  },

  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },

  heroSubtitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1E3A8A",
    marginBottom: 6,
  },

  heroDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: "#6B7280",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  sectionSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },

  // Category Filters
  categoriesScroll: {
    marginBottom: 16,
  },

  categoriesContainer: {
    flexDirection: "row",
    paddingRight: 20,
  },

  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginRight: 10,
  },

  categoryPillActive: {
    backgroundColor: "#1E3A8A",
    borderColor: "#1E3A8A",
  },

  categoryIcon: {
    fontSize: 15,
    marginRight: 6,
  },

  categoryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },

  categoryTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  // Product List
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  emptyIcon: {
    fontSize: 44,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },

  emptyText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
  },

  card: {
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

  cardDisabled: {
    backgroundColor: "#F9FAFB",
    borderColor: "#F3F4F6",
  },

  cardLeft: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  cardLeftDisabled: {
    backgroundColor: "#F1F5F9",
  },

  productIcon: {
    fontSize: 26,
  },

  cardBody: {
    flex: 1,
    marginRight: 8,
  },

  productHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },

  productName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  categoryTag: {
    fontSize: 10,
    fontWeight: "600",
    color: "#1E3A8A",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  productPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E3A8A",
    marginTop: 3,
  },

  stockRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  inStockBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  inStockText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#15803D",
  },

  outOfStockBadge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },

  outOfStockText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#B91C1C",
    letterSpacing: 0.2,
  },

  qtyControls: {
    flexDirection: "row",
    alignItems: "center",
  },

  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  qtyButtonDisabled: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
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
    marginHorizontal: 8,
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    minWidth: 16,
    textAlign: "center",
  },

  addButton: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },

  addButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  addButtonTextDisabled: {
    color: "#9CA3AF",
  },

  // Cart Footer
  cartFooter: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 85,
    backgroundColor: "#1E3A8A",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  cartInfo: {
    flex: 1,
  },

  cartCount: {
    color: "#93C5FD",
    fontSize: 12,
    fontWeight: "600",
  },

  cartTotal: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 1,
  },

  checkoutButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },

  checkoutButtonText: {
    color: "#1E3A8A",
    fontWeight: "800",
    fontSize: 13,
  },

  // Bottom Navigation
  bottomNavigation: {
    height: 70,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingHorizontal: 5,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  navIcon: {
    fontSize: 20,
    marginBottom: 3,
  },

  navText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
  },

  activeNavText: {
    fontSize: 11,
    color: "#1E3A8A",
    fontWeight: "700",
  },
});

export default styles;

