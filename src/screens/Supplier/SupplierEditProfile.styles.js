import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FF",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F6FF",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },

  header: {
    height: 65,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  backButtonText: {
    fontSize: 25,
    color: "#1E3A8A",
    fontWeight: "600",
  },

  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginLeft: 15,
  },

  headerSpace: {
    width: 42,
  },

  scrollView: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 40,
  },

  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 15,
  },

  profileIconText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },

  pageDescription: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 25,
  },

  form: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 7,
    marginTop: 5,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#FFFFFF",
    marginBottom: 14,
  },

  addressInput: {
    height: 90,
    paddingTop: 13,
  },

  saveButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  disabledButton: {
    opacity: 0.6,
  },

  cancelButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },

  imageContainer: {
    width: 110,
    height: 110,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
    position: "relative",
  },

  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#E5E7EB",
  },

  profileIcon: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
  },

  profileIconText: {
    fontSize: 42,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  cameraButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  cameraIcon: {
    fontSize: 18,
  },

  changePhotoText: {
    textAlign: "center",
    color: "#1E3A8A",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 18,
  },
});
