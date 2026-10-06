import { StyleSheet } from "react-native";

const PRIMARY = "#15803D"; // Deep Emerald Green
const PRIMARY_SOFT = "#F0FDF4";
const PRIMARY_BORDER = "#DCFCE7";
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

  // Hero Section & Header
  header: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 14,
  },

  bannerContainer: {
    height: 130,
    width: "100%",
    position: "relative",
    justifyContent: "flex-end",
  },

  bannerImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
  },

  bannerContent: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  bannerTitleRow: {
    flex: 1,
  },

  staffBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#15803D",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },

  staffBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  welcomeText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  storeSubtext: {
    fontSize: 12,
    color: "#E2E8F0",
    marginTop: 2,
  },

  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(220, 252, 231, 0.95)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#16A34A",
    marginRight: 6,
  },

  liveText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#15803D",
  },

  searchContainer: {
    marginTop: 12,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
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

  // Status Filter Tabs
  filterTabsScroll: {
    marginTop: 10,
  },

  filterTabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
  },

  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  filterTabActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },

  filterTabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },

  filterTabTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  filterBadge: {
    marginLeft: 6,
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },

  filterBadgeActive: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },

  filterBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#475569",
  },

  filterBadgeTextActive: {
    color: "#FFFFFF",
  },

  // Order List
  list: {
    padding: 16,
    paddingBottom: 110,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 60,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },

  // Order Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  cardPendingHighlight: {
    borderLeftWidth: 4,
    borderLeftColor: "#EAB308",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  orderNumberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  orderNumber: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },

  timeText: {
    fontSize: 11,
    color: "#64748B",
  },

  cardBody: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },

  productThumb: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: PRIMARY_SOFT,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    overflow: "hidden",
  },

  productThumbImage: {
    width: "100%",
    height: "100%",
  },

  productThumbIcon: {
    fontSize: 24,
  },

  customerInfo: {
    flex: 1,
  },

  customerName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },

  customerPhone: {
    fontSize: 12,
    color: "#15803D",
    marginTop: 2,
    fontWeight: "600",
  },

  customerAddress: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },

  itemsSummary: {
    marginTop: 8,
    backgroundColor: "#F8FAFC",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  itemsSummaryText: {
    fontSize: 12,
    color: "#334155",
    lineHeight: 18,
  },

  cardFooter: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  itemsCount: {
    fontSize: 12,
    color: "#64748B",
  },

  totalAmount: {
    fontSize: 16,
    fontWeight: "800",
    color: "#15803D",
  },

  // Action Buttons
  actionRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  acceptButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#15803D",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#15803D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },

  acceptButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  rejectButton: {
    height: 42,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },

  rejectButtonText: {
    fontSize: 13,
    color: "#B91C1C",
    fontWeight: "700",
  },

  secondaryButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#0284C7",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  readyButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#D97706",
    alignItems: "center",
    justifyContent: "center",
  },

  readyButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  completeButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#15803D",
    alignItems: "center",
    justifyContent: "center",
  },

  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  // Status Badges
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },

  pendingBadge: {
    backgroundColor: "#FEF9C3",
    borderWidth: 1,
    borderColor: "#FDE047",
  },

  pendingText: {
    color: "#854D0E",
  },

  acceptedBadge: {
    backgroundColor: "#E0F2FE",
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },

  acceptedText: {
    color: "#0369A1",
  },

  preparingBadge: {
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#FDE68A",
  },

  preparingText: {
    color: "#B45309",
  },

  readyBadge: {
    backgroundColor: "#DCFCE7",
    borderWidth: 1,
    borderColor: "#86EFAC",
  },

  readyText: {
    color: "#15803D",
  },

  completedBadge: {
    backgroundColor: "#F1F5F9",
  },

  completedText: {
    color: "#475569",
  },

  cancelledBadge: {
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },

  cancelledText: {
    color: "#B91C1C",
  },

  // Rejection Reason Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },

  modalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },

  modalSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 16,
  },

  reasonOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
  },

  reasonOptionSelected: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#94A3B8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  radioOuterSelected: {
    borderColor: "#DC2626",
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#DC2626",
  },

  reasonText: {
    fontSize: 14,
    color: "#334155",
    fontWeight: "500",
  },

  reasonTextSelected: {
    color: "#991B1B",
    fontWeight: "700",
  },

  customReasonInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    color: "#0F172A",
    marginTop: 6,
    marginBottom: 16,
  },

  confirmRejectButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },

  confirmRejectText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
  },

  closeModalButton: {
    marginTop: 12,
    alignItems: "center",
    padding: 8,
  },

  closeModalText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
  },

  // Bottom Navigation
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
    minWidth: 64,
  },

  navIcon: {
    fontSize: 20,
    marginBottom: 2,
  },

  navLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
  },

  navLabelActive: {
    fontSize: 11,
    color: PRIMARY,
    fontWeight: "800",
  },

  // Header Top Row & History Button
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  headerSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },

  historyIconButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PRIMARY_SOFT,
    borderWidth: 1,
    borderColor: PRIMARY_BORDER,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },

  historyIcon: {
    fontSize: 16,
    marginRight: 5,
  },

  historyBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: PRIMARY,
  },

  // Order History Modal Styles
  historyModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },

  historyModalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    maxHeight: "90%",
    height: "90%",
  },

  historyModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  historyModalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  historyModalTitleIcon: {
    fontSize: 22,
  },

  historyModalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },

  historyModalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },

  historyModalCloseText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#64748B",
  },

  historyStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  historyStatBox: {
    alignItems: "center",
    flex: 1,
  },

  historyStatDivider: {
    width: 1,
    height: 28,
    backgroundColor: "#CBD5E1",
  },

  historyStatValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },

  historyStatValueGreen: {
    color: PRIMARY,
  },

  historyStatValueRed: {
    color: "#DC2626",
  },

  historyStatLabel: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "500",
  },

  historyFilterTabs: {
    flexDirection: "row",
    marginTop: 12,
    gap: 8,
  },

  historyFilterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  historyFilterPillActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },

  historyFilterPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },

  historyFilterPillTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  historyList: {
    paddingVertical: 12,
    paddingBottom: 24,
  },

  historyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  historyCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  historyOrderNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },

  historyDate: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    marginBottom: 4,
  },

  historyCustomerName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginTop: 2,
  },

  historyItemsText: {
    fontSize: 11,
    color: "#64748B",
    lineHeight: 16,
    marginTop: 4,
    marginBottom: 6,
  },

  historyFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    marginTop: 4,
  },

  historyAmount: {
    fontSize: 14,
    fontWeight: "800",
    color: PRIMARY,
  },
});

