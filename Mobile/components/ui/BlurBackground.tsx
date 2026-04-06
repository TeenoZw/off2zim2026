import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, View } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

/**
 * A component that provides a blur background that matches the system's appearance.
 * Falls back to semi-transparent background on Android.
 */
export function BlurBackground({ intensity = 100 }: { intensity?: number }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (Platform.OS === 'ios') {
    return (
      <BlurView tint="systemChromeMaterial" intensity={intensity} style={StyleSheet.absoluteFill} />
    );
  } else {
    // Android fallback - semi-transparent background
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.75)' : '#F0F0F0',
          },
        ]}
      />
    );
  }
}

/**
 * Background component specifically for headers
 */
export function HeaderBackground() {
  // Use same gray shades as drawer background
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (Platform.OS === 'ios') {
    if (isDark) {
      // Use dark gray in dark mode
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: '#262626', // Dark gray to match drawer
            },
          ]}
        />
      );
    } else {
      // Use light gray in light mode
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: '#EEEEEE', // Light gray to match drawer
            },
          ]}
        />
      );
    }
  } else {
    // Android fallback
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: isDark ? '#262626' : '#EEEEEE', // Same gray shades as drawer
          },
        ]}
      />
    );
  }
}

/**
 * Background component specifically for tab bars
 */
export function TabBarBackground() {
  // Use same gray shades as drawer background
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (Platform.OS === 'ios') {
    if (isDark) {
      // Use dark gray in dark mode
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: '#262626', // Dark gray to match drawer
            },
          ]}
        />
      );
    } else {
      // Use light gray in light mode
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: '#EEEEEE', // Light gray to match drawer
            },
          ]}
        />
      );
    }
  } else {
    // Android fallback
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: isDark ? '#262626' : '#EEEEEE', // Same gray shades as drawer
          },
        ]}
      />
    );
  }
}
