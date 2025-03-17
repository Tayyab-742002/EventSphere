import { ThemedText } from "@/components/ThemedText";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthForm from "@/components/Auth/AuthForm";
import { useEffect, useState } from "react";
import { Link } from "expo-router";
import { AuthScreenWrapper } from "@/components/Layouts/AuthScreenWrapper";
import { useAuth } from "@/Provider/authContext";

type SignInFormTypes = {
  email: string;
  password: string;
};
export default () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async ({ email, password }: SignInFormTypes) => {};
  return (
    <AuthScreenWrapper title="Sign In" subtitle="Welcom Back !">
      <AuthForm
        type="signin"
        onSubmit={handleSubmit}
        error={error || ""}
        isLoading={isLoading}
      />
      <Link href={"/(auth)/signup"} className="mt-7 font-comic">
        <ThemedText className="text-center">
          Don't have an account? &nbsp;
        </ThemedText>
        <ThemedText type="link">Sign Up</ThemedText>
      </Link>
    </AuthScreenWrapper>
  );
};
