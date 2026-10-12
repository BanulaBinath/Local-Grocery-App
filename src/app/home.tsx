import { router } from "expo-router";
import Home from "../screens/Auth/Home";

export default function HomeRoute() {
  const handleLogin = () => {
    router.push("/login");
  };

  const handleRegister = () => {
    router.push("/register-choice");
  };

  const handleFeedback = () => {
    router.push("/feedback-view");
  };

  return (
    <Home
      onLogin={handleLogin}
      onRegister={handleRegister}
      onFeedback={handleFeedback}
    />
  );
}
