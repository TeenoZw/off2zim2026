import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
  StyleSheet,
  type LayoutChangeEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

type Props = {
  children: React.ReactNode;
  /** Optional override for the width used during the slide animation. */
  width?: number;
  /** Customize the entry animation duration (ms) when needed. */
  enterDuration?: number;
  /** Customize the exit animation duration (ms) when needed. */
  exitDuration?: number;
};

const DEFAULT_ENTER_DURATION = 280;
const DEFAULT_EXIT_DURATION = 220;

/**
 * Provides an iOS-style slide animation when running on the web, while
 * transparently returning the children untouched on native platforms where
 * the native stack animation already handles transitions.
 */
export function WebSlideTransition({
  children,
  width,
  enterDuration = DEFAULT_ENTER_DURATION,
  exitDuration = DEFAULT_EXIT_DURATION,
}: Props) {
  const navigation = useNavigation();

  // Move all hooks before early return
  const animatedWidth = useMemo(() => width ?? Dimensions.get('window').width, [width]);
  const translateX = useRef(new Animated.Value(animatedWidth)).current;
  const isAnimatingOut = useRef(false);

  const runEntryAnimation = useMemo(
    () => () => {
      translateX.setValue(animatedWidth);
      Animated.timing(translateX, {
        toValue: 0,
        duration: enterDuration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    },
    [animatedWidth, enterDuration, translateX]
  );

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    runEntryAnimation();

    const handleBeforeRemove = (e: any) => {
      if (isAnimatingOut.current) {
        return;
      }

      e.preventDefault();
      isAnimatingOut.current = true;

      Animated.timing(translateX, {
        toValue: animatedWidth,
        duration: exitDuration,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          navigation.dispatch(e.data.action);
        }
        isAnimatingOut.current = false;
      });
    };

    const unsubscribeRemove = navigation.addListener('beforeRemove', handleBeforeRemove);

    return () => {
      unsubscribeRemove();
    };
  }, [animatedWidth, exitDuration, navigation, runEntryAnimation, translateX]);

  // Early return for non-web platforms after all hooks
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  const onLayout = (event: LayoutChangeEvent) => {
    const newWidth = event.nativeEvent.layout.width || animatedWidth;
    if (!isAnimatingOut.current && newWidth !== animatedWidth) {
      translateX.setValue(newWidth);
      Animated.timing(translateX, {
        toValue: 0,
        duration: enterDuration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <Animated.View onLayout={onLayout} style={[styles.container, { transform: [{ translateX }] }]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
