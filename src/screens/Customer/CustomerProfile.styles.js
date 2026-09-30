import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E8EEF9",
    justifyContent: "center",
    alignItems: "center",
  },

  backButtonText: {
    fontSize: 25,
    color: "#1E3A8A",
    fontWeight: "600",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  headerSpace: {
    width: 42,
  },

  profileSection: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 25,
  },

  profileImage: {
    width: 105,
    height: 105,
    borderRadius: 52.5,
    borderWidth: 3,
    borderColor: "#1E3A8A",
  },

  profilePlaceholder: {
    width: 105,
    height: 105,
    borderRadius: 52.5,
    backgroundColor: "#E8EEF9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#1E3A8A",
  },

  profileIcon: {
    fontSize: 45,
  },

  customerName: {
    fontSize: 23,
    fontWeight: "800",
    color: "#111827",
    marginTop: 12,
  },

  customerEmail: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 18,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  infoIcon: {
    fontSize: 20,
    width: 35,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 3,
  },

  infoValue: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
  },

  ordersButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  ordersLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  ordersIcon: {
    fontSize: 27,
    marginRight: 15,
  },

  ordersTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  ordersSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },

  arrow: {
    fontSize: 30,
    color: "#1E3A8A",
  },

  logoutButton: {
    height: 55,
    borderRadius: 15,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutIcon: {
    fontSize: 20,
    marginRight: 8,
  },

  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#DC2626",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
});

export default styles;
