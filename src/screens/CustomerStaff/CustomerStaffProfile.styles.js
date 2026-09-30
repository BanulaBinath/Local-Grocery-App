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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F6FF",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "#F5F6FF",
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
    marginBottom: 20,
  },

  header: {
    height: 65,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  backButtonIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  backButtonIconText: {
    fontSize: 25,
    color: "#1E3A8A",
    fontWeight: "600",
  },

  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginLeft: 15,
  },

  headerSpace: {
    width: 42,
  },

  profileHeader: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#FFFFFF",
    marginBottom: 20,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  avatarText: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  role: {
    marginTop: 5,
    fontSize: 14,
    color: "#6B7280",
  },

  section: {
    marginHorizontal: 20,
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  infoRow: {
    paddingVertical: 15,
  },

  infoLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 5,
    fontWeight: "500",
  },

  infoValue: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#16A34A",
    marginRight: 12,
  },

  statusContent: {
    flex: 1,
  },

  statusTitle: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 3,
  },

  statusValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#16A34A",
  },

  actions: {
    marginHorizontal: 20,
    marginBottom: 35,
  },

  editButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  editButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  passwordButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  passwordButtonText: {
    color: "#1E3A8A",
    fontSize: 16,
    fontWeight: "700",
  },

  logoutButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutButtonText: {
    color: "#DC2626",
    fontSize: 16,
    fontWeight: "700",
  },

  backButton: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },

  backButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
