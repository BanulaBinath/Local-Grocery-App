import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 28,
    justifyContent: "space-between",
  },

  logoSection: {
    alignItems: "center",
    marginTop: 10,
  },

  logoContainer: {
    width: 105,
    height: 105,
    borderRadius: 52.5,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  logo: {
    width: 82,
    height: 82,
  },

  appName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1E3A8A",
    marginBottom: 5,
  },

  tagline: {
    fontSize: 13,
    color: "#6B7280",
    letterSpacing: 0.5,
  },

  content: {
    alignItems: "center",
    paddingHorizontal: 8,
  },

  title: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 14,
  },

  description: {
    fontSize: 15,
    lineHeight: 23,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 5,
  },

  buttonContainer: {
    width: "100%",
    marginTop: 10,
  },

  loginButton: {
    height: 55,
    backgroundColor: "#1E3A8A",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  registerButton: {
    height: 55,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#1E3A8A",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  registerButtonText: {
    color: "#1E3A8A",
    fontSize: 16,
    fontWeight: "700",
  },

  feedbackButton: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },

  feedbackIcon: {
    fontSize: 15,
    marginRight: 5,
  },

  feedbackText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },

  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 10,
  },
});

export default styles;
