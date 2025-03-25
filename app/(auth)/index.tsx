import { ThemedText } from "@/components/ThemedText";

import AuthForm from "@/components/Auth/AuthForm";

import { Link } from "expo-router";
import { AuthScreenWrapper } from "@/components/Layouts/AuthScreenWrapper";
import { useAuth } from "@/Provider/authContext";

type SignInFormTypes = {
  email: string;
  password: string;
};
export default () => {
  const { signIn, isLoading, error } = useAuth();

  const handleSubmit = async ({ email, password }: SignInFormTypes) => {
    try {
      await signIn(email, password);
    } catch (error) {
      throw error;
    }
  };
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
      <Link href={"/(auth)/resetPassword"} className="mt-7 font-comic">
        <ThemedText className="text-center !text-sm !text-gray-400">Forgot Password ?</ThemedText>
      </Link>
    </AuthScreenWrapper>
  );
};
