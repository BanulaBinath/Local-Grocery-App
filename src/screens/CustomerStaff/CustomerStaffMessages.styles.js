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
