import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  keyboardView: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: "center",
  },

  header: {
    marginBottom: 35,
  },

  logo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 30,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
  },

  form: {
    width: "100%",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginTop: 15,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },

  loginButton: {
    height: 52,
    backgroundColor: "#1E3A8A",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  forgotButton: {
    alignItems: "center",
    marginTop: 18,
  },

  forgotText: {
    color: "#1E3A8A",
    fontSize: 14,
    fontWeight: "600",
  },

  registerSection: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 35,
  },

  registerText: {
    color: "#6B7280",
    fontSize: 14,
  },

  registerLink: {
    color: "#1E3A8A",
    fontSize: 14,
    fontWeight: "700",
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 25,
  },

  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E3A8A",
  },

  feedbackCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 12,
    padding: 14,
    marginTop: 24,
  },

  feedbackIcon: {
    fontSize: 24,
    marginRight: 12,
  },

  feedbackTextWrap: {
    flex: 1,
  },

  feedbackTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E3A8A",
  },

  feedbackSubtitle: {
    fontSize: 12,
    color: "#3B82F6",
    marginTop: 2,
  },

  feedbackArrow: {
    fontSize: 18,
    color: "#1E3A8A",
    fontWeight: "700",
    marginLeft: 6,
  },
});

export default styles;
