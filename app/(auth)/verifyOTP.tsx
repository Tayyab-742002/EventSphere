import { useLocalSearchParams } from "expo-router";
import { AuthScreenWrapper } from "@/components/Layouts/AuthScreenWrapper";
import { useAuth } from "@/Provider/authContext";
import AuthForm from "@/components/Auth/AuthForm";
import { ThemedText } from "@/components/ThemedText";
import { View } from "react-native";

export default function VerifyOTP() {
  const { email } = useLocalSearchParams();
  const { verifyOTP, isLoading, error } = useAuth();

  const handleSubmit = async ({ otp }: { otp: string }) => {
    await verifyOTP(email as string, otp);
  };

  return (
    <AuthScreenWrapper
      title="Verify OTP"
      subtitle="Enter the code sent to your email"
    >
      <View style={{ marginBottom: 20 }}>
        <ThemedText className="text-center !text-sm">
          We've sent a verification code to {email}
        </ThemedText>
      </View>
      <AuthForm
        type="otp"
        onSubmit={handleSubmit}
        error={error || ""}
        isLoading={isLoading}
      />
    </AuthScreenWrapper>
  );
}

