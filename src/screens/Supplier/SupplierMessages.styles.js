import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  // ========================================
  // HEADER
  // ========================================

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    backgroundColor: "#F5F7FB",
  },

  headerContent: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },

  headerSubtitle: {
    marginTop: 5,
    fontSize: 13,
    color: "#6B7280",
  },

  // ========================================
  // CHAT HEADER
  // ========================================

  chatHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  backButtonText: {
    fontSize: 25,
    color: "#111827",
    marginTop: -2,
  },

  // ========================================
  // PROFILE
  // ========================================

  profileButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  profileIcon: {
    fontSize: 21,
  },

  // ========================================
  // CENTER / LOADING
  // ========================================

  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },

  // ========================================
  // STAFF LIST
  // ========================================

  staffList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  supplierCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  supplierAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E8EEFF",
    alignItems: "center",
    justifyContent: "center",
  },

  supplierAvatarText: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1E3A8A",
  },

  supplierInfo: {
    flex: 1,
    marginLeft: 13,
  },

  supplierName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },

  onlineText: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B7280",
  },

  arrow: {
    fontSize: 27,
    color: "#9CA3AF",
    marginLeft: 8,
  },

  // ========================================
  // EMPTY STAFF
  // ========================================

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingTop: 80,
  },

  emptyIcon: {
    fontSize: 55,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },

  emptyText: {
    maxWidth: 310,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    color: "#6B7280",
  },

  // ========================================
  // CHAT MESSAGES
  // ========================================

  messageList: {
    flex: 1,
  },

  messageContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 15,
    flexGrow: 1,
  },

  messageRow: {
    width: "100%",
    marginBottom: 10,
    flexDirection: "row",
  },

  sentRow: {
    justifyContent: "flex-end",
  },

  receivedRow: {
    justifyContent: "flex-start",
  },

  messageBubble: {
    maxWidth: "78%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },

  sentBubble: {
    backgroundColor: "#1E3A8A",
    borderBottomRightRadius: 4,
  },

  receivedBubble: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },

  sentText: {
    color: "#FFFFFF",
  },

  receivedText: {
    color: "#111827",
  },

  messageTime: {
    marginTop: 5,
    fontSize: 10,
  },

  sentTime: {
    color: "#DDE6FF",
    textAlign: "right",
  },

  receivedTime: {
    color: "#9CA3AF",
    textAlign: "right",
  },

  // ========================================
  // EMPTY CHAT
  // ========================================

  emptyChatContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  emptyChatIcon: {
    fontSize: 50,
    marginBottom: 14,
  },

  emptyChatTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 7,
  },

  emptyChatText: {
    maxWidth: 300,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 20,
    color: "#6B7280",
  },

  // ========================================
  // MESSAGE INPUT
  // ========================================

  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: "#F5F7FB",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 11,
    paddingBottom: 11,
    fontSize: 14,
    color: "#111827",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginLeft: 8,
    backgroundColor: "#1E3A8A",
    alignItems: "center",
    justifyContent: "center",
  },

  sendButtonDisabled: {
    opacity: 0.6,
  },

  sendButtonText: {
    fontSize: 20,
    color: "#FFFFFF",
    marginLeft: 2,
  },

  // ========================================
  // BOTTOM NAVIGATION
  // ========================================

  bottomNav: {
    height: 78,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 5,
    elevation: 12,
  },

  navItem: {
    flex: 1,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
  },

  navIcon: {
    fontSize: 22,
    marginBottom: 5,
  },

  navLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6B7280",
  },

  navLabelActive: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1E3A8A",
  },
});

export default styles;
