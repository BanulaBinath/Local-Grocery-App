import { StyleSheet } from "react-native";

const PRIMARY = "#2E7D32";
const PRIMARY_SOFT = "#E8F5E9";

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7F5",
  },

  container: {
    flex: 1,
  },

  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PRIMARY_SOFT,
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonText: {
    fontSize: 20,
    color: PRIMARY,
  },

  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  headerSubtitle: {
    fontSize: 12,
    color: PRIMARY,
    marginTop: 2,
  },

  headerSpace: {
    width: 40,
  },

  inboxSwitchButton: {
    backgroundColor: PRIMARY_SOFT,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },

  inboxSwitchText: {
    fontSize: 12,
    fontWeight: "700",
    color: PRIMARY,
  },

  // Header Feedback Icon Button
  headerFeedbackButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PRIMARY_SOFT,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#C8E6C9",
    gap: 4,
  },

  headerFeedbackButtonActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },

  headerFeedbackIcon: {
    fontSize: 14,
  },

  headerFeedbackText: {
    fontSize: 12,
    fontWeight: "700",
    color: PRIMARY,
  },

  headerFeedbackTextActive: {
    color: "#FFFFFF",
  },

  headerFeedbackBadge: {
    backgroundColor: "#DC2626",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    marginLeft: 2,
  },

  headerFeedbackBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },

  // Segmented Tabs
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    gap: 8,
  },

  tabItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    gap: 6,
  },

  tabItemActive: {
    backgroundColor: PRIMARY,
  },

  tabItemText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },

  tabItemTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  tabBadge: {
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },

  tabBadgeActive: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },

  tabBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4B5563",
  },

  tabBadgeTextActive: {
    color: "#FFFFFF",
  },

  // Inbox List
  listContainer: {
    padding: 16,
  },

  inboxCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  avatarBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: PRIMARY_SOFT,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  avatarText: {
    fontSize: 22,
  },

  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  inboxContent: {
    flex: 1,
  },

  inboxHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  inboxName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  inboxTime: {
    fontSize: 12,
    color: "#6B7280",
  },

  inboxLastMsgRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  inboxLastMsg: {
    fontSize: 13,
    color: "#4B5563",
    flex: 1,
    marginRight: 10,
  },

  inboxOrderBadge: {
    backgroundColor: PRIMARY_SOFT,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  inboxOrderText: {
    fontSize: 10,
    color: PRIMARY,
    fontWeight: "700",
  },

  // Chat View
  chatList: {
    padding: 16,
    paddingBottom: 24,
  },

  bubble: {
    maxWidth: "80%",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },

  staffBubble: {
    alignSelf: "flex-end",
    backgroundColor: PRIMARY,
    borderBottomRightRadius: 4,
  },

  customerBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderBottomLeftRadius: 4,
  },

  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
  },

  staffBubbleText: {
    color: "#FFFFFF",
  },

  customerBubbleText: {
    color: "#111827",
  },

  timeText: {
    marginTop: 6,
    fontSize: 11,
    opacity: 0.7,
    alignSelf: "flex-end",
  },

  timeTextStaff: {
    color: "#FFFFFF",
  },

  timeTextCustomer: {
    color: "#6B7280",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
    marginRight: 10,
  },

  sendButton: {
    height: 44,
    width: 44,
    borderRadius: 22,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },

  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
  },

  // Customer Feedback View
  feedbackContainer: {
    padding: 16,
    paddingBottom: 32,
  },

  feedbackSummaryCard: {
    backgroundColor: PRIMARY,
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  summaryLeft: {
    flex: 1,
  },

  summaryTotalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  summaryTotalCount: {
    fontSize: 13,
    color: "#C8E6C9",
    marginTop: 4,
    fontWeight: "500",
  },

  summaryRight: {
    alignItems: "flex-end",
  },

  summaryAvgRating: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  summaryStars: {
    fontSize: 14,
    color: "#FDE047",
    marginTop: 2,
  },

  filterScroll: {
    flexDirection: "row",
    marginBottom: 14,
    gap: 8,
  },

  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  filterChipActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },

  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },

  filterChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  feedbackCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },

  feedbackCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  feedbackAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: PRIMARY_SOFT,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  feedbackAvatarText: {
    fontSize: 16,
    fontWeight: "800",
    color: PRIMARY,
  },

  feedbackHeaderMeta: {
    flex: 1,
  },

  feedbackCustomerName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  feedbackTime: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
  },

  feedbackRatingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },

  feedbackRatingStars: {
    color: "#F59E0B",
    fontSize: 13,
  },

  feedbackRatingNum: {
    fontSize: 12,
    fontWeight: "800",
    color: "#B45309",
  },

  feedbackCategoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  feedbackCategoryPill: {
    backgroundColor: PRIMARY_SOFT,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  feedbackCategoryText: {
    fontSize: 11,
    fontWeight: "600",
    color: PRIMARY,
  },

  feedbackMessageText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 21,
  },

  replyCustomerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PRIMARY_SOFT,
    marginTop: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },

  replyCustomerText: {
    fontSize: 12,
    fontWeight: "700",
    color: PRIMARY,
  },

  emptyFeedbackBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 32,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 10,
  },

  emptyFeedbackIcon: {
    fontSize: 40,
    marginBottom: 10,
  },

  emptyFeedbackTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },

  emptyFeedbackText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 18,
  },

  // Bottom Navigation
  bottomNav: {
    height: 70,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 4,
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 64,
  },

  navIcon: {
    fontSize: 20,
    marginBottom: 2,
  },

  navLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
  },

  navLabelActive: {
    fontSize: 11,
    color: PRIMARY,
    fontWeight: "800",
  },
});
