import { View, type ViewProps, Platform } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return (
    <View
      style={[
        {
          backgroundColor,
          ...(Platform.OS === 'ios'
            ? {
                // iOS-specific styles to block drawer shadows
                overflow: 'hidden',
                borderWidth: 0,
                borderRadius: 0,
                shadowOpacity: 0,
                shadowRadius: 0,
                elevation: 0,
              }
            : {}),
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
