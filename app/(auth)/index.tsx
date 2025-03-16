import { ThemedText } from "@/components/ThemedText";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthForm from "@/components/Auth/AuthForm";
import { useState } from "react";
type SignInFormTypes = {
  email: string;
  password: string;
};
export default () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = ({
    email,
    password,
  }: SignInFormTypes) => {
    console.log("Email : ", email);
    console.log("Password : ", password);
  };
  return (
    <SafeAreaView className="flex-1">
      <View className="flex h-full">
        {/* <TextInput placeholder="Enter Your mail" label="Email" />
        <Button>Press me</Button> */}
        <AuthForm
          type="signin"
          onSubmit={handleSubmit}
          error={"test"}
          isLoading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};
