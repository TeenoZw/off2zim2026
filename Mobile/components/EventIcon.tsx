import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

interface RenderEventIconProps {
  iconName: string;
  size: number;
  color: string;
  style?: any;
}

export const renderEventIcon = ({ iconName, size, color, style }: RenderEventIconProps) => {
  // FontAwesome6 icons
  if (
    [
      'sailboat',
      'plane',
      'helicopter',
      'bed',
      'utensils',
      'calendar-days',
      'chevron-left',
      'chevron-right',
      'xmark',
      'magnifying-glass',
      'bus',
    ].includes(iconName)
  ) {
    return <FontAwesome6 name={iconName as any} size={size} color={color} style={style} />;
  }

  // FontAwesome icons
  if (iconName === 'binoculars') {
    return <FontAwesome name="binoculars" size={size} color={color} style={style} />;
  }

  // Ionicons for everything else
  return <Ionicons name={iconName as any} size={size} color={color} style={style} />;
};
