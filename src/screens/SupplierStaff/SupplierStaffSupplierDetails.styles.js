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

  /* SCROLL */

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  /* SUPPLIER HERO */

  supplierHero: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 24,
  },

  supplierIconBox: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  supplierIcon: {
    fontSize: 36,
  },

  supplierTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  supplierSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  statusBadge: {
    paddingHorizontal: 14,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 11,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#047857",
  },

  /* SECTION */

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },

  /* DETAIL BOX */

  detailBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 11,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  detailIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: "#EEF2FF",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 21,
    overflow: "hidden",
  },

  detailContent: {
    flex: 1,
    marginLeft: 13,
  },

  detailLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    lineHeight: 19,
  },

  /* PRODUCTS BUTTON */

  productsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E3A8A",
    borderRadius: 16,
    padding: 16,
    marginTop: 13,
    minHeight: 70,
  },

  productsButtonIcon: {
    fontSize: 25,
  },

  productsButtonContent: {
    flex: 1,
    marginLeft: 12,
  },

  productsButtonTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  productsButtonSubtitle: {
    fontSize: 11,
    color: "#DDE5FF",
    lineHeight: 17,
    marginTop: 3,
  },

  productsArrow: {
    fontSize: 28,
    color: "#FFFFFF",
    marginLeft: 8,
  },

  bottomSpace: {
    height: 20,
  },

  /* BOTTOM NAV */

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
