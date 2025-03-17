import { ThemedText } from "@/components/ThemedText";
import { Link, router } from "expo-router";
import AuthForm from "@/components/Auth/AuthForm";
import { useEffect, useState } from "react";
import { AuthScreenWrapper } from "@/components/Layouts/AuthScreenWrapper";
import { useAuth } from "@/Provider/authContext";

type SignUpFormTypes = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignUp() {
  const { signUp, isLoading, error } = useAuth();

  const validateUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return "Username must be 3-20 characters and contain only letters, numbers, and underscores";
    }
    return true;
  };

  const handleSubmit = async ({
    username,
    email,
    password,
    confirmPassword,
  }: SignUpFormTypes) => {
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    const usernameValidation = validateUsername(username);
    if (usernameValidation !== true) {
      console.error(usernameValidation);
      return;
    }

    const sanitizedEmail = email.trim().toLowerCase();
    await signUp(username, sanitizedEmail, password);
  };

  return (
    <AuthScreenWrapper title="Sign Up" subtitle="Register Now :)">
      <AuthForm
        type="signup"
        onSubmit={(credentials) => handleSubmit(credentials as SignUpFormTypes)}
        error={error || ""}
        isLoading={isLoading}
      />
      <Link href="/(auth)" className="mt-7 font-comic">
        <ThemedText className="text-center">
          Already have an account? &nbsp;
          <ThemedText type="link">Sign In</ThemedText>
        </ThemedText>
      </Link>
    </AuthScreenWrapper>
  );
}
