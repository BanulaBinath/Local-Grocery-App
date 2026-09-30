import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // --------------------------------
  // MAIN
  // --------------------------------

  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  // --------------------------------
  // HEADER
  // --------------------------------

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 15,
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

  // --------------------------------
  // COUNT CARD
  // --------------------------------

  countCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  countIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  countIcon: {
    fontSize: 24,
  },

  countContent: {
    marginLeft: 13,
  },

  countNumber: {
    fontSize: 23,
    fontWeight: "800",
    color: "#111827",
  },

  countText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },

  // --------------------------------
  // LOADING
  // --------------------------------

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

  // --------------------------------
  // SCROLL
  // --------------------------------

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  // --------------------------------
  // EMPTY
  // --------------------------------

  emptyContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 25,
    paddingVertical: 45,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 5,
  },

  emptyIcon: {
    fontSize: 48,
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

  ordersButton: {
    height: 43,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#1E3A8A",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },

  ordersButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // --------------------------------
  // ORDER CARD
  // --------------------------------

  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 17,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  productIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  productIcon: {
    fontSize: 24,
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

  acceptedBadge: {
    minWidth: 72,
    height: 29,
    paddingHorizontal: 9,
    borderRadius: 15,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
  },

  acceptedBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#047857",
  },

  divider: {
    height: 1,
    backgroundColor: "#F0F1F3",
    marginVertical: 15,
  },

  // --------------------------------
  // ORDER DETAILS
  // --------------------------------

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

  // --------------------------------
  // PICKUP BOX
  // --------------------------------

  pickupBox: {
    backgroundColor: "#F8FAFF",
    borderRadius: 15,
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#DDE5FF",
  },

  pickupHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  pickupHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 21,
    marginRight: 10,
  },

  pickupHeaderContent: {
    flex: 1,
  },

  pickupBoxTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1E3A8A",
  },

  pickupBoxSubtitle: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },

  // --------------------------------
  // PICKUP INFORMATION ROW
  // --------------------------------

  pickupInfoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 13,
  },

  pickupInfoRowLast: {
    marginBottom: 0,
  },

  pickupIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  pickupInfoIcon: {
    fontSize: 17,
  },

  pickupInfoContent: {
    flex: 1,
  },

  pickupInfoLabel: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 3,
  },

  pickupInfoValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 20,
  },

  // --------------------------------
  // NOTE
  // --------------------------------

  noteContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 2,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  noteIcon: {
    fontSize: 18,
    width: 34,
    textAlign: "center",
    marginRight: 10,
  },

  noteContent: {
    flex: 1,
  },

  noteText: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 19,
  },

  // --------------------------------
  // COMPLETE BUTTON
  // --------------------------------

  completeButton: {
    height: 46,
    borderRadius: 12,
    backgroundColor: "#1E3A8A",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },

  completeButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  orderDate: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 10,
    textAlign: "center",
  },

  // --------------------------------
  // BOTTOM SPACE
  // --------------------------------

  bottomSpace: {
    height: 20,
  },

  // --------------------------------
  // BOTTOM NAVIGATION
  // --------------------------------

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
