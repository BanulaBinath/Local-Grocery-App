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
    paddingBottom: 16,
    backgroundColor: "#F5F7FB",
  },

  headerContent: {
    flex: 1,
  },

  logo: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E3A8A",
  },

  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
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

  /* SCROLL */

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  /* WELCOME */

  welcomeSection: {
    marginTop: 8,
    marginBottom: 22,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#111827",
  },

  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 21,
    marginTop: 7,
    maxWidth: 350,
  },

  /* SECTION HEADER */

  sectionHeader: {
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
  },

  /* CURRENT PICKUP */

  pickupCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  pickupTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  pickupIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  pickupIcon: {
    fontSize: 24,
  },

  pickupInfo: {
    flex: 1,
    marginLeft: 12,
  },

  pickupTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },

  pickupSupplier: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  timeBadge: {
    minWidth: 48,
    height: 32,
    paddingHorizontal: 9,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  timeBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E3A8A",
  },

  pickupDetails: {
    flexDirection: "row",
    marginTop: 18,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#F0F1F3",
  },

  detailItem: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
  },

  viewPickupButton: {
    marginTop: 17,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#1E3A8A",
    alignItems: "center",
    justifyContent: "center",
  },

  viewPickupButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  /* FULFILLMENT METRICS */

  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  metricCard: {
    width: "48%",
    minHeight: 142,
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  metricIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F0F3FF",
    alignItems: "center",
    justifyContent: "center",
  },

  metricIcon: {
    fontSize: 20,
  },

  metricNumber: {
    fontSize: 25,
    fontWeight: "800",
    color: "#111827",
    marginTop: 11,
  },

  metricLabel: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 17,
    marginTop: 3,
  },

  /* QUICK ACTION CARDS */

  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  actionIconBox: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  actionIcon: {
    fontSize: 23,
  },

  actionContent: {
    flex: 1,
    marginLeft: 13,
  },

  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  actionDescription: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
    marginTop: 4,
  },

  arrow: {
    fontSize: 28,
    color: "#1E3A8A",
    marginLeft: 8,
  },

  /* PROFILE CARD */

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  profileCardIconBox: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },

  profileCardIcon: {
    fontSize: 23,
  },

  bottomSpace: {
    height: 20,
  },

  /* BOTTOM NAVIGATION */

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
