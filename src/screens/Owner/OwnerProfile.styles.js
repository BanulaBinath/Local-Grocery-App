import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F6FF",
  },

  container: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#555",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  emptyIcon: {
    fontSize: 50,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginBottom: 20,
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
    fontWeight: "600",
  },

  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  backButtonIcon: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  backButtonIconText: {
    fontSize: 28,
    color: "#1E3A8A",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },

  headerSpace: {
    width: 40,
  },

  profileHeader: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#FFFFFF",
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
    fontSize: 38,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 14,
  },

  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },

  role: {
    marginTop: 5,
    fontSize: 15,
    color: "#1E3A8A",
    fontWeight: "600",
  },

  section: {
    marginTop: 20,
    paddingHorizontal: 18,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  infoRow: {
    paddingVertical: 15,
  },

  infoLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 5,
  },

  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22C55E",
    marginRight: 12,
  },

  statusTitle: {
    fontSize: 13,
    color: "#6B7280",
  },

  statusValue: {
    marginTop: 3,
    fontSize: 16,
    fontWeight: "700",
    color: "#16A34A",
  },

  actions: {
    paddingHorizontal: 18,
    marginTop: 30,
    marginBottom: 40,
  },

  logoutButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  editButton: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },

  editButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  deleteButton: {
    alignItems: "center",
    paddingVertical: 16,
    marginTop: 8,
  },

  deleteButtonText: {
    color: "#B91C1C",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default styles;
