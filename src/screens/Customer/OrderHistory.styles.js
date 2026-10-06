import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F6FF",
  },

  container: {
    flex: 1,
    backgroundColor: "#F5F6FF",
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#6B7280",
  },

  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonText: {
    fontSize: 20,
    color: "#1E3A8A",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  headerSpace: {
    width: 40,
  },

  list: {
    padding: 16,
    paddingBottom: 40,
  },

  emptyContainer: {
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 24,
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 18,
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
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  orderId: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#E8F5E9",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#2E7D32",
  },

  dateText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 10,
  },

  stepperRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
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
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  stepCircleActive: {
    borderColor: "#2E7D32",
    backgroundColor: "#2E7D32",
  },

  stepCheck: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },

  stepLabel: {
    marginTop: 4,
    fontSize: 9,
    color: "#9CA3AF",
    textAlign: "center",
  },

  stepLabelActive: {
    color: "#2E7D32",
    fontWeight: "700",
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
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

  cancelNote: {
    marginTop: 8,
    fontSize: 12,
    color: "#DC2626",
  },
});
