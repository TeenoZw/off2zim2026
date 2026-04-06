import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = (screenWidth - 80) / 2; // Match the actual destination card width

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

interface DestinationCardShimmerProps {
  count?: number;
}

export const DestinationCardShimmer: React.FC<DestinationCardShimmerProps> = ({ count = 4 }) => {
  const renderShimmerCard = (index: number) => (
    <View key={index} style={styles.shimmerCard}>
      {/* Image placeholder */}
      <ShimmerPlaceholder
        width={CARD_WIDTH}
        height={200}
        borderRadius={12}
        style={styles.shimmerImage}
      />

      {/* Content area - positioned at bottom like real cards */}
      <View style={styles.shimmerContent}>
        {/* Destination name */}
        <ShimmerPlaceholder
          width={CARD_WIDTH * 0.7}
          height={18}
          borderRadius={9}
          style={styles.shimmerTitle}
        />

        {/* Weather info */}
        <ShimmerPlaceholder
          width={CARD_WIDTH * 0.5}
          height={18}
          borderRadius={9}
          style={styles.shimmerWeather}
        />
      </View>

      {/* Heart icon placeholder */}
      <View style={styles.shimmerHeartContainer}>
        <ShimmerPlaceholder width={18} height={18} borderRadius={9} />
      </View>
    </View>
  );

  return (
    <View style={styles.shimmerContainer}>
      {Array.from({ length: count }, (_, index) => renderShimmerCard(index))}
    </View>
  );
};

const styles = StyleSheet.create({
  shimmerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  shimmerCard: {
    width: CARD_WIDTH,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shimmerImage: {
    marginBottom: 0, // No gap, overlay goes on top
  },
  shimmerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  shimmerTitle: {
    marginBottom: 2,
  },
  shimmerWeather: {
    marginBottom: 0,
  },
  shimmerHeartContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
