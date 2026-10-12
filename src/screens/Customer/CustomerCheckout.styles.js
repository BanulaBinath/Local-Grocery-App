import { StyleSheet } from "react-native";

const NAVY = "#1E3A8A";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: "#FFFFFF",
  },
  backText: {
    fontSize: 16,
    color: "#334155",
    fontWeight: "600",
    width: 70,
  },
  headerCenter: {
    alignItems: "center",
  },
  headerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E8EEF9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  headerSpace: {
    width: 70,
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  infoBanner: {
    backgroundColor: "#EFF6FF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: NAVY,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#1D4ED8",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0F172A",
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  datePill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: "#F1F5F9",
  },
  datePillActive: {
    backgroundColor: NAVY,
  },
  datePillText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
  },
  datePillTextActive: {
    color: "#FFFFFF",
  },
  timeSlot: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  timeSlotActive: {
    backgroundColor: "#EEF2FF",
    borderColor: NAVY,
  },
  timeSlotText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
  },
  timeSlotTextActive: {
    color: NAVY,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    paddingBottom: 22,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  confirmButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: NAVY,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "#94A3B8",
  },
  confirmText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  inputReadonly: {
    backgroundColor: "#F8FAFC",
    color: "#0F172A",
  },
  summaryMuted: {
    fontSize: 13,
    color: "#64748B",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#64748B",
    flex: 1,
    marginRight: 8,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  freeText: {
    color: "#16A34A",
    fontWeight: "800",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: NAVY,
  },
});
