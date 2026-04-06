import React, { useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { ThemedText } from '@/components/ThemedText';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SwipeActions, SwipeAction } from './SwipeActions';
import * as Haptics from 'expo-haptics';
import { FontSizes, LineHeights, Fonts } from '@/constants/Fonts';

export interface MessageData {
  id: string;
  name: string;
  message: string;
  time: string;
  isRead: boolean;
  unreadCount?: number;
  avatar: string;
  avatarImage?: string;
  status: 'sent' | 'delivered' | 'read' | 'received';
}

interface MessageItemProps {
  item: MessageData;
  onPress: () => void;
  onLongPress?: () => void;
  swipeActions?: SwipeAction[];
  swipeableRef?: (ref: Swipeable | null) => void;
  onSwipeStart?: () => void;
  onSwipeOpen?: () => void;
  getAvatarColor?: (avatar: string) => string;
  style?: any;
  hideTimeAndBadge?: boolean; // Hide time and unread badge (for itinerary items)
}

export function MessageItem({
  item,
  onPress,
  onLongPress,
  swipeActions = [],
  swipeableRef,
  onSwipeStart,
  onSwipeOpen,
  getAvatarColor,
  style,
}: MessageItemProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const defaultAvatarColor = (avatar: string) => {
    const colors = {
      VH: '#003366',
      TB: '#8B4513',
      SA: '#228B22',
      EH: '#CD853F',
      ZH: '#4682B4',
      default: '#25D366',
    };
    return colors[avatar as keyof typeof colors] || colors.default;
  };

  const avatarColorFunction = getAvatarColor || defaultAvatarColor;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Ionicons name="checkmark" size={16} color="#8E8E93" />;
      case 'delivered':
        return <Ionicons name="checkmark-done" size={16} color="#8E8E93" />;
      case 'read':
        return <Ionicons name="checkmark-done" size={16} color="#34B7F1" />;
      case 'received':
        return <Ionicons name="arrow-down" size={16} color="#FF9500" />;
      default:
        return null;
    }
  };

  const handleSwipeStart = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onSwipeStart?.();
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation<string | number>) => {
    if (swipeActions.length === 0) return null;
    return <SwipeActions actions={swipeActions} progress={progress} containerWidth={120} />;
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        opacity,
      }}
    >
      <Swipeable
        ref={swipeableRef}
        friction={1.2}
        rightThreshold={40}
        overshootRight={false}
        onSwipeableWillOpen={handleSwipeStart}
        onSwipeableOpen={onSwipeOpen}
        renderRightActions={renderRightActions}
        useNativeAnimations={true}
      >
        <TouchableOpacity
          style={[styles.messageItem, style]}
          onPress={onPress}
          onLongPress={onLongPress}
          delayLongPress={500}
        >
          <View
            style={[styles.avatarContainer, { backgroundColor: avatarColorFunction(item.avatar) }]}
          >
            <ThemedText type="bodyBold" style={styles.avatarText}>
              {item.avatar}
            </ThemedText>
          </View>

          <View style={styles.messageContentContainer}>
            <View style={styles.messageTopRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ThemedText type="title2" style={styles.messageName}>
                  {item.name}
                </ThemedText>
                {(item.name === 'Victoria Falls Hotel' ||
                  item.name === 'Shearwater Adventures') && (
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color="#007AFF"
                    style={{ marginLeft: 4 }}
                  />
                )}
              </View>
              <ThemedText type="caption" style={styles.messageTime}>
                {item.time}
              </ThemedText>
            </View>

            <View style={styles.messageBottomRow}>
              <View style={styles.messagePreviewContainer}>
                {item.status !== 'received' && (
                  <View style={styles.statusIconContainer}>{getStatusIcon(item.status)}</View>
                )}
                <ThemedText
                  type="body"
                  style={[
                    styles.messagePreview,
                    item.isRead ? styles.readPreview : styles.unreadPreview,
                  ]}
                  numberOfLines={1}
                >
                  {item.message}
                </ThemedText>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {!item.isRead && (
                  <View style={styles.unreadIndicator}>
                    <ThemedText type="label" style={styles.unreadCountText}>
                      {item.unreadCount || 1}
                    </ThemedText>
                  </View>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  messageItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 2,
  },
  avatarContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarText: {
    color: 'white',
  },
  messageContentContainer: {
    flex: 1,
    marginRight: 0,
  },
  messageTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messagePreviewContainer: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  statusIconContainer: {
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageName: {
    flexShrink: 1,
    fontSize: 20,
    lineHeight: 26,
  },
  messagePreview: {
    flex: 1,
    fontSize: FontSizes.lg,
    lineHeight: LineHeights.lg,
  },
  readPreview: {
    fontFamily: Fonts.regular,
    opacity: 0.65,
  },
  unreadPreview: {
    fontFamily: Fonts.medium,
    opacity: 0.9,
  },
  messageTime: {
    color: '#8E8E93',
    marginLeft: 4,
  },
  unreadIndicator: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.1,
    shadowRadius: 0.5,
    elevation: 1,
  },
  unreadCountText: {
    color: '#FFFFFF',
    fontSize: FontSizes.xs,
  },
});
