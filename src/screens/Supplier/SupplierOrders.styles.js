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

  // =========================
  // HEADER
  // =========================

  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    position: "relative",
  },

  headerContent: {
    paddingRight: 80,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },

  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },

  profileButton: {
    position: "absolute",
    right: 20,
    top: 18,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  profileIcon: {
    fontSize: 20,
  },

  countBadge: {
    position: "absolute",
    right: 20,
    bottom: 14,
    minWidth: 28,
    height: 28,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: "#1E3A8A",
    alignItems: "center",
    justifyContent: "center",
  },

  countText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  // =========================
  // LOADING
  // =========================

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F7FB",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#6B7280",
  },

  // =========================
  // ORDER LIST
  // =========================

  list: {
    padding: 16,
    paddingBottom: 120,
  },

  // =========================
  // EMPTY STATE
  // =========================

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingTop: 100,
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },

  // =========================
  // ORDER CARD
  // =========================

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  // =========================
  // PRODUCT IMAGE
  // =========================

  productImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#EEF2FF",
    marginRight: 12,
  },

  productImage: {
    width: "100%",
    height: "100%",
  },

  productImagePlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2FF",
  },

  productIcon: {
    fontSize: 25,
  },

  productInfo: {
    flex: 1,
    paddingRight: 8,
  },

  productName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  staffName: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B7280",
  },

  // =========================
  // STATUS
  // =========================

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },

  pendingStatus: {
    backgroundColor: "#FEF3C7",
  },

  acceptedStatus: {
    backgroundColor: "#DCFCE7",
  },

  rejectedStatus: {
    backgroundColor: "#FEE2E2",
  },

  readyStatus: {
    backgroundColor: "#DBEAFE",
  },

  completedStatus: {
    backgroundColor: "#E0E7FF",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 14,
  },

  // =========================
  // ORDER DETAILS
  // =========================

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 9,
  },

  detailLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  detailValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  totalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  totalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A8A",
  },

  // =========================
  // PICKUP INFORMATION
  // =========================

  pickupInfo: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  pickupText: {
    fontSize: 12,
    color: "#374151",
    marginBottom: 7,
    lineHeight: 18,
  },

  dateText: {
    marginTop: 12,
    fontSize: 11,
    color: "#9CA3AF",
  },

  // =========================
  // ACTION BUTTONS
  // =========================

  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

  rejectButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  rejectButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#DC2626",
  },

  acceptButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E3A8A",
  },

  acceptButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // =========================
  // READY FOR PICKUP BUTTON
  // =========================

  readyButton: {
    width: "100%",
    height: 46,
    marginTop: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E3A8A",
  },

  readyButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // =========================
  // BOTTOM NAVIGATION
  // =========================

  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 76,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 6,
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },

  navLabel: {
    fontSize: 10,
    color: "#6B7280",
  },

  navLabelActive: {
    fontSize: 10,
    fontWeight: "700",
    color: "#1E3A8A",
  },
});

export default styles;
