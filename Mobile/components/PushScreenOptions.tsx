import { Stack } from 'expo-router';
import { Platform } from 'react-native';

interface PushScreenOptionsProps {
  headerShown?: boolean;
}

export function PushScreenOptions({ headerShown = false }: PushScreenOptionsProps) {
  return (
    <Stack.Screen
      options={{
        headerShown,
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
