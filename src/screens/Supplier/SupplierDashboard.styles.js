import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },

  // ==========================================
  // HEADER
  // ==========================================

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
    backgroundColor: "#F5F7FB",
  },

  logo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E3A8A",
  },

  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  profileButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#E8EEFF",
    alignItems: "center",
    justifyContent: "center",
  },

  profileIcon: {
    fontSize: 23,
  },

  // ==========================================
  // WELCOME
  // ==========================================

  welcomeSection: {
    marginBottom: 24,
  },

  title: {
    fontSize: 27,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 7,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
  },

  // ==========================================
  // SECTIONS
  // ==========================================

  section: {
    marginBottom: 24,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },

  viewAll: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E3A8A",
  },

  // ==========================================
  // PICKUP / STAFF ACTIVITY
  // ==========================================

  activityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  activityIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#E8EEFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  activityIconText: {
    fontSize: 23,
  },

  activityContent: {
    flex: 1,
  },

  activityTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 5,
  },

  activityText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#6B7280",
    marginBottom: 10,
  },

  activityDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  activityDetail: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },

  // ==========================================
  // FULFILLMENT METRICS
  // ==========================================

  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },

  metricCard: {
    width: "48%",
    minHeight: 130,
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  metricIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  metricNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 3,
  },

  metricLabel: {
    fontSize: 12,
    lineHeight: 17,
    color: "#6B7280",
    fontWeight: "500",
  },

  // ==========================================
  // CUSTOMER ORDERS
  // ==========================================

  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  orderTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 17,
  },

  orderId: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },

  orderCustomer: {
    fontSize: 12,
    color: "#6B7280",
  },

  pendingBadge: {
    backgroundColor: "#FFF7ED",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  pendingBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#EA580C",
  },

  completedBadge: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  completedBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#16A34A",
  },

  progressContainer: {
    marginBottom: 9,
  },

  progressBackground: {
    height: 7,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: 7,
    backgroundColor: "#1E3A8A",
    borderRadius: 10,
  },

  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  progressLabel: {
    fontSize: 9,
    color: "#9CA3AF",
  },

  progressActive: {
    fontSize: 9,
    color: "#1E3A8A",
    fontWeight: "700",
  },

  // ==========================================
  // RECENT MESSAGES
  // ==========================================

  messageCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  messageAvatar: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#1E3A8A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  messageAvatarText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  messageContent: {
    flex: 1,
  },

  messageTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },

  messageName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  messageTime: {
    fontSize: 10,
    color: "#9CA3AF",
  },

  messageText: {
    fontSize: 12,
    color: "#6B7280",
  },

  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#1E3A8A",
    marginLeft: 8,
  },

  // ==========================================
  // BOTTOM NAVIGATION
  // ==========================================

  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 76,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    elevation: 10,
    paddingBottom: 5,
  },

  navItem: {
    flex: 1,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },

  navIcon: {
    fontSize: 23,
    marginBottom: 4,
  },

  navLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6B7280",
  },

  navLabelActive: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1E3A8A",
  },
});

export default styles;
