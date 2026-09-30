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
    paddingVertical: 30,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 30,
  },

  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E3A8A",
  },

  header: {
    marginBottom: 25,
  },

  logo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
  },

  /* Profile Image */

  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },

  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    justifyContent: "center",
    alignItems: "center",
  },

  profileIcon: {
    fontSize: 42,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#1E3A8A",
  },

  imageButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
  },

  imageButtonText: {
    color: "#1E3A8A",
    fontSize: 13,
    fontWeight: "600",
  },

  form: {
    width: "100%",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginTop: 14,
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

  addressInput: {
    height: 90,
    paddingTop: 14,
  },

  noticeBox: {
    marginTop: 22,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },

  noticeTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 6,
  },

  noticeText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#4B5563",
  },

  registerButton: {
    height: 54,
    backgroundColor: "#1E3A8A",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },

  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  loginSection: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
    marginBottom: 20,
  },

  loginText: {
    color: "#6B7280",
    fontSize: 14,
  },

  loginLink: {
    color: "#1E3A8A",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 5,
  },
});

export default styles;
