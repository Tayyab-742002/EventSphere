import React, { useMemo } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { ThemedView } from "../ThemedView";
import { View } from "react-native";
import { ThemedText } from "../ThemedText";
import TextInput from "../ui/TextInput";
import Button from "../ui/Button";

type AuthCredentialsType = {
  username?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};
type AuthFormType = "signin" | "signup" | "reset" | "otp" | "updatePassword";

interface AuthFormProps {
  type: AuthFormType;
  onSubmit: (credentials: any) => void;
  isLoading?: boolean;
  error: string;
}
const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onSubmit,
  isLoading,
  error,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: "onChange",
  });

  const renderFields = () => {
    switch (type) {
      case "reset":
        return (
          <Controller
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field, fieldState }) => (
              <TextInput
                value={field.value}
                onChangeText={field.onChange}
                placeholder="email"
                label="Email"
                onBlur={field.onBlur}
                editable={!isLoading}
                error={fieldState.error?.message}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            )}
            name="email"
          />
        );
      case "otp":
        return (
          <Controller
            control={control}
            rules={{
              required: "OTP is required",
              pattern: {
                value: /^[0-9]{6}$/, // Assuming 6-digit OTP
                message: "Please enter a valid 6-digit code"
              }
            }}
            render={({ field, fieldState }) => (
              <TextInput
                value={field.value}
                onChangeText={field.onChange}
                placeholder="Enter 6-digit code"
                label="Verification Code"
                onBlur={field.onBlur}
                editable={!isLoading}
                error={fieldState.error?.message}
                keyboardType="number-pad"
                maxLength={6}
                autoComplete="one-time-code"
              />
            )}
            name="otp"
          />
        );
      case "updatePassword":
        return (
          <>
            <Controller
              control={control}
              rules={{ required: "Password is required" }}
              render={({ field, fieldState }) => (
                <TextInput
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder="New password"
                  label="New Password"
                  onBlur={field.onBlur}
                  editable={!isLoading}
                  secureTextEntry
                  error={fieldState.error?.message}
                />
              )}
              name="password"
            />
            <Controller
              control={control}
              rules={{
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords don't match",
              }}
              render={({ field, fieldState }) => (
                <TextInput
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder="Confirm new password"
                  label="Confirm Password"
                  onBlur={field.onBlur}
                  editable={!isLoading}
                  secureTextEntry
                  error={fieldState.error?.message}
                />
              )}
              name="confirmPassword"
            />
          </>
        );
      case "signin":
        return (
          <>
            <Controller
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field, fieldState }) => (
                <TextInput
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder="email"
                  label="Email"
                  onBlur={field.onBlur}
                  editable={!isLoading}
                  error={fieldState.error?.message}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              )}
              name="email"
            />
            <Controller
              control={control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                validate: (value) => {
                  const hasLowerCase = /[a-z]/.test(value);
                  const hasUpperCase = /[A-Z]/.test(value);
                  const hasNumber = /[0-9]/.test(value);
                  const hasSpecialChar =
                    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?/~]/.test(value);

                  if (
                    !hasLowerCase ||
                    !hasUpperCase ||
                    !hasNumber ||
                    !hasSpecialChar
                  ) {
                    return "Password must contain at least one lowercase letter, uppercase letter, number, and special character";
                  }

                  return true;
                },
              }}
              render={({ field, fieldState }) => (
                <TextInput
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder="password"
                  label="Password"
                  onBlur={field.onBlur}
                  secureTextEntry={true}
                  error={fieldState.error?.message}
                  editable={!isLoading}
                  textContentType="newPassword"
                  autoComplete="off"
                />
              )}
              name="password"
            />
          </>
        );
      case "signup":
        return (
          <>
            <Controller
              control={control}
              rules={{
                required: "Username is required",
              }}
              render={({ field, fieldState }) => (
                <TextInput
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder="username"
                  label="Username"
                  onBlur={field.onBlur}
                  editable={!isLoading}
                  error={fieldState.error?.message}
                  autoCapitalize="none"
                />
              )}
              name="username"
            />
            <Controller
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field, fieldState }) => (
                <TextInput
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder="email"
                  label="Email"
                  onBlur={field.onBlur}
                  editable={!isLoading}
                  error={fieldState.error?.message}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              )}
              name="email"
            />
            <Controller
              control={control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                validate: (value) => {
                  const hasLowerCase = /[a-z]/.test(value);
                  const hasUpperCase = /[A-Z]/.test(value);
                  const hasNumber = /[0-9]/.test(value);
                  const hasSpecialChar =
                    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?/~]/.test(value);

                  if (
                    !hasLowerCase ||
                    !hasUpperCase ||
                    !hasNumber ||
                    !hasSpecialChar
                  ) {
                    return "Password must contain at least one lowercase letter, uppercase letter, number, and special character";
                  }

                  return true;
                },
              }}
              render={({ field, fieldState }) => (
                <TextInput
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder="password"
                  label="Password"
                  onBlur={field.onBlur}
                  secureTextEntry={true}
                  error={fieldState.error?.message}
                  editable={!isLoading}
                  textContentType="newPassword"
                  autoComplete="off"
                />
              )}
              name="password"
            />
            <Controller
              control={control}
              rules={{
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords don't match",
              }}
              render={({ field, fieldState }) => (
                <TextInput
                  value={field.value}
                  onChangeText={field.onChange}
                  placeholder="confirm password"
                  label="Confirm Password"
                  onBlur={field.onBlur}
                  editable={!isLoading}
                  secureTextEntry={true}
                  error={fieldState.error?.message}
                />
              )}
              name="confirmPassword"
            />
          </>
        );
    }
  };

  return (
    <ThemedView
      lightColor="transparent"
      darkColor="transparent"
      className="font-comic"
    >
      {renderFields()}
      {error && (
        <ThemedText className="text-red-600 mb-4 text-center">
          {error}
        </ThemedText>
      )}
      <Button
        textStyle={{
          fontSize: 18,
          fontFamily: "Comic",
          fontWeight: "600",
        }}
        onPress={handleSubmit(onSubmit)}
        loading={isLoading}
      >
        {type === "reset"
          ? "Send Code"
          : type === "otp"
          ? "Verify Code"
          : type === "updatePassword"
          ? "Update Password"
          : type === "signin"
          ? "Sign In"
          : "Sign Up"}
      </Button>
    </ThemedView>
  );
};

export default AuthForm;
