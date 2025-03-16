import React from "react";
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
  } = useForm<AuthCredentialsType>();

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
            required: true,
          }}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => {
            return (
              <>
                {error && (
                  <ThemedText className="text-red-600">
                    {error?.message}
                  </ThemedText>
                )}
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="username"
                  autoCapitalize="none"
                  label="Username"
                  onBlur={onBlur}
                  editable={!isLoading}
                />
              </>
            );
          }}
          name="username"
        />
      )}
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => {
          return (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="email"
              label="Email"
              onBlur={onBlur}
            />
          );
        }}
        name="email"
      />
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => {
          return (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="password"
              label="Password"
              onBlur={onBlur}
            />
          );
        }}
        name="password"
      />
      {type === "signup" && (
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => {
            return (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="confirm password"
                label="confirm password"
                onBlur={onBlur}
              />
            );
          }}
          name="confirmPassword"
        />
      )}
      <Button
        textStyle={{
          fontSize: 18,
          fontFamily: "Comic",
          fontWeight: "600",
        }}
        onPress={handleSubmit(onSubmit)}
      >
        {type === "signin" ? "Sign In" : "Sign Up"}
      </Button>
    </ThemedView>
  );
};

export default AuthForm;
