import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  backButton: {
    paddingVertical: 6,
    paddingRight: 12,
  },

  backButtonText: {
    fontSize: 14,
    color: "#1E3A8A",
    fontWeight: "700",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },

  markAllReadText: {
    fontSize: 12,
    color: "#2563EB",
    fontWeight: "600",
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

  listContent: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 40,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    marginTop: 60,
  },

  emptyIcon: {
    fontSize: 54,
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
    lineHeight: 18,
  },

  notificationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },

  notificationUnread: {
    backgroundColor: "#F0F7FF",
    borderColor: "#BFDBFE",
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  iconAccepted: {
    backgroundColor: "#DCFCE7",
  },

  iconRejected: {
    backgroundColor: "#FEE2E2",
  },

  iconReady: {
    backgroundColor: "#DBEAFE",
  },

  iconPlaced: {
    backgroundColor: "#FEF3C7",
  },

  iconGeneral: {
    backgroundColor: "#F1F5F9",
  },

  iconText: {
    fontSize: 20,
  },

  cardBody: {
    flex: 1,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 3,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2563EB",
    marginLeft: 6,
  },

  cardMessage: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },

  cardTime: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 6,
  },
});

export default styles;
