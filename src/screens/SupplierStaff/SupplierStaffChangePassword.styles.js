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

  scrollContent: {
    paddingBottom: 40,
  },

  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  infoText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 21,
    marginBottom: 24,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },

  passwordContainer: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    marginBottom: 18,
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 15,
    fontSize: 14,
    color: "#111827",
  },

  showButton: {
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  showText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E3A8A",
  },

  requirementsBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: 13,
    padding: 15,
    marginTop: 2,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },

  requirementsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 8,
  },

  requirement: {
    fontSize: 12,
    color: "#4B5563",
    lineHeight: 19,
    marginBottom: 2,
  },

  changeButton: {
    height: 52,
    borderRadius: 13,
    backgroundColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  changeButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 8,
  },

  disabledButton: {
    opacity: 0.7,
  },

  centerContent: {
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
