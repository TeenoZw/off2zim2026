import React from 'react';
import { Text } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

interface TabLabelProps {
  focused: boolean;
  label: string;
  isDark?: boolean;
}

export default function TabLabel({ focused, label, isDark }: TabLabelProps) {
  const colorScheme = useColorScheme();
  const resolvedIsDark = isDark ?? colorScheme === 'dark';
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <Text
      style={{
        fontFamily: focused ? Fonts.bold : Fonts.regular, // More pronounced contrast between selected and unselected
        fontSize: focused ? 16 : 14, // Increase font size for selected tab
        color: focused ? (resolvedIsDark ? theme.white : theme.tint) : theme.inactive,
      }}
    >
      {label}
    </Text>
  );
}
