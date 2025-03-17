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
interface AuthFormProps {
  type: "signin" | "signup";
  onSubmit: (credentials: AuthCredentialsType) => void;
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
  } = useForm<AuthCredentialsType>({
    mode: "onChange", // Change to onChange for better validation feedback
  });

  // Watch all form fields
  const formValues = watch();

  // Check if form is complete based on required fields
  const isFormComplete = useMemo(() => {
    if (type === "signin") {
      return Boolean(formValues.email && formValues.password);
    } else {
      return Boolean(
        formValues.username &&
          formValues.email &&
          formValues.password &&
          formValues.confirmPassword
      );
    }
  }, [formValues, type]);

  const onFormSubmit = async (data: AuthCredentialsType) => {
    if (!isFormComplete || isLoading) return;
    await onSubmit(data);
  };

  return (
    <ThemedView
      lightColor="transparent"
      darkColor="transparent"
      className="font-comic"
    >
      {/* First field for the username  */}
      {type === "signup" && (
        <Controller
          control={control}
          rules={{
            required: "Username is required",
          }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="username"
              autoCapitalize="none"
              label="Username"
              onBlur={onBlur}
              editable={!isLoading}
              error={error?.message}
            />
          )}
          name="username"
        />
      )}
      <Controller
        control={control}
        rules={{
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
        }}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="email"
            label="Email"
            onBlur={onBlur}
            editable={!isLoading}
            error={error?.message}
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
            const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?/~]/.test(value);

            if (!hasLowerCase || !hasUpperCase || !hasNumber || !hasSpecialChar) {
              return "Password must contain at least one lowercase letter, uppercase letter, number, and special character";
            }

            return true;
          }
        }}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="password"
            label="Password"
            onBlur={onBlur}
            secureTextEntry={true}
            error={error?.message}
            editable={!isLoading}
            textContentType="newPassword"
            autoComplete="off"
          />
        )}
        name="password"
      />
      {type === "signup" && (
        <Controller
          control={control}
          rules={{
            required: "Please confirm your password",
            validate: (value) =>
              value === watch("password") || "Passwords don't match",
          }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="confirm password"
              label="Confirm Password"
              onBlur={onBlur}
              editable={!isLoading}
              secureTextEntry={true}
              error={error?.message}
            />
          )}
          name="confirmPassword"
        />
      )}

      {/* Show API error if present */}
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
        onPress={handleSubmit(onFormSubmit)}
        loading={isLoading}
        disabled={!isFormComplete || isLoading}
      >
        {type === "signin" ? "Sign In" : "Sign Up"}
      </Button>
    </ThemedView>
  );
};

export default AuthForm;
