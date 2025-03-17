import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScreenWrapper } from './ScreenWrapper';

interface TabScreenWrapperProps {
  children: ReactNode;
  onRefresh?: () => Promise<void>;
  isRefreshing?: boolean;
}

export function TabScreenWrapper({
  children,
  onRefresh,
  isRefreshing,
}: TabScreenWrapperProps) {
  return (
    <ScreenWrapper
      scrollable
      onRefresh={onRefresh}
      isRefreshing={isRefreshing}
      style={styles.container}
    >
      {children}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
});