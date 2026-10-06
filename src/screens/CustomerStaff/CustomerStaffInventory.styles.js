import { StyleSheet } from "react-native";

const PRIMARY = "#15803D"; // Deep Emerald Green
const PRIMARY_SOFT = "#F0FDF4";
const BG = "#F8FAFC";

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
    backgroundColor: BG,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },

  // Header & Search
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },

  headerSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },

  addButton: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },

  searchContainer: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 42,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  searchIcon: {
    fontSize: 15,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#0F172A",
    paddingVertical: 0,
  },

  // Category Filters
  categoryScroll: {
    marginTop: 10,
  },

  categoryContainer: {
    flexDirection: "row",
    gap: 8,
  },

  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  categoryPillActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },

  categoryIcon: {
    fontSize: 13,
    marginRight: 6,
  },

  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },

  categoryTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  // Inventory Grid List
  list: {
    padding: 12,
    paddingBottom: 110,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  emptyContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 12,
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
  },

  // Product Card
  productCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  productImageBox: {
    height: 120,
    backgroundColor: PRIMARY_SOFT,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  productImage: {
    width: "100%",
    height: "100%",
  },

  productImageIcon: {
    fontSize: 42,
  },

  categoryBadgeTop: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },

  categoryBadgeTopText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },

  productBody: {
    padding: 12,
  },

  productName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },

  productMeta: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },

  productPrice: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "800",
    color: PRIMARY,
  },

  stockRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: PRIMARY_SOFT,
    borderWidth: 1,
    borderColor: "#86EFAC",
  },

  stockBadgeOut: {
    backgroundColor: "#FEE2E2",
    borderColor: "#FCA5A5",
  },

  stockText: {
    fontSize: 10,
    fontWeight: "800",
    color: PRIMARY,
  },

  stockTextOut: {
    color: "#B91C1C",
  },

  editLink: {
    fontSize: 12,
    color: PRIMARY,
    fontWeight: "700",
  },

  // Bottom Nav
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 4,
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 54,
  },

  navIcon: {
    fontSize: 18,
    marginBottom: 2,
  },

  navLabel: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "500",
  },

  navLabelActive: {
    fontSize: 10,
    color: PRIMARY,
    fontWeight: "800",
  },

  // Add/Edit Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    maxHeight: "88%",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 14,
  },

  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 6,
  },

  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 13,
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
  },

  categorySelectRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },

  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },

  categoryChipSelected: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },

  categoryChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },

  categoryChipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  saveButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
  },
});

