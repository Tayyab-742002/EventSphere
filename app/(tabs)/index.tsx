import { StyleSheet, Platform, View, TextInput } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/ui/Button";
import { useAuth } from "@/Provider/authContext";
import { OTPInput } from "@/components/ui/OtpInput";

export default function HomeScreen() {
  const { signOut, isLoading, error } = useAuth();
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <SafeAreaView className="flex-1 ">
      <ThemedView lightColor="transparent" darkColor="transparent">
        <ThemedText className="bg-transparent">
          Home Screen Goes Here
        </ThemedText>
        <Button onPress={handleSignOut} loading={isLoading}>
          Sign Out
        </Button>
        {/* <OTPInput /> */}
      </ThemedView>
    </SafeAreaView>
  );
}
