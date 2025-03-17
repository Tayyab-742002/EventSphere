import { Image, StyleSheet, Platform, View } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/ui/Button";

export default function HomeScreen() {
  const handleSignOut = async () => {
  };
  return (
    <SafeAreaView className="flex-1 ">
      <ThemedView lightColor="transparent" darkColor="transparent">
        <ThemedText className="bg-transparent">
          Home Screen Goes Here
        </ThemedText>
        <Button onPress={handleSignOut}>Sign Out</Button>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
