import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { ScreenWrapper } from "./ScreenWrapper";
import { ThemedText } from "../ThemedText";

interface AuthScreenWrapperProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthScreenWrapper({
  children,
  title,
  subtitle,
}: AuthScreenWrapperProps) {
  return (
    <ScreenWrapper scrollable withKeyboardAvoidingView>
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText className="font-comic text-center !text-5xl mb-4">
            {title}
          </ThemedText>
          {subtitle && (
            <ThemedText className="font-comic text-center !text-3xl !text-purple-700 dark:!text-purple-700">
              {subtitle}
            </ThemedText>
          )}
        </View>
        {children}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginVertical: 32,
  },
});
