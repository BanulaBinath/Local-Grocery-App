import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // ========================================
  // HEADER
  // ========================================

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,

    elevation: 2,
  },

  backButtonText: {
    fontSize: 25,
    color: "#1E3A8A",
    fontWeight: "600",
  },

  headerContent: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#111827",
  },

  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },

  countBadge: {
    minWidth: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#E8EEFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  countText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E3A8A",
  },

  // ========================================
  // LIST
  // ========================================

  list: {
    paddingBottom: 30,
  },

  // ========================================
  // SUPPLIER CARD
  // ========================================

  supplierCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,

    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  businessIcon: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: "#E8EEFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  businessIconText: {
    fontSize: 25,
  },

  businessInfo: {
    flex: 1,
  },

  businessName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  supplierName: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  pendingBadge: {
    backgroundColor: "#FFF7E6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },

  pendingText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#B7791F",
  },

  // ========================================
  // DETAILS
  // ========================================

  details: {
    borderTopWidth: 1,
    borderTopColor: "#EEF0F4",
    paddingTop: 14,
  },

  detailRow: {
    marginBottom: 12,
  },

  detailLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9CA3AF",
    marginBottom: 3,
  },

  detailValue: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },

  // ========================================
  // ACTION BUTTONS
  // ========================================

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },

  rejectButton: {
    flex: 1,
    height: 48,
    borderRadius: 13,
    backgroundColor: "#FFF1F2",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  rejectText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#DC2626",
  },

  approveButton: {
    flex: 1,
    height: 48,
    borderRadius: 13,
    backgroundColor: "#1E3A8A",
    alignItems: "center",
    justifyContent: "center",
  },

  approveText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // ========================================
  // LOADING
  // ========================================

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  loadingText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 12,
  },

  // ========================================
  // EMPTY STATE
  // ========================================

  emptyContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 30,
    alignItems: "center",
    marginTop: 30,
  },

  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E8F5E9",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 32,
    fontWeight: "700",
    color: "#16A34A",
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
    textAlign: "center",
  },
});

export default styles;
