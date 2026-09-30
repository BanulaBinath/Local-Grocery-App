import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // =========================
  // HEADER
  // =========================

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  logo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E3A8A",
  },

  welcome: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },

  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E8EEFF",
    alignItems: "center",
    justifyContent: "center",
  },

  profileIcon: {
    fontSize: 24,
  },

  // =========================
  // WELCOME SECTION
  // =========================

  welcomeSection: {
    marginBottom: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#6B7280",
  },

  // =========================
  // DASHBOARD CARDS
  // =========================

  cards: {
    gap: 14,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,

    elevation: 2,
  },

  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#E8EEFF",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 25,
    marginRight: 14,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 5,
  },

  cardDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: "#6B7280",
  },

  arrow: {
    fontSize: 28,
    color: "#1E3A8A",
    marginLeft: 8,
  },
});

export default styles;
