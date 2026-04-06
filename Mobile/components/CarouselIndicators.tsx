import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Platform, Animated } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

export type CarouselIndicatorVariant = 'overlay' | 'surface';

export interface CarouselIndicatorsProps {
  count: number;
  activeIndex: number;
  /**
   * Overlay is optimized for placement on top of imagery, surface for cards or plain backgrounds.
   */
  variant?: CarouselIndicatorVariant;
  /**
   * Optional wrapper style. The wrapper keeps indicators centered horizontally.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Allows forcing a reinitialization when the datasource identity changes (e.g., different card id).
   */
  keyPrefix?: string | number;
  /**
   * Override the pill background colour.
   */
  backgroundColor?: string;
  /**
   * Override the indicator (dot) colour.
   */
  dotColor?: string;
}

const DOT_HEIGHT = 8;
const DOT_INACTIVE_WIDTH = 8;
const DOT_ACTIVE_WIDTH = 22;
const DOT_BORDER_RADIUS = DOT_HEIGHT / 2;

const springConfig = {
  tension: 180,
  friction: 18,
  useNativeDriver: false,
};

export function CarouselIndicators({
  count,
  activeIndex,
  variant = 'overlay',
  style,
  keyPrefix,
  backgroundColor,
  dotColor,
}: CarouselIndicatorsProps) {
  const colorScheme = useColorScheme();
  const indicatorValuesRef = useRef<Animated.Value[]>([]);
  const identityRef = useRef<string>('');
  const identity = `${keyPrefix ?? 'carousel'}-${count}`;

  if (identityRef.current !== identity || indicatorValuesRef.current.length !== count) {
    const values: Animated.Value[] = [];
    for (let i = 0; i < count; i++) {
      values.push(new Animated.Value(i === activeIndex ? 1 : 0));
    }
    indicatorValuesRef.current = values;
    identityRef.current = identity;
  }

  useEffect(() => {
    indicatorValuesRef.current.forEach((animation, index) => {
      Animated.spring(animation, {
        ...springConfig,
        toValue: index === activeIndex ? 1 : 0,
      }).start();
    });
  }, [activeIndex, identity, count]);

  const resolvedBackgroundColor =
    backgroundColor ??
    (variant === 'overlay'
      ? 'rgba(0,0,0,0.45)'
      : colorScheme === 'dark'
        ? 'rgba(255,255,255,0.16)'
        : 'rgba(0,0,0,0.08)');

  const resolvedDotColor =
    dotColor ??
    (variant === 'overlay' ? '#FFFFFF' : colorScheme === 'dark' ? '#FFFFFF' : '#1C1C1E');

  if (count <= 1) {
    return null;
  }

  return (
    <View style={[styles.wrapper, style]} pointerEvents="none">
      <View style={[styles.pill, { backgroundColor: resolvedBackgroundColor }]}>
        {indicatorValuesRef.current.map((animatedValue, index) => {
          const width = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [DOT_INACTIVE_WIDTH, DOT_ACTIVE_WIDTH],
          });
          const opacity = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.6, 1],
          });

          return (
            <Animated.View
              key={`${identity}-dot-${index}`}
              style={[
                styles.dot,
                {
                  width,
                  opacity,
                  backgroundColor: resolvedDotColor,
                  shadowOpacity: variant === 'overlay' ? 0.45 : 0.15,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  dot: {
    height: DOT_HEIGHT,
    borderRadius: DOT_BORDER_RADIUS,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: Platform.select({ android: 5, default: 0 }),
  },
});
