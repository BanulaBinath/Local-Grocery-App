import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#64748B",
  },

  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonText: {
    fontSize: 18,
    color: "#1E3A8A",
    fontWeight: "700",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },

  headerSpace: {
    width: 38,
  },

  // Filter Tabs
  filterContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  filterScroll: {
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
    backgroundColor: "#1E3A8A",
    borderColor: "#1E3A8A",
  },

  filterTabText: {
    fontSize: 13,
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
    fontSize: 11,
    fontWeight: "700",
    color: "#475569",
  },

  filterBadgeTextActive: {
    color: "#FFFFFF",
  },

  // List
  list: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
  },

  emptyContainer: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 24,
  },

  emptyIcon: {
    fontSize: 52,
    marginBottom: 14,
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
    lineHeight: 19,
  },

  // Order Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  orderId: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  statusBadgePending: {
    backgroundColor: "#FEF3C7",
  },

  statusBadgeAccepted: {
    backgroundColor: "#DCFCE7",
  },

  statusBadgePreparing: {
    backgroundColor: "#EFF6FF",
  },

  statusBadgeReady: {
    backgroundColor: "#E0E7FF",
  },

  statusBadgeCompleted: {
    backgroundColor: "#F1F5F9",
  },

  statusBadgeCancelled: {
    backgroundColor: "#FEE2E2",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "800",
  },

  statusTextPending: {
    color: "#B45309",
  },

  statusTextAccepted: {
    color: "#15803D",
  },

  statusTextPreparing: {
    color: "#1D4ED8",
  },

  statusTextReady: {
    color: "#4338CA",
  },

  statusTextCompleted: {
    color: "#475569",
  },

  statusTextCancelled: {
    color: "#B91C1C",
  },

  dateText: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 10,
  },

  // Pickup Info Box
  pickupBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  pickupRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },

  pickupText: {
    fontSize: 12,
    color: "#334155",
    fontWeight: "600",
  },

  // Rejection Box
  rejectBox: {
    backgroundColor: "#FEF2F2",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginBottom: 12,
  },

  rejectTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#991B1B",
  },

  rejectReason: {
    fontSize: 12,
    color: "#B91C1C",
    marginTop: 2,
  },

  // Stepper
  stepperRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 4,
  },

  stepDot: {
    flex: 1,
    alignItems: "center",
  },

  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  stepCircleActive: {
    borderColor: "#15803D",
    backgroundColor: "#15803D",
  },

  stepCheck: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  stepLabel: {
    marginTop: 4,
    fontSize: 9,
    color: "#94A3B8",
    textAlign: "center",
  },

  stepLabelActive: {
    color: "#15803D",
    fontWeight: "700",
  },

  // Items List
  itemsSummaryBox: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 10,
    marginBottom: 10,
  },

  itemSummaryText: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 18,
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },

  metaText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },

  totalText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },

  cardActionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 8,
  },

  feedbackBtn: {
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  feedbackBtnText: {
    fontSize: 12,
    color: "#1E3A8A",
    fontWeight: "700",
  },
});
