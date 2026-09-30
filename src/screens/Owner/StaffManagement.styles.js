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
    paddingBottom: 25,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  backButtonText: {
    fontSize: 26,
    color: "#1E3A8A",
  },

  headerTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#111827",
  },

  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },

  content: {
    marginTop: 10,
  },

  title: {
    fontSize: 25,
    fontWeight: "700",
    color: "#111827",
  },

  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 21,
    marginTop: 7,
    marginBottom: 24,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  icon: {
    fontSize: 34,
    marginRight: 15,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  cardDescription: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 19,
    marginTop: 5,
  },

  arrow: {
    fontSize: 30,
    color: "#1E3A8A",
    marginLeft: 8,
  },
});

export default styles;
