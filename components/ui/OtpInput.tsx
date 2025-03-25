import React, { useEffect, useRef } from "react";
import { TextInput, View, Keyboard, Platform, Clipboard } from "react-native";
import { ThemedText } from "../ThemedText";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function OTPInput({
  length = 6,
  value = "",
  onChange,
  error,
}: OTPInputProps) {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const codes = value.split("");

  // Pre-fill the codes array with empty strings if needed
  while (codes.length < length) {
    codes.push("");
  }

  useEffect(() => {
    // Initialize refs array
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleChange = (text: string, index: number) => {
    const newValue = text.slice(-1); // Take only the last character
    const newCodes = [...codes];
    newCodes[index] = newValue;

    // Combine all codes and trigger onChange
    const combinedValue = newCodes.join("");
    onChange(combinedValue);

    // Auto-focus next input if value is entered
    if (newValue && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    const key = event.nativeEvent.key;

    if (key === "Backspace") {
      // If current input is empty and we're not at the first input,
      // clear previous input and focus it
      if (!codes[index] && index > 0) {
        const newCodes = [...codes];
        newCodes[index - 1] = "";
        onChange(newCodes.join(""));
        focusInput(index - 1);
      }
    }
  };

  const handlePaste = async () => {
    try {
      const text = await Clipboard.getString();
      const cleaned = text.trim().replace(/\D/g, "").slice(0, length);
      if (cleaned) {
        onChange(cleaned);
      }
    } catch (err) {
      console.log("Failed to paste text:", err);
    }
  };

  return (
    <View className="w-full">
      <View className="flex-row justify-between items-center mb-4">
        {codes.map((code, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            className={`
              h-14 w-14
              rounded-lg
              text-center
              text-2xl
              font-bold
              ${Platform.select({
                ios: "leading-[56px]", // Center text vertically on iOS
                android: "leading-[48px]", // Center text vertically on Android
              })}
              ${error ? "border-2 border-red-500" : "border border-gray-300"}
              ${code ? "bg-gray-100" : "bg-white"}
              dark:bg-gray-800
              dark:text-white
              dark:border-gray-600
            `}
            maxLength={index === 0 ? length : 1}
            keyboardType="number-pad"
            selectTextOnFocus
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            value={code}
            autoComplete="one-time-code"
            textContentType={Platform.OS === "ios" ? "oneTimeCode" : "none"}
          />
        ))}
      </View>
      {error && (
        <ThemedText className="text-red-500 text-sm text-center mt-2">
          {error}
        </ThemedText>
      )}
    </View>
  );
}
