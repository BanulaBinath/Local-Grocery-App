import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 36) / 2;

const P = "#15803D";       // Primary emerald
const P_DARK = "#166534";  // Darker emerald
const P_SOFT = "#F0FDF4";  // Very light green
const P_MID  = "#DCFCE7";  // Light green
const ACCENT = "#22C55E";  // Bright accent
const BG     = "#F8FAFC";
const WHITE  = "#FFFFFF";
const SLATE  = "#0F172A";
const GRAY   = "#64748B";
const BORDER = "#E2E8F0";

export default StyleSheet.create({

  // ── Layout ─────────────────────────────────────────────────────────────────
  safeArea: {
    flex: 1,
    backgroundColor: WHITE,
  },
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  // ── Loading ─────────────────────────────────────────────────────────────────
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: WHITE,
  },
  loadingSpinner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: P_SOFT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  loadingText: {
    fontSize: 14,
    color: GRAY,
    fontWeight: "600",
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: SLATE,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: GRAY,
    marginTop: 2,
    fontWeight: "500",
  },
  addButton: {
    backgroundColor: P,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    shadowColor: P,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: WHITE,
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 0.2,
  },

  // ── Search ──────────────────────────────────────────────────────────────────
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BG,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1.5,
    borderColor: BORDER,
    marginBottom: 10,
  },
  searchIcon: { fontSize: 15, marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: SLATE,
    paddingVertical: 0,
  },

  // ── Category Pills ───────────────────────────────────────────────────────────
  categoryScroll: {},
  categoryContainer: {
    flexDirection: "row",
    gap: 8,
    paddingBottom: 2,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: BG,
    borderWidth: 1.5,
    borderColor: BORDER,
  },
  categoryPillActive: {
    backgroundColor: P,
    borderColor: P,
    shadowColor: P,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryIcon: { fontSize: 13, marginRight: 5 },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: GRAY,
  },
  categoryTextActive: {
    color: WHITE,
    fontWeight: "800",
  },

  // ── Products Grid ────────────────────────────────────────────────────────────
  list: {
    padding: 12,
    paddingBottom: 110,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },

  emptyContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
    backgroundColor: WHITE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    marginTop: 12,
  },
  emptyIcon: { fontSize: 52, marginBottom: 14 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: SLATE,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
    color: GRAY,
    textAlign: "center",
    lineHeight: 20,
  },

  // ── Product Card ─────────────────────────────────────────────────────────────
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  productImageBox: {
    height: 130,
    backgroundColor: P_SOFT,
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productImagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: P_SOFT,
  },
  productImageIcon: {
    fontSize: 44,
  },
  stockBadgeOverlay: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: P,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  stockBadgeOverlayOut: {
    backgroundColor: "#EF4444",
  },
  stockBadgeOverlayText: {
    color: WHITE,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  stockBadgeOverlayTextOut: {
    color: WHITE,
  },
  editOverlay: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.45)",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  editOverlayText: {
    fontSize: 13,
  },

  productBody: {
    padding: 10,
  },
  productName: {
    fontSize: 13,
    fontWeight: "800",
    color: SLATE,
    marginBottom: 4,
  },
  categoryPillSmall: {
    alignSelf: "flex-start",
    backgroundColor: P_MID,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 6,
  },
  categoryPillSmallText: {
    fontSize: 10,
    fontWeight: "700",
    color: P_DARK,
  },
  productBottom: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "900",
    color: P,
  },
  productUnit: {
    fontSize: 10,
    color: GRAY,
    fontWeight: "600",
    marginLeft: 2,
  },
  productQty: {
    fontSize: 10,
    color: GRAY,
    marginTop: 3,
    fontWeight: "500",
  },

  // ── Bottom Nav ───────────────────────────────────────────────────────────────
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 72,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 12,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
    paddingTop: 4,
  },
  navActiveIndicator: {
    width: 20,
    height: 3,
    backgroundColor: P,
    borderRadius: 2,
    marginBottom: 4,
  },
  navIcon: { fontSize: 20, marginBottom: 2 },
  navIconActive: { fontSize: 20, marginBottom: 2 },
  navLabel: {
    fontSize: 9,
    color: "#94A3B8",
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  navLabelActive: {
    fontSize: 9,
    color: P,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  // ── Modal ────────────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    paddingBottom: 40,
    maxHeight: "92%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#CBD5E1",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: SLATE,
    marginBottom: 18,
    letterSpacing: -0.3,
  },

  // Image Picker
  imagePicker: {
    height: 110,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: BORDER,
    borderStyle: "dashed",
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: BG,
    position: "relative",
  },
  imagePickerPreview: {
    width: "100%",
    height: "100%",
  },
  imagePickerPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePickerIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  imagePickerText: {
    fontSize: 13,
    color: GRAY,
    fontWeight: "600",
  },
  imagePickerBadge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(21, 128, 61, 0.88)",
    paddingVertical: 6,
    alignItems: "center",
  },
  imagePickerBadgeText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: "700",
  },

  // Inputs
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  input: {
    height: 46,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    fontSize: 14,
    color: SLATE,
    backgroundColor: BG,
  },
  rowInputs: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  // Category chips in modal
  categorySelectRow: {
    flexDirection: "row",
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: BG,
    borderWidth: 1.5,
    borderColor: BORDER,
  },
  categoryChipSelected: {
    backgroundColor: P,
    borderColor: P,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: GRAY,
  },
  categoryChipTextSelected: {
    color: WHITE,
    fontWeight: "800",
  },

  // Buttons
  saveButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: P,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    shadowColor: P,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  deleteButton: {
    backgroundColor: "#DC2626",
    shadowColor: "#DC2626",
    marginTop: 10,
  },
  saveButtonText: {
    color: WHITE,
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.3,
  },
  cancelButton: {
    marginTop: 14,
    alignItems: "center",
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: GRAY,
    fontWeight: "700",
    fontSize: 14,
  },
});
