import { StatusBar } from "expo-status-bar";
import React, { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "../ThemedView";
interface ScreenWrapperProps {
  children: ReactNode;
  scrollable?: boolean;
  withSafeArea?: boolean;
  withKeyboardAvoidingView?: boolean;
  onRefresh?: () => Promise<void>;
  isRefreshing?: boolean;
  backgroundColor?: string;
  style?: any;
}

export function ScreenWrapper({
  children,
  scrollable = true,
  withSafeArea = true,
  withKeyboardAvoidingView = true,
  onRefresh,
  isRefreshing = false,
  backgroundColor,
  style,
}: ScreenWrapperProps) {
  const Container = withSafeArea ? SafeAreaView : View;
  const content = (
    <>
      <StatusBar style="auto" />
      {scrollable ? (
        <ScrollView
          style={[styles.scrollView, style]}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh ? (
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.container, style]}>{children}</View>
      )}
    </>
  );

  return (
    <ThemedView
      lightColor={backgroundColor || "#fff"}
      darkColor={backgroundColor || "#000"}
      style={styles.container}
    >
      {withKeyboardAvoidingView ? (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Container style={styles.container}>{content}</Container>
        </KeyboardAvoidingView>
      ) : (
        <Container style={styles.container}>{content}</Container>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});
