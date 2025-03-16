import React, { Children } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextStyle,
  useColorScheme,
  View,
  ViewStyle,
} from "react-native";
import { ThemedText } from "../ThemedText";

type ButtonVarian = "filled" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  onPress?: () => void;
  variant?: ButtonVarian;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  lightColor?: string;
  darkColor?: string;
  Icon?: any;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  variant = "filled",
  size = "md",
  disabled = false,
  loading = false,
  children,
  style,
  textStyle,
  lightColor,
  darkColor,
  Icon = null,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  //Default sizes
  const sizeStyles: Record<
    ButtonSize,
    { height: number; fontSize: number; padding: number }
  > = {
    sm: { height: 36, fontSize: 14, padding: 12 },
    md: { height: 44, fontSize: 16, padding: 16 },
    lg: { height: 55, fontSize: 18, padding: 20 },
  };

  //function to style the button based on variants
  const getVariantStyle = () => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    };
    switch (variant) {
      case "filled":
        return {
          ...baseStyle,
          backgroundColor: isDark
            ? darkColor || "#FFFFFF"
            : lightColor || "#1f1f1f",
        };
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: isDark
            ? darkColor || "#FFFFFF"
            : lightColor || "#1f1f1f",
        };
      case "ghost":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
        };
    }
  };
  const getTextColor = () => {
    if (disabled) {
      return isDark ? "#000" : "#FFFFFF";
    }

    switch (variant) {
      case "filled":
        return isDark ? "#000" : "#FFFFFF";
      case "outline":
      case "ghost":
        return "#FFFFFF";
    }
  };
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        getVariantStyle(),
        {
          height: sizeStyles[size].height,
          paddingHorizontal: sizeStyles[size].padding,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {Icon && <Icon />}
          <ThemedText
            style={StyleSheet.flatten([
              {
                fontSize: sizeStyles[size].fontSize,
                color: getTextColor(),
                textAlign: "center",
                marginBottom: 0,
                fontWeight: "500",
                fontFamily: "Comic",
                flex: 1,
              },
              textStyle,
            ])}
          >
            {children}
          </ThemedText>
        </>
      )}
    </Pressable>
  );
};

export default Button;
