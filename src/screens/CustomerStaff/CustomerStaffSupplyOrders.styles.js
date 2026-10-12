import { StyleSheet } from "react-native";

const PRIMARY = "#15803D";
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
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  summaryRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  summaryNumber: {
    fontSize: 22,
    fontWeight: "900",
    color: PRIMARY,
  },
  summaryLabel: {
    marginTop: 2,
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 42,
    marginBottom: 10,
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
    lineHeight: 20,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  productImage: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: PRIMARY_SOFT,
  },
  productIconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: PRIMARY_SOFT,
    alignItems: "center",
    justifyContent: "center",
  },
  productIcon: {
    fontSize: 22,
  },
  productInfo: {
    flex: 1,
    marginHorizontal: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  supplierName: {
    marginTop: 2,
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  waitingBadge: {
    backgroundColor: "#FFFBEB",
  },
  receivedBadge: {
    backgroundColor: PRIMARY_SOFT,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  waitingBadgeText: {
    color: "#D97706",
  },
  receivedBadgeText: {
    color: PRIMARY,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 13,
    color: "#0F172A",
    fontWeight: "700",
  },
  receivedBox: {
    marginTop: 10,
    backgroundColor: PRIMARY_SOFT,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  receivedBoxText: {
    fontSize: 12,
    color: PRIMARY,
    fontWeight: "700",
  },
  confirmButton: {
    marginTop: 12,
    height: 44,
    borderRadius: 12,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonDisabled: {
    opacity: 0.7,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
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
    minWidth: 56,
  },
  navIcon: {
    fontSize: 20,
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
});
