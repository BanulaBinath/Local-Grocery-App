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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },

  addButton: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },

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

  productCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
    overflow: "hidden",
  },

  productImageBox: {
    height: 110,
    backgroundColor: PRIMARY_SOFT,
    alignItems: "center",
    justifyContent: "center",
  },

  productImage: {
    width: "100%",
    height: "100%",
  },

  productImageIcon: {
    fontSize: 36,
  },

  productBody: {
    padding: 10,
  },

  productName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  productPrice: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
    color: PRIMARY,
  },

  stockRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: PRIMARY_SOFT,
  },

  stockBadgeOut: {
    backgroundColor: "#FEE2E2",
  },

  stockText: {
    fontSize: 11,
    fontWeight: "700",
    color: PRIMARY,
  },

  stockTextOut: {
    color: "#DC2626",
  },

  editLink: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },

  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 72,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 6,
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 64,
  },

  navIcon: {
    fontSize: 20,
    marginBottom: 2,
  },

  navLabel: {
    fontSize: 11,
    color: "#9CA3AF",
  },

  navLabelActive: {
    fontSize: 11,
    color: PRIMARY,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 32,
    maxHeight: "85%",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },

  inputLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 6,
  },

  input: {
    height: 46,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },

  saveButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});
