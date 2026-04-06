import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function ScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationTypeForReplace: 'push',
        presentation: 'card',
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        fullScreenGestureEnabled: Platform.OS === 'ios',
      }}
    />
  );
}
