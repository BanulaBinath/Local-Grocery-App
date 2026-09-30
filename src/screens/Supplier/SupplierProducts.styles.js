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

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F7FB",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },

  // ========================================
  // HEADER
  // ========================================

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
  },

  headerContent: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
  },

  headerSubtitle: {
    marginTop: 5,
    fontSize: 13,
    color: "#6B7280",
  },

  profileButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  profileIcon: {
    fontSize: 21,
  },

  countBadge: {
    minWidth: 42,
    height: 42,
    paddingHorizontal: 10,
    borderRadius: 21,
    backgroundColor: "#E8EEFF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  countText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E3A8A",
  },

  // ========================================
  // ADD PRODUCT
  // ========================================

  addButton: {
    height: 52,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 15,
    backgroundColor: "#1E3A8A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  addIcon: {
    fontSize: 25,
    fontWeight: "400",
    color: "#FFFFFF",
    marginRight: 8,
    marginTop: -2,
  },

  addButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // ========================================
  // LIST
  // ========================================

  list: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },

  // ========================================
  // EMPTY
  // ========================================

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 55,
  },

  emptyIcon: {
    fontSize: 55,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },

  emptyText: {
    maxWidth: 310,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
    marginBottom: 22,
  },

  emptyAddButton: {
    height: 48,
    paddingHorizontal: 22,
    borderRadius: 13,
    backgroundColor: "#1E3A8A",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyAddButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // ========================================
  // PRODUCT CARD
  // ========================================

  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginBottom: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
  },

  productImage: {
    width: 105,
    height: 105,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
  },

  productImagePlaceholder: {
    width: 105,
    height: 105,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  productImageIcon: {
    fontSize: 35,
  },

  productContent: {
    flex: 1,
    marginLeft: 14,
    minWidth: 0,
  },

  productTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
  },

  productName: {
    flex: 1,
    minWidth: 0,
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginRight: 7,
  },

  productCategory: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "600",
    color: "#1E3A8A",
  },

  productDescription: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 17,
    color: "#6B7280",
  },

  // ========================================
  // STATUS
  // ========================================

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
  },

  availableBadge: {
    backgroundColor: "#ECFDF5",
  },

  availableText: {
    color: "#16A34A",
  },

  inactiveBadge: {
    backgroundColor: "#F3F4F6",
  },

  inactiveText: {
    color: "#6B7280",
  },

  outOfStockBadge: {
    backgroundColor: "#FEF2F2",
  },

  outOfStockText: {
    color: "#DC2626",
  },

  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },

  // ========================================
  // PRICE + STOCK
  // ========================================

  productDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 9,
    width: "100%",
  },

  productPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },

  productStock: {
    flex: 1,
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
    marginLeft: 5,
    textAlign: "right",
  },

  // ========================================
  // ACTION BUTTONS
  // ========================================

  productActions: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },

  // ========================================
  // EDIT
  // ========================================

  editButton: {
    flex: 1,
    minWidth: 0,
    height: 34,
    borderRadius: 9,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 3,
  },

  editButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E3A8A",
    textAlign: "center",
  },

  // ========================================
  // ACTIVE -> DEACTIVATE
  // ========================================

  deactivateButton: {
    width: 105,
    height: 34,
    borderRadius: 9,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 3,
    paddingHorizontal: 5,
  },

  deactivateButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#EA580C",
    textAlign: "center",
    includeFontPadding: false,
  },

  // ========================================
  // INACTIVE -> ACTIVATE
  // ========================================

  activateButton: {
    flex: 1,
    minWidth: 0,
    height: 34,
    borderRadius: 9,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 3,
    paddingHorizontal: 2,
  },

  activateButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#16A34A",
    textAlign: "center",
    includeFontPadding: false,
  },

  // ========================================
  // OUT OF STOCK -> ACTIVATE
  // ========================================

  outOfStockActionButton: {
    flex: 1,
    minWidth: 0,
    height: 34,
    borderRadius: 9,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 3,
    paddingHorizontal: 2,
  },

  outOfStockActionButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    textAlign: "center",
    includeFontPadding: false,
  },

  // ========================================
  // DELETE
  // ========================================

  deleteButton: {
    flex: 1,
    minWidth: 0,
    height: 34,
    borderRadius: 9,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 3,
  },

  deleteButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#DC2626",
    textAlign: "center",
  },

  // ========================================
  // BOTTOM NAVIGATION
  // ========================================

  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 78,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 5,
    elevation: 12,
  },

  navItem: {
    flex: 1,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },

  navIcon: {
    fontSize: 22,
    marginBottom: 5,
  },

  navLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6B7280",
  },

  navLabelActive: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1E3A8A",
  },
});

export default styles;
