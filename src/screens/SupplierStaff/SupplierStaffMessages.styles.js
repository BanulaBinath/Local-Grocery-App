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
    paddingBottom: 16,
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
    marginTop: -2,
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

  supplierCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },

  supplierAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
  },

  supplierAvatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  supplierInfo: {
    marginLeft: 12,
  },

  supplierName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  onlineText: {
    fontSize: 12,
    color: "#16A34A",
    marginTop: 4,
  },

  messageList: {
    flex: 1,
  },

  messageContent: {
    paddingVertical: 10,
    paddingBottom: 20,
  },

  messageRow: {
    width: "100%",
    marginBottom: 12,
  },

  receivedRow: {
    alignItems: "flex-start",
  },

  sentRow: {
    alignItems: "flex-end",
  },

  messageBubble: {
    maxWidth: "78%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },

  receivedBubble: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderBottomLeftRadius: 4,
  },

  sentBubble: {
    backgroundColor: "#1E3A8A",
    borderBottomRightRadius: 4,
  },

  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },

  receivedText: {
    color: "#111827",
  },

  sentText: {
    color: "#FFFFFF",
  },

  messageTime: {
    fontSize: 10,
    marginTop: 5,
  },

  receivedTime: {
    color: "#9CA3AF",
  },

  sentTime: {
    color: "#DCE6FF",
    textAlign: "right",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 8,
    marginBottom: 12,
  },

  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
  },

  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
  },

  sendButtonText: {
    fontSize: 20,
    color: "#FFFFFF",
  },
});

export default styles;
