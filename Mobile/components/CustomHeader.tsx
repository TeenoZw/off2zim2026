import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Logo } from '@/components/Logo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fonts } from '@/constants/Fonts';

interface HeaderAction {
  icon: string;
  onPress: () => void;
  color?: string;
}

interface CustomHeaderProps {
  title?: string;
  showLogo?: boolean;
  logoSize?: 'small' | 'medium' | 'large';
  leftAction?: HeaderAction;
  rightAction?: HeaderAction;
  style?: any;
  titleStyle?: any;
  expandedTitle?: boolean; // New prop to increase header size for title display
}

export function CustomHeader({
  title,
  showLogo = false,
  logoSize = 'large',
  leftAction,
  rightAction,
  style,
  titleStyle,
  expandedTitle = false,
}: CustomHeaderProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const notchHeight = insets.top;
  const topPadding = Platform.OS === 'ios' ? (notchHeight > 20 ? 0 : 4) : 8;

  // Increase header height when expandedTitle is true and title is shown
  const baseHeaderHeight = Platform.OS === 'ios' ? (insets.top > 20 ? 44 : 42) : 56;
  const headerHeight =
    expandedTitle && title && !showLogo ? baseHeaderHeight + 20 : baseHeaderHeight;

  const handleActionPress = (action: HeaderAction) => {
    action.onPress();
  };

  const renderActionButton = (action: HeaderAction, isLeft: boolean) => (
    <TouchableOpacity
      style={[
        styles.actionButton,
        {
          alignItems: isLeft ? 'flex-start' : 'flex-end',
          marginTop: Platform.OS === 'ios' ? -6 : 0,
        },
      ]}
      onPress={() => handleActionPress(action)}
    >
      <View
        style={[
          styles.headerIconCircle,
          {
            backgroundColor: isDarkMode ? '#402221' : '#F3E0E3',
          },
        ]}
      >
        {action.icon === 'chevron-back' ? (
          <FontAwesome6 name="chevron-left" size={20} color={action.color || '#FF3B30'} />
        ) : action.icon === 'chevron-forward' ? (
          <FontAwesome6 name="chevron-right" size={20} color={action.color || '#FF3B30'} />
        ) : (
          <Ionicons name={action.icon as any} size={20} color={action.color || '#FF3B30'} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.headerContainer,
        {
          paddingTop: insets.top + topPadding,
          paddingBottom: 0,
          height: headerHeight + insets.top,
          borderBottomWidth: 0,
          marginBottom: 15,
          backgroundColor: 'transparent',
        },
        style,
      ]}
    >
      {leftAction ? (
        renderActionButton(leftAction, true)
      ) : (
        <View style={styles.actionButton}>
          <View style={{ width: 36, height: 36 }} />
        </View>
      )}

      <View
        style={[
          styles.titleContainer,
          Platform.OS === 'ios' ? { marginTop: insets.top > 20 ? -6 : -3 } : { marginTop: 0 },
        ]}
      >
        {showLogo ? (
          <Logo size={logoSize} />
        ) : (
          <ThemedText type="title" style={[styles.title, titleStyle]}>
            {title}
          </ThemedText>
        )}
      </View>

      {rightAction ? (
        renderActionButton(rightAction, false)
      ) : (
        <View style={styles.actionButton}>
          <View style={{ width: 36, height: 36 }} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    zIndex: 1000,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
      },
    }),
  },
  actionButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    zIndex: 2,
    paddingBottom: 0,
  },
  headerIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    height: 44,
  },
  title: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    marginTop: 0,
  },
});
