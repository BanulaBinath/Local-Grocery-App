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
  },

  // --------------------------------
  // HEADER
  // --------------------------------

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
  },

  headerContent: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 23,
    fontWeight: "700",
    color: "#111827",
  },

  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  // Profile button stays at top-right
  profileButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  profileIcon: {
    fontSize: 21,
  },

  // --------------------------------
  // CONTENT
  // --------------------------------

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 20,
  },

  // --------------------------------
  // LOADING
  // --------------------------------

  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },

  // --------------------------------
  // SUPPLIER CARD
  // --------------------------------

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  icon: {
    fontSize: 27,
  },

  cardContent: {
    flex: 1,
  },

  businessName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  supplierName: {
    fontSize: 13,
    color: "#4B5563",
    marginTop: 3,
  },

  address: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 5,
  },

  arrow: {
    fontSize: 30,
    color: "#1E3A8A",
    marginLeft: 8,
  },

  // --------------------------------
  // EMPTY STATE
  // --------------------------------

  emptyContainer: {
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 30,
  },

  emptyIcon: {
    fontSize: 50,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },

  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 21,
    marginTop: 8,
  },

  // --------------------------------
  // BOTTOM SPACE
  // --------------------------------

  bottomSpace: {
    height: 25,
  },

  // --------------------------------
  // BOTTOM NAVIGATION
  // --------------------------------

  bottomNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 9,
    paddingBottom: 10,
    paddingHorizontal: 5,
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
    color: "#6B7280",
    fontWeight: "500",
  },

  navLabelActive: {
    fontSize: 10,
    color: "#1E3A8A",
    fontWeight: "700",
  },
});

export default styles;
