import { AuthScreenWrapper } from "@/components/Layouts/AuthScreenWrapper";
import { useAuth } from "@/Provider/authContext";
import AuthForm from "@/components/Auth/AuthForm";

export default function UpdatePassword() {
  const { updatePassword, isLoading, error } = useAuth();

  const handleSubmit = async ({ password }: { password: string }) => {
    await updatePassword(password);
  };

  return (
    <AuthScreenWrapper
      title="Set New Password"
      subtitle="Enter your new password below"
    >
      <AuthForm
        type="updatePassword"
        onSubmit={handleSubmit}
        error={error || ""}
        isLoading={isLoading}
      />
    </AuthScreenWrapper>
  );
}

