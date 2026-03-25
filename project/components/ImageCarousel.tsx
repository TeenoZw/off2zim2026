import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  Image, 
  Dimensions, 
  Animated, 
  ImageSourcePropType 
} from 'react-native';
import { theme } from '@/constants/theme';

const { width } = Dimensions.get('window');

interface CarouselItem {
  id: string;
  image: ImageSourcePropType | string;
  title?: string;
}

interface ImageCarouselProps {
  data: CarouselItem[];
  autoPlay?: boolean;
  duration?: number;
  height?: number;
}

export function ImageCarousel({
  data,
  autoPlay = true,
  duration = 5000,
  height = 240,
}: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoPlay && data.length > 1) {
      interval = setInterval(() => {
        const nextIndex = (activeIndex + 1) % data.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        setActiveIndex(nextIndex);
      }, duration);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeIndex, autoPlay, data.length, duration]);

  const renderItem = ({ item }: { item: CarouselItem }) => {
    const imageSource = typeof item.image === 'string' ? { uri: item.image } : item.image;
    
    return (
      <View style={[styles.slide, { width }]}>
        <Image 
          source={imageSource} 
          style={[styles.image, { height }]}
          resizeMode="cover"
        />
      </View>
    );
  };

  const renderDots = () => {
    return (
      <View style={styles.pagination}>
        {data.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
          
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: 'clamp',
          });
          
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });
          
          return (
            <Animated.View
              key={`dot-${index}`}
              style={[
                styles.dot,
                { width: dotWidth, opacity },
                activeIndex === index && styles.activeDot,
              ]}
            />
          );
        })}
      </View>
    );
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />
      {renderDots()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: theme.colors.primary,
  },
});