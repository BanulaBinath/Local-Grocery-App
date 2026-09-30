import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // ========================================
  // MAIN
  // ========================================

  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // ========================================
  // HEADER
  // ========================================

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 22,
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
  },

  headerContent: {
    flex: 1,
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

  // ========================================
  // LOADING
  // ========================================

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

  // ========================================
  // PRODUCT CARD
  // ========================================

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  // ========================================
  // PRODUCT IMAGE / ICON
  // ========================================

  productImageContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    overflow: "hidden",
  },

  productImage: {
    width: "100%",
    height: "100%",
  },

  // Keep fallback icon
  productIconContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  productIcon: {
    fontSize: 28,
  },

  // ========================================
  // PRODUCT CONTENT
  // ========================================

  cardContent: {
    flex: 1,
  },

  productName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  category: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A8A",
    marginTop: 7,
  },

  stock: {
    fontSize: 12,
    color: "#4B5563",
    marginTop: 3,
  },

  // ========================================
  // ACTIVE BADGE
  // ========================================

  activeBadge: {
    position: "absolute",
    top: 10,
    right: 34,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: "#DCFCE7",
  },

  activeBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#15803D",
  },

  // ========================================
  // ARROW
  // ========================================

  arrow: {
    fontSize: 30,
    color: "#1E3A8A",
    marginLeft: 8,
  },

  // ========================================
  // EMPTY STATE
  // ========================================

  emptyContainer: {
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 30,
  },

  emptyIcon: {
    fontSize: 50,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },

  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 21,
    marginTop: 8,
  },
});

export default styles;
