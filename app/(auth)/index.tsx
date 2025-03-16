import { ThemedText } from "@/components/ThemedText";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default () => {
  return (
    <SafeAreaView className="flex-1">
      <View>
        <ThemedText>This is Sign Up Page</ThemedText>
      </View>
    </SafeAreaView>
  );
};
