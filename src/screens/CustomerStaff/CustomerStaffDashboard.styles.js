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
    backgroundColor: BG,
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

  searchContainer: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
  },

  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    paddingVertical: 0,
  },

  list: {
    padding: 16,
    paddingBottom: 110,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingTop: 80,
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

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  productThumb: {
    width: 56,
    height: 56,
    borderRadius: 10,
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

  cardInfo: {
    flex: 1,
    paddingRight: 8,
  },

  orderId: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  customerName: {
    marginTop: 3,
    fontSize: 14,
    color: "#374151",
  },

  dateText: {
    marginTop: 4,
    fontSize: 12,
    color: "#9CA3AF",
  },

  cardRight: {
    alignItems: "flex-end",
    gap: 8,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: PRIMARY_SOFT,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: PRIMARY,
  },

  pendingBadge: {
    backgroundColor: PRIMARY_SOFT,
  },

  acceptedBadge: {
    backgroundColor: "#E3F2FD",
  },

  preparingBadge: {
    backgroundColor: "#FFF8E1",
  },

  readyBadge: {
    backgroundColor: "#E8F5E9",
  },

  completedBadge: {
    backgroundColor: "#E0E7FF",
  },

  cancelledBadge: {
    backgroundColor: "#FEE2E2",
  },

  pendingText: {
    color: PRIMARY,
  },

  acceptedText: {
    color: "#1565C0",
  },

  preparingText: {
    color: "#F57F17",
  },

  readyText: {
    color: "#2E7D32",
  },

  completedText: {
    color: "#3730A3",
  },

  cancelledText: {
    color: "#B91C1C",
  },

  cardMeta: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  metaText: {
    fontSize: 13,
    color: "#6B7280",
  },

  totalText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  actionRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  acceptButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },

  acceptButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  rejectButton: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },

  rejectButtonText: {
    fontSize: 16,
    color: "#DC2626",
    fontWeight: "700",
  },

  secondaryButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
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
});
