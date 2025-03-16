import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TextStyle,
  useColorScheme,
  ViewStyle,
} from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

type InputVariant = "default" | "filled" | "outlined" | "ghost";
type InputSize = "sm" | "md" | "lg";

interface TextInputProps extends Omit<RNTextInputProps, "style"> {
  label?: string;
  error?: string;
  variant?: InputVariant;
  size?: InputSize;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  disabled?: boolean;
  lightColor?: string;
  darkColor?: string;
}
const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  variant = "default",
  size = "md",
  containerStyle,
  inputStyle,
  disabled = false,
  lightColor,
  darkColor,
  ...props
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const sizeStyles: Record<
    InputSize,
    { height?: number; fontSize: number; padding: number }
  > = {
    sm: { fontSize: 16, padding: 8 },
    md: { height: 50, fontSize: 16, padding: 14 },
    lg: { height: 55, fontSize: 32, padding: 16 },
  };
  //Select style based on variants
  const getVariantStyle = () => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      backgroundColor: isDark
        ? darkColor || "transparent"
        : lightColor || "transparent",
    };
    switch (variant) {
      case "filled":
        return {
          ...baseStyle,
          backgroundColor: isDark
            ? darkColor && "transparent"
            : lightColor && "transparent",
        };
      case "outlined":
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: isDark ? darkColor || "#FFFFFF" : lightColor || "#000",
        };
      case "ghost":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
        };
      default:
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: isDark ? darkColor || "#FFFFFF" : lightColor || "#000",
        };
    }
  };

  const getTextColor = () => {
    if (disabled) {
      return isDark ? "#FFFFFF" : "#000";
    }
    return isDark ? "#FFFFFF" : "#000"; // option to change colors for disabled button
  };
  return (
    <ThemedView
      lightColor="transparent"
      darkColor="transparent"
      className="bg-transparent mb-6 "
      style={containerStyle}
    >
      {label && <ThemedText className="mb-4 font-comic">{label}</ThemedText>}
      <ThemedView
        lightColor="transparent"
        darkColor="transparent"
        style={[getVariantStyle(), disabled && { opacity: 0.5 }]}
      >
        <RNTextInput
          style={[
            {
              height: sizeStyles[size].height,
              fontSize: sizeStyles[size].fontSize,
              fontFamily: "Comic",
              padding: sizeStyles[size].padding,
              color: getTextColor(),
            },
            inputStyle,
          ]}
          placeholderTextColor={isDark ? "#ccc" : "#333"}
          editable={!disabled}
          {...props}
        />
      </ThemedView>
      {error && (
        <ThemedText className="text-[#ef4444] mt-4">{error}</ThemedText>
      )}
    </ThemedView>
  );
};

export default TextInput;
