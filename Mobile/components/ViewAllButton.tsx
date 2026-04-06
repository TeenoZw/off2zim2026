import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from './ThemedText';

export type ViewAllButtonProps = Omit<TouchableOpacityProps, 'style'> & {
  label?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<TextStyle>;
  iconName?: React.ComponentProps<typeof FontAwesome6>['name'];
  iconColor?: string;
  iconSize?: number;
  textType?: React.ComponentProps<typeof ThemedText>['type'];
  hideIcon?: boolean;
};

export function ViewAllButton({
  label = 'View All',
  onPress,
  style,
  textStyle,
  iconStyle,
  iconName = 'chevron-right',
  iconColor,
  iconSize = 14,
  textType = 'label',
  hideIcon = false,
  disabled,
  ...touchableProps
}: ViewAllButtonProps) {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#402221' : '#F3E0E3';
  const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
  const resolvedIconColor = iconColor ?? '#FF3B30';

  return (
    <TouchableOpacity
      {...touchableProps}
      onPress={onPress}
      disabled={disabled}
      style={[styles.container, { backgroundColor, opacity: disabled ? 0.5 : 1 }, style]}
      activeOpacity={touchableProps.activeOpacity ?? 0.85}
    >
      <ThemedText type={textType} style={[styles.text, { color: textColor }, textStyle]}>
        {label}
      </ThemedText>
      {!hideIcon && iconName ? (
        <FontAwesome6
          name={iconName}
          size={iconSize}
          color={resolvedIconColor}
          style={[styles.icon, iconStyle]}
        />
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  text: {
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  icon: {
    marginLeft: 6,
  },
});
