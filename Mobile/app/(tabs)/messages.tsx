import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Platform,
  Animated,
  LayoutAnimation,
  UIManager,
  Easing,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IOSScreenWrapper } from '@/components/IOSScreenWrapper';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';

// Import reusable components and utilities
import { CustomHeader, MessageItem, useCollapsibleSearchSection } from '@/components';
import type { MessageData, SwipeAction } from '@/components';
import { generateInitialMessages } from '@/utils/messageData';
import { messageAnimations } from '@/utils/messageAnimations';
import { getAvatarColor, categorizeMessages, filterMessagesBySearch } from '@/utils/messageUtils';

// Constants
const MESSAGE_ITEM_HEIGHT = 96;

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function MessagesScreen() {
  const [messages, setMessages] = useState<MessageData[]>(generateInitialMessages());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const params = useLocalSearchParams();

  // Helper function to replace all isDark references
  const isDarkMode = () => colorScheme === 'dark';

  // Animation value for list transitions (cross-fade between lists)
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Define filter options (using only 'all' and 'unread' for messages)
  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
  ];

  const swipeableRefs = useRef<Map<string, Swipeable>>(new Map());

  // Check for updated/new message when returning from message-detail
  useFocusEffect(
    useCallback(() => {
      if (params.returnMessage) {
        try {
          const updatedMessageData = JSON.parse(params.returnMessage as string);

          // Check if message already exists
          setMessages(prevMessages => {
            const existingIndex = prevMessages.findIndex(m => m.id === updatedMessageData.id);

            if (existingIndex >= 0) {
              // Update existing message (move to top and update content)
              const updatedMessages = [...prevMessages];
              updatedMessages[existingIndex] = {
                ...updatedMessages[existingIndex],
                ...updatedMessageData,
                time: updatedMessageData.time,
              };
              // Move to top
              const [updated] = updatedMessages.splice(existingIndex, 1);
              return [updated, ...updatedMessages];
            } else {
              // Add new message to top of list (only if there was actual conversation)
              if (updatedMessageData.message && updatedMessageData.message.trim() !== '') {
                return [updatedMessageData, ...prevMessages];
              }
              return prevMessages;
            }
          });

          // Clear the param to avoid re-adding on next focus
          router.setParams({ returnMessage: undefined });
        } catch (error) {
          console.error('Error parsing return message:', error);
        }
      }
    }, [params.returnMessage])
  );

  const handleFilterChange = useCallback((filter: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveFilter(filter);
  }, []);

  const { searchSection, handleScroll, handleMomentumScrollEnd } = useCollapsibleSearchSection({
    searchQuery,
    setSearchQuery,
    refreshing,
    filterOptions,
    activeFilter,
    onFilterChange: handleFilterChange,
    containerStyle: styles.searchFilterContainer,
    disableAutoReveal: true,
  });

  const closeAllSwipeables = useCallback(() => {
    swipeableRefs.current.forEach(ref => {
      if (ref) ref.close();
    });
  }, []);

  const closeOtherSwipeables = useCallback((itemId: string) => {
    swipeableRefs.current.forEach((ref, key) => {
      if (key !== itemId && ref) {
        ref.close();
      }
    });
  }, []);

  // Ensure the active filter is always at value 1 and inactive at 0
  useEffect(() => {
    // Close all swipeables when changing tab
    closeAllSwipeables();

    // Cross-fade lists with animated value
    fadeAnim.setValue(0.7);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
  }, [activeFilter, fadeAnim, closeAllSwipeables]);

  // Simulate refresh - just refresh existing data (no new messages unless from real server)
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request to check for updates
    setTimeout(() => {
      // In a real app, this would fetch from server
      // For now, just refresh the existing data without adding anything
      setRefreshing(false);
      // Add haptic feedback after refresh completes
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, 1500); // Slightly longer delay for more natural feel
  }; // Pre-classify messages into categories for instant filtering
  const categorizedMessages = useMemo(() => {
    return categorizeMessages(messages);
  }, [messages]); // Only recalculate when messages change

  // Get messages for current filter and search
  const filteredMessages = useMemo(() => {
    // Get the pre-filtered category
    const categoryMessages =
      categorizedMessages[activeFilter as keyof typeof categorizedMessages] || [];

    // Apply search if needed
    return filterMessagesBySearch(categoryMessages, searchQuery);
  }, [categorizedMessages, searchQuery, activeFilter]);

  const openMessage = (message: MessageData) => {
    // Mark as read when opening
    setMessages(prevMessages =>
      prevMessages.map(item => {
        if (item.id === message.id) {
          return { ...item, isRead: true, unreadCount: 0 };
        }
        return item;
      })
    );

    // Navigate to message detail page
    router.push({
      pathname: '/message-detail',
      params: {
        message: JSON.stringify(message),
      },
    });
  };

  const reportMessage = (id: string) => {
    const swipeable = swipeableRefs.current.get(id);
    if (swipeable) {
      swipeable.close();
    }

    Alert.alert(
      'Thank You',
      "Your report has been submitted. We'll review this conversation shortly.",
      [{ text: 'OK' }]
    );
  };

  const deleteMessage = (id: string) => {
    LayoutAnimation.configureNext(messageAnimations.deletion);
    setMessages(prevMessages => prevMessages.filter(item => item.id !== id));
  };

  const clearAllMessages = () => {
    Alert.alert(
      'Delete All Messages',
      'Are you sure you want to delete all messages? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: () => {
            if (Platform.OS === 'ios') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            }

            LayoutAnimation.configureNext(messageAnimations.batchOperation);
            setMessages([]);
          },
        },
      ]
    );
  };


  // Handle swipe with better haptic timing
  const handleSwipeStart = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const renderItem = ({ item }: { item: MessageData }) => {
    const swipeActions: SwipeAction[] = [
      {
        icon: 'flag',
        onPress: () => reportMessage(item.id),
        confirmTitle: 'Report Message',
        confirmMessage: 'Are you sure you want to report this message?',
        confirmButtonText: 'Report',
        isDestructive: true,
      },
      {
        icon: 'trash-outline',
        onPress: () => deleteMessage(item.id),
        confirmTitle: 'Delete Message',
        confirmMessage:
          'Are you sure you want to delete this message? This action cannot be undone.',
        confirmButtonText: 'Delete',
        isDestructive: true,
      },
    ];

    return (
      <MessageItem
        item={item}
        onPress={() => openMessage(item)}
        // Long press disabled per request
        swipeActions={swipeActions}
        swipeableRef={ref => {
          if (ref) swipeableRefs.current.set(item.id, ref);
          else swipeableRefs.current.delete(item.id);
        }}
        onSwipeStart={handleSwipeStart}
        onSwipeOpen={() => closeOtherSwipeables(item.id)}
        getAvatarColor={getAvatarColor}
        style={[
          styles.messageCard,
          {
            backgroundColor: isDarkMode() ? 'rgba(37, 37, 41, 0.9)' : '#FFFFFF',
          },
        ]}
      />
    );
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <IOSScreenWrapper>
        <ThemedView style={styles.container} lightColor="#f2f2f7" darkColor="#000000">
          <CustomHeader
            showLogo={true}
            rightAction={{
              icon: 'trash-outline',
              onPress: clearAllMessages,
              color: '#FF3B30',
            }}
          />

          {/* Title under logo, left-aligned */}
          <View style={styles.titleSection}>
            <ThemedText type="title1" style={styles.pageTitle}>
              Messages
            </ThemedText>
          </View>

          {searchSection}

          <ScrollView
            style={{ flex: 1 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            onMomentumScrollEnd={handleMomentumScrollEnd}
          >
            {/* Messages list */}
            {filteredMessages.length > 0 ? (
              <Animated.View style={{ opacity: fadeAnim }}>
                <FlatList
                  data={filteredMessages}
                  renderItem={renderItem}
                  keyExtractor={item => item.id}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false} // Disable FlatList scroll since ScrollView handles it
                  getItemLayout={(data, index) => ({
                    length: MESSAGE_ITEM_HEIGHT,
                    offset: MESSAGE_ITEM_HEIGHT * index,
                    index,
                  })}
                  onScrollBeginDrag={() => closeAllSwipeables()}
                />
              </Animated.View>
            ) : (
              <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
                {searchQuery.length > 0 ? (
                  <>
                    <Ionicons
                      name="search-outline"
                      size={60}
                      color={isDarkMode() ? '#555' : '#ccc'}
                    />
                    <ThemedText type="headline" style={styles.emptyText}>
                      No matching messages
                    </ThemedText>
                    <ThemedText type="caption" style={styles.emptySubText}>
                      No messages match your search term “{searchQuery}”
                    </ThemedText>
                  </>
                ) : activeFilter === 'unread' ? (
                  <>
                    <Ionicons
                      name="mail-open-outline"
                      size={60}
                      color={isDarkMode() ? '#555' : '#ccc'}
                    />
                    <ThemedText type="headline" style={styles.emptyText}>
                      No unread messages
                    </ThemedText>
                    <ThemedText type="caption" style={styles.emptySubText}>
                      All your messages have been read
                    </ThemedText>
                  </>
                ) : (
                  <>
                    <Ionicons
                      name="chatbubbles-outline"
                      size={60}
                      color={isDarkMode() ? '#555' : '#ccc'}
                    />
                    <ThemedText type="headline" style={styles.emptyText}>
                      No messages
                    </ThemedText>
                    <ThemedText type="caption" style={styles.emptySubText}>
                      You don’t have any messages at the moment
                    </ThemedText>
                  </>
                )}
              </Animated.View>
            )}
          </ScrollView>
        </ThemedView>
      </IOSScreenWrapper>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 16,
    paddingHorizontal: 0,
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 8,
  },
  searchFilterContainer: {
    paddingHorizontal: 0,
    paddingTop: 8,
    marginTop: 4,
    overflow: 'hidden',
  },
  pageTitle: {
    fontSize: 24,
    textAlign: 'left',
  },
  listContent: {
    paddingBottom: 100, // Increased padding for better visibility of last item
  },
  messageCard: {
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyText: {
    marginTop: 12,
  },
  emptySubText: {
    textAlign: 'center',
    marginTop: 6,
    color: '#8E8E93',
  },
});
