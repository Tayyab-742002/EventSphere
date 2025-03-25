import AuthForm from "@/components/Auth/AuthForm";
import { AuthScreenWrapper } from "@/components/Layouts/AuthScreenWrapper";
import { useAuth } from "@/Provider/authContext";

export default function ResetPassword() {
  const { resetPassword, isLoading, error } = useAuth();

  const handleSubmit = async ({ email }: { email: string }) => {
    await resetPassword(email);
  };

  return (
    <AuthScreenWrapper
      title="Reset Password"
      subtitle="Enter your email to receive a reset link"
    >
      <AuthForm
        type="reset"
        onSubmit={handleSubmit}
        error={error || ""}
        isLoading={isLoading}
      />
    </AuthScreenWrapper>
  );
}
