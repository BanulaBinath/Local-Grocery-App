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

  header: {
    height: 75,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  logo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E3A8A",
  },

  headerSubtitle: {
    marginTop: 3,
    fontSize: 13,
    color: "#6B7280",
  },

  profileButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  profileIcon: {
    fontSize: 20,
  },

  welcomeSection: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
  },

  cards: {
    paddingHorizontal: 20,
  },

  card: {
    minHeight: 92,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 24,
    marginRight: 14,
    overflow: "hidden",
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },

  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280",
  },

  arrow: {
    fontSize: 28,
    color: "#9CA3AF",
    marginLeft: 10,
  },
});
