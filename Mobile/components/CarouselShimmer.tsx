import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width: screenWidth } = Dimensions.get('window');

interface ShimmerPlaceholderProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  style?: any;
}

const ShimmerPlaceholder: React.FC<ShimmerPlaceholderProps> = ({
  width = 100,
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const colorScheme = useColorScheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerAnimation.start();

    return () => {
      shimmerAnimation.stop();
    };
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const backgroundColor = colorScheme === 'dark' ? '#333333' : '#E0E0E0';

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const CarouselShimmer: React.FC = () => {
  return (
    <View style={[styles.shimmerCarousel, { width: screenWidth }]}>
      <View style={styles.shimmerImageContainer}>
        {/* Main image placeholder */}
        <ShimmerPlaceholder
          width={screenWidth - 32}
          height={200}
          borderRadius={16}
          style={styles.shimmerImage}
        />

        {/* Location pill placeholder */}
        <View style={styles.shimmerTextContainer}>
          <View style={styles.shimmerLocationPill}>
            <ShimmerPlaceholder width={80} height={22} borderRadius={999} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shimmerCarousel: {
    height: 200, // Match carouselItem height
    position: 'relative',
    paddingHorizontal: 16,
  },
  shimmerImageContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    overflow: 'hidden',
  },
  shimmerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  shimmerTextContainer: {
    position: 'absolute',
    bottom: 12,
    left: 20,
    right: 20,
    alignItems: 'center',
    alignSelf: 'center',
    maxWidth: screenWidth - 40,
  },
  shimmerLocationPill: {
    alignSelf: 'flex-start',
    marginLeft: 6,
    marginTop: -2,
  },
});
