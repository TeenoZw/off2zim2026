import React, { memo } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getLogoSource } from '@/utils/imageCache';

interface LogoProps {
  size?: 'small' | 'medium' | 'large' | 'hero';
  style?: any;
}

export const Logo: React.FC<LogoProps> = memo(
  ({ size = 'medium', style }) => {
    const colorScheme = useColorScheme();

    const sizeStyles = {
      small: { height: 28, width: 84 }, // Width = 3x height
      medium: { height: 40, width: 120 }, // Width = 3x height
      large: { height: 52, width: 156 }, // Width = 3x height, slightly larger for header
      hero: { height: 68, width: 204 }, // Featured size for hero/auth headers
    } as const;

    const isDark = colorScheme === 'dark';
    const logoSource = getLogoSource(isDark);

    return (
      <View style={[styles.container, style]}>
        <Image
          source={logoSource}
          style={[
            styles.logo,
            {
              height: sizeStyles[size].height,
              width: sizeStyles[size].width,
            },
          ]}
          resizeMode="contain"
          fadeDuration={0} // Disable default fade
        />
      </View>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if size or style props actually change
    return (
      prevProps.size === nextProps.size &&
      JSON.stringify(prevProps.style) === JSON.stringify(nextProps.style)
    );
  }
);

Logo.displayName = 'Logo';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    // Width will be automatically calculated based on aspect ratio
    // Height is controlled by the size prop
  },
});
