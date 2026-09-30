import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./Home.styles";

export default function Home({ onLogin, onRegister }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.appName}>Local Grocery</Text>

          <Text style={styles.tagline}>Fresh • Local • Convenient</Text>
        </View>

        {/* Welcome Content */}
        <View style={styles.content}>
          <Text style={styles.title}>
            Fresh Groceries,{"\n"}
            Easy Pickup.
          </Text>

          <Text style={styles.description}>
            Pre-order your groceries from local shops and pick them up at a
            convenient time.
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={onLogin}
            activeOpacity={0.85}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={onRegister}
            activeOpacity={0.85}
          >
            <Text style={styles.registerButtonText}>Create Account</Text>
          </TouchableOpacity>

          {/* Feedback */}
          <TouchableOpacity style={styles.feedbackButton} activeOpacity={0.7}>
            <Text style={styles.feedbackIcon}>💬</Text>
            <Text style={styles.feedbackText}>Feedback</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          Shop local. Order easily. Pick up quickly.
        </Text>
      </View>
    </SafeAreaView>
  );
}
