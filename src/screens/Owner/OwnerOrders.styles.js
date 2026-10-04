import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E8EEFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 26,
    color: "#1E3A8A",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  headerSubtitle: {
    marginTop: 3,
    color: "#6B7280",
  },
  filterList: {
    gap: 8,
    paddingBottom: 18,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  activeFilterButton: {
    backgroundColor: "#1E3A8A",
    borderColor: "#1E3A8A",
  },
  filterText: {
    fontWeight: "600",
    color: "#4B5563",
  },
  activeFilterText: {
    color: "#FFFFFF",
  },
  loader: {
    marginTop: 70,
  },
  orderList: {
    gap: 12,
  },
  orderCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderId: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
  },
  status: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "700",
  },
  statuspending: {
    color: "#92400E",
    backgroundColor: "#FEF3C7",
  },
  statusprocessing: {
    color: "#1D4ED8",
    backgroundColor: "#DBEAFE",
  },
  statuscompleted: {
    color: "#166534",
    backgroundColor: "#DCFCE7",
  },
  statusall: {
    color: "#991B1B",
    backgroundColor: "#FEE2E2",
  },
  productName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 7,
  },
  orderDetail: {
    color: "#6B7280",
    marginBottom: 4,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  orderDate: {
    flex: 1,
    color: "#6B7280",
    fontSize: 12,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 70,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  emptyDescription: {
    marginTop: 7,
    color: "#6B7280",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: "#1E3A8A",
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});

export default styles;
