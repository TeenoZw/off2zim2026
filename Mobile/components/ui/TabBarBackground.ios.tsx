import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { StyleSheet } from 'react-native';

export default function GlassTabBarBackground() {
  if (isLiquidGlassAvailable()) {
    return (
      <GlassView
        glassEffectStyle="regular"
        colorScheme="auto"
        style={StyleSheet.absoluteFill}
      />
    );
  }

  return (
    <BlurView
      // Fallback for older iOS versions that don't support liquid glass.
      tint="systemChromeMaterial"
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
