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

  /* HEADER */

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 15,
    backgroundColor: "#F5F7FB",
  },

  headerContent: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 23,
    fontWeight: "800",
    color: "#111827",
  },

  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
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

  /* SUMMARY */

  summaryRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 9,
  },

  summaryCard: {
    flex: 1,
    minHeight: 91,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 7,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  summaryCardActive: {
    borderColor: "#1E3A8A",
    backgroundColor: "#EEF2FF",
  },

  summaryCardRejected: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },

  summaryIcon: {
    fontSize: 19,
  },

  summaryNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginTop: 2,
  },

  summaryLabel: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 1,
    textAlign: "center",
  },

  /* TABS */

  tabs: {
    flexDirection: "row",
    marginHorizontal: 20,
    backgroundColor: "#EDEFF4",
    borderRadius: 13,
    padding: 4,
    marginBottom: 15,
  },

  tab: {
    flex: 1,
    minHeight: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  activeTab: {
    backgroundColor: "#FFFFFF",
    elevation: 2,
  },

  activeRejectedTab: {
    backgroundColor: "#FFFFFF",
    elevation: 2,
  },

  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },

  activeTabText: {
    color: "#1E3A8A",
    fontWeight: "800",
  },

  activeRejectedTabText: {
    color: "#DC2626",
    fontWeight: "800",
  },

  /* SCROLL */

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  /* LOADING */

  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 10,
  },

  /* EMPTY */

  emptyContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 25,
    paddingVertical: 45,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 10,
  },

  emptyIcon: {
    fontSize: 46,
    marginBottom: 13,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
  },

  emptyText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 7,
    maxWidth: 290,
  },

  shopButton: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 20,
    height: 43,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },

  shopButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  /* ORDER CARD */

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 17,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  productIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  productImage: {
    width: "100%",
    height: "100%",
  },

  productIcon: {
    fontSize: 23,
  },

  productInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },

  productName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },

  supplierName: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },

  statusBadge: {
    minWidth: 76,
    paddingHorizontal: 9,
    height: 29,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },

  pendingStatus: {
    backgroundColor: "#FFF7ED",
  },

  acceptedStatus: {
    backgroundColor: "#ECFDF5",
  },

  rejectedStatus: {
    backgroundColor: "#FEF2F2",
  },

  completedStatus: {
    backgroundColor: "#EEF2FF",
  },

  divider: {
    height: 1,
    backgroundColor: "#F0F1F3",
    marginVertical: 15,
  },

  /* DETAILS */

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 9,
  },

  detailLabel: {
    fontSize: 12,
    color: "#6B7280",
  },

  detailValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },

  totalValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1E3A8A",
  },

  dateText: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 5,
  },

  /* DELETE */

  deleteButton: {
    height: 42,
    borderRadius: 11,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },

  deleteButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#DC2626",
  },

  /* PICKUP NOTICE */

  pickupNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    borderRadius: 16,
    padding: 15,
    marginTop: 2,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },

  pickupNoticeIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  pickupNoticeContent: {
    flex: 1,
    marginLeft: 11,
  },

  pickupNoticeTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1E3A8A",
  },

  pickupNoticeText: {
    fontSize: 12,
    color: "#4B5563",
    marginTop: 3,
  },

  pickupNoticeArrow: {
    fontSize: 27,
    color: "#1E3A8A",
    marginLeft: 6,
  },

  /* HISTORY NOTICE */

  historyNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },

  historyNoticeIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  historyNoticeContent: {
    flex: 1,
    marginLeft: 11,
  },

  historyNoticeTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#166534",
  },

  historyNoticeText: {
    fontSize: 12,
    color: "#4B5563",
    marginTop: 3,
  },

  historyNoticeArrow: {
    fontSize: 27,
    color: "#166534",
    marginLeft: 6,
  },

  bottomSpace: {
    height: 20,
  },

  /* BOTTOM NAV */

  bottomNav: {
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
    alignItems: "center",
    justifyContent: "center",
  },

  navIcon: {
    fontSize: 20,
    marginBottom: 3,
  },

  navIconActive: {
    fontSize: 20,
    marginBottom: 3,
  },

  navLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#6B7280",
  },

  navLabelActive: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1E3A8A",
  },
});

export default styles;
