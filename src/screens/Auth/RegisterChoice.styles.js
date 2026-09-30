import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 30,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 35,
  },

  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E3A8A",
  },

  header: {
    marginBottom: 35,
  },

  logo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 25,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: "#6B7280",
  },

  options: {
    gap: 18,
  },

  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 20,
    backgroundColor: "#F9FAFB",
  },

  icon: {
    fontSize: 32,
    marginRight: 16,
  },

  optionContent: {
    flex: 1,
  },

  optionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },

  optionDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: "#6B7280",
  },

  arrow: {
    fontSize: 30,
    color: "#1E3A8A",
    marginLeft: 10,
  },

  footer: {
    marginTop: "auto",
    textAlign: "center",
    fontSize: 13,
    color: "#9CA3AF",
  },
});

export default styles;
