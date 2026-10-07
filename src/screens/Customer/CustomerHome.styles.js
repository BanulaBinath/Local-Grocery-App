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

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  logo: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A8A",
    letterSpacing: 0.3,
  },

  welcome: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 2,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  headerIconText: {
    fontSize: 18,
  },

  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },

  badgeCart: {
    backgroundColor: "#1E3A8A",
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },

  // Search Bar Section
  searchContainer: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "#FFFFFF",
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
    paddingVertical: 0,
  },

  clearSearchButton: {
    padding: 4,
  },

  clearSearchText: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "700",
  },

  searchResultsCount: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 6,
    fontWeight: "500",
  },

  // Main Content
  content: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 110,
  },

  heroBanner: {
    backgroundColor: "#1E3A8A",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },

  heroTag: {
    color: "#93C5FD",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },

  heroTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 26,
  },

  heroSubtitle: {
    fontSize: 13,
    color: "#E2E8F0",
    marginTop: 4,
    lineHeight: 18,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },

  sectionSubtitle: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },

  // Categories
  categoriesScroll: {
    marginBottom: 16,
  },

  categoriesContainer: {
    flexDirection: "row",
    paddingRight: 10,
  },

  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginRight: 8,
  },

  categoryPillActive: {
    backgroundColor: "#1E3A8A",
    borderColor: "#1E3A8A",
  },

  categoryIcon: {
    fontSize: 14,
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
    paddingVertical: 45,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 8,
  },

  emptyIcon: {
    fontSize: 44,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },

  emptyText: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
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
    backgroundColor: "#F8FAFC",
    borderColor: "#F1F5F9",
    opacity: 0.85,
  },

  cardLeft: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    overflow: "hidden",
  },

  cardLeftDisabled: {
    backgroundColor: "#F1F5F9",
  },

  productThumbImage: {
    width: "100%",
    height: "100%",
  },

  productIcon: {
    fontSize: 28,
  },

  cardBody: {
    flex: 1,
    marginRight: 10,
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
    color: "#0F172A",
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
    marginTop: 2,
  },

  stockRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  inStockBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: "#86EFAC",
  },

  inStockText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#15803D",
  },

  outOfStockBadge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: "#FCA5A5",
  },

  outOfStockText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#B91C1C",
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
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },

  qtyButtonDisabled: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
  },

  qtyButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A8A",
  },

  qtyButtonTextDisabled: {
    color: "#94A3B8",
  },

  qtyValue: {
    marginHorizontal: 8,
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
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
    backgroundColor: "#E2E8F0",
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  addButtonTextDisabled: {
    color: "#94A3B8",
  },

  // Floating Cart Footer
  cartFooter: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 80,
    backgroundColor: "#0F172A",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
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
    backgroundColor: "#2563EB",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  checkoutButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },

  // Product Details Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 36,
    maxHeight: "85%",
  },

  modalHandleBar: {
    width: 44,
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 14,
  },

  modalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },

  modalImageWrapper: {
    width: "100%",
    height: 180,
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    overflow: "hidden",
  },

  modalImage: {
    width: "100%",
    height: "100%",
  },

  modalPlaceholderIcon: {
    fontSize: 64,
  },

  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },

  modalCloseText: {
    fontSize: 16,
    color: "#64748B",
    fontWeight: "700",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    flex: 1,
    marginRight: 12,
  },

  modalPriceTag: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E3A8A",
    marginBottom: 8,
  },

  modalMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },

  modalCategoryBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  modalCategoryBadgeText: {
    color: "#1E3A8A",
    fontWeight: "700",
    fontSize: 12,
  },

  modalDescriptionBox: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },

  modalDescriptionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 4,
  },

  modalDescriptionText: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
  },

  modalStockInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    marginBottom: 16,
  },

  modalStockLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#166534",
  },

  modalStockValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#15803D",
  },

  modalQtyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },

  modalQtyLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },

  modalQtyControls: {
    flexDirection: "row",
    alignItems: "center",
  },

  modalQtyBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },

  modalQtyBtnDisabled: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
  },

  modalQtyBtnText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A",
  },

  modalQtyValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: "center",
  },

  modalActionsRow: {
    flexDirection: "row",
    gap: 12,
  },

  modalAddToCartBtn: {
    flex: 1,
    backgroundColor: "#1E3A8A",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  modalAddToCartDisabled: {
    backgroundColor: "#94A3B8",
  },

  modalAddToCartText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  modalGoToCartBtn: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1.5,
    borderColor: "#1E3A8A",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  modalGoToCartText: {
    color: "#1E3A8A",
    fontSize: 14,
    fontWeight: "700",
  },

  // Bottom Navigation
  bottomNavigation: {
    height: 72,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingHorizontal: 8,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  navIcon: {
    fontSize: 20,
    marginBottom: 3,
  },

  navText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },

  activeNavText: {
    fontSize: 11,
    color: "#1E3A8A",
    fontWeight: "700",
  },

  navBadge: {
    position: "absolute",
    top: 0,
    right: 18,
    backgroundColor: "#EF4444",
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },

  navBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },
});

export default styles;
