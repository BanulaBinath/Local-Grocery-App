import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  backButton: {
    paddingVertical: 6,
    paddingRight: 12,
  },

  backButtonText: {
    fontSize: 14,
    color: "#1E3A8A",
    fontWeight: "700",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },

  headerAction: {
    fontSize: 13,
    color: "#1E3A8A",
    fontWeight: "700",
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 50,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#64748B",
  },

  // Rating Overview Card
  overviewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },

  overviewTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  scoreBig: {
    fontSize: 38,
    fontWeight: "900",
    color: "#0F172A",
  },

  starsRow: {
    flexDirection: "row",
    marginVertical: 4,
    gap: 2,
  },

  starIcon: {
    fontSize: 18,
  },

  totalReviewsText: {
    fontSize: 12,
    color: "#64748B",
  },

  leaveReviewBtn: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },

  leaveReviewBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },

  // Visitor Banner
  visitorBanner: {
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginTop: 6,
  },

  visitorBannerText: {
    flex: 1,
    fontSize: 12,
    color: "#1E3A8A",
    lineHeight: 16,
  },

  loginBtnSmall: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },

  loginBtnSmallText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 12,
    marginTop: 4,
  },

  // Review Card
  reviewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },

  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },

  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  authorAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  authorAvatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E3A8A",
  },

  authorName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },

  verifiedBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },

  verifiedText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#15803D",
  },

  reviewDate: {
    fontSize: 11,
    color: "#94A3B8",
  },

  reviewComment: {
    fontSize: 13,
    color: "#334155",
    lineHeight: 19,
    marginTop: 4,
  },

  orderTag: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 8,
    fontStyle: "italic",
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: 50,
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },

  emptyText: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
  },

  // Feedback Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 36,
  },

  modalHandleBar: {
    width: 44,
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 14,
  },

  modalTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },

  modalCloseText: {
    fontSize: 16,
    color: "#94A3B8",
    fontWeight: "700",
  },

  starSelectorRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginVertical: 14,
  },

  starButton: {
    padding: 6,
  },

  starButtonIcon: {
    fontSize: 34,
  },

  ratingHint: {
    textAlign: "center",
    fontSize: 13,
    color: "#1E3A8A",
    fontWeight: "700",
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 6,
    marginTop: 8,
  },

  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#0F172A",
  },

  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },

  submitBtn: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
  },

  submitBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});

export default styles;
