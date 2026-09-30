import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  backButtonText: {
    fontSize: 26,
    color: "#1E3A8A",
    marginTop: -2,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },

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

  errorText: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
  },

  scrollContent: {
    paddingBottom: 40,
  },

  profileHeader: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 15,
  },

  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  avatarText: {
    fontSize: 34,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  name: {
    fontSize: 21,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },

  role: {
    fontSize: 14,
    color: "#1E3A8A",
    fontWeight: "600",
    marginTop: 5,
  },

  /* Edit Profile */

  editButton: {
    height: 52,
    borderRadius: 13,
    backgroundColor: "#1E3A8A",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },

  editButtonIcon: {
    fontSize: 17,
    marginRight: 8,
  },

  editButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  /* Sections */

  section: {
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
    borderRadius: 16,
    paddingHorizontal: 17,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  infoRow: {
    minHeight: 58,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 15,
  },

  infoRowColumn: {
    paddingVertical: 15,
  },

  infoLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
    flexShrink: 0,
  },

  infoValue: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
    textAlign: "right",
  },

  addressValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
    lineHeight: 20,
    marginTop: 7,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  roleValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E3A8A",
  },

  activeValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#16A34A",
  },

  /* Change Password */

  passwordButton: {
    backgroundColor: "#FFFFFF",
    minHeight: 70,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 17,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  passwordButtonTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  passwordButtonDescription: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },

  passwordArrow: {
    fontSize: 28,
    color: "#1E3A8A",
    marginLeft: 10,
  },

  /* Logout */

  logoutButton: {
    height: 50,
    borderRadius: 13,
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FECACA",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  logoutButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#B91C1C",
  },
});

export default styles;
