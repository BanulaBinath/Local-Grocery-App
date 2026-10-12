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

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },

  // =========================
  // HEADER
  // =========================

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
  },

  logo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E3A8A",
  },

  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },

  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E8EEFF",
    alignItems: "center",
    justifyContent: "center",
  },

  profileIcon: {
    fontSize: 24,
  },

  // =========================
  // WELCOME SECTION
  // =========================

  welcomeSection: {
    marginBottom: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
  },

  summarySection: {
    marginBottom: 24,
  },

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

  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  summaryCards: {
    flexDirection: "row",
    gap: 10,
  },

  summaryCard: {
    flex: 1,
    minHeight: 118,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  summaryIcon: {
    fontSize: 20,
    marginBottom: 6,
  },

  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A",
  },

  summaryLabel: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B7280",
  },

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
    fontSize: 21,
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

  // =========================
  // DASHBOARD CARDS
  // =========================

  cards: {
    gap: 14,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#E8EEFF",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 25,
    marginRight: 14,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 5,
  },

  cardDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: "#6B7280",
  },

  arrow: {
    fontSize: 28,
    color: "#1E3A8A",
    marginLeft: 8,
  },

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
