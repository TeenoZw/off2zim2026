import React from 'react';
import { View, Platform } from 'react-native';
import { APP_BG_LIGHT, APP_BG_DARK } from '@/constants/AppConstants';
import { useColorScheme } from '@/hooks/useColorScheme';

/**
 * Helper component to wrap screens on iOS to prevent shadow bleeding issues
 */
export function IOSScreenWrapper({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? APP_BG_DARK : APP_BG_LIGHT;

  if (Platform.OS !== 'ios') {
    // On Android, just render children directly
    return <View style={{ flex: 1, backgroundColor }}>{children}</View>;
  }

  // On iOS, use multiple nested views with solid backgrounds to ensure
  // the drawer shadow cannot bleed through
  return (
    <View
      style={{
        flex: 1,
        backgroundColor,
        // Clip absolutely everything
        overflow: 'hidden',
        borderWidth: 0,
        borderRadius: 0,
        // Block shadows completely
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
      }}
    >
      {/* Extra solid background barrier */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor,
          zIndex: 0,
        }}
      />

      {/* Content container with full opacity background */}
      <View
        style={{
          flex: 1,
          backgroundColor,
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        {children}
      </View>
    </View>
  );
}
