import { router } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

export default function SplashScreen() {
  const player = useVideoPlayer(
    require("../../../assets/videos/intro.mp4"),
    (player) => {
      player.loop = false;
      player.play();
    },
  );

  useEffect(() => {
    const subscription = player.addListener("playToEnd", () => {
      router.replace("/home");
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  video: {
    width: "100%",
    height: "100%",
  },
});
