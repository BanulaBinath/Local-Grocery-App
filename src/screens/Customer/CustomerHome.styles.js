import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },

  logo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A",
  },

  welcome: {
    fontSize: 25,
    fontWeight: "700",
    color: "#111827",
    marginTop: 5,
  },

  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E8EEF9",
    justifyContent: "center",
    alignItems: "center",
  },

  profileIcon: {
    fontSize: 22,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1E3A8A",
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    lineHeight: 23,
    color: "#6B7280",
    marginBottom: 25,
  },

  primaryCard: {
    backgroundColor: "#1E3A8A",
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  secondaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  cardIcon: {
    fontSize: 28,
    marginBottom: 10,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 5,
  },

  cardDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: "#6B7280",
    maxWidth: 260,
  },

  primaryCard: {
    backgroundColor: "#1E3A8A",
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardArrow: {
    fontSize: 32,
    color: "#FFFFFF",
    fontWeight: "300",
  },

  bottomNavigation: {
    height: 75,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginBottom: 10,
    paddingHorizontal: 5,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },

  navText: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
  },

  activeNavText: {
    fontSize: 11,
    color: "#1E3A8A",
    fontWeight: "700",
  },
});

export default styles;
