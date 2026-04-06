import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FAIcon } from './FontAwesomeIcon';

interface TabBarIconProps {
  name: string;
  focused: boolean;
  color: string;
  size?: number;
}

export function TabBarIcon({ name, focused, color, size = 24 }: TabBarIconProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.1 : 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [focused, scaleAnim]);

  // For all icons, use Ionicons with outline variants when not focused
  const iconName = focused ? name : `${name}-outline`;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Ionicons name={iconName as any} size={size} color={color} />
    </Animated.View>
  );
}
