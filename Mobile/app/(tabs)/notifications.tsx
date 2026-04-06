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
  Modal,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IOSScreenWrapper } from '@/components/IOSScreenWrapper';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

// Import reusable components and utilities
import { CustomHeader, MessageItem, useCollapsibleSearchSection } from '@/components';
import { OrderSheet } from '@/components/OrderSheet';
import type { ItineraryData } from '@/components/ItineraryItem';
import type { SwipeAction } from '@/components';
import { generateInitialNotifications } from '@/utils/notificationData';
import type { NotificationData } from '@/utils/notificationData';
import { messageAnimations } from '@/utils/messageAnimations';
import {
  getNotificationAvatarColor,
  categorizeNotifications,
  filterNotificationsBySearch,
} from '@/utils/notificationUtils';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationData[]>(
    generateInitialNotifications()
  );
  const [activeOrderSheet, setActiveOrderSheet] = useState<{ order: ItineraryData; instanceId: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const sheetInstanceRef = useRef(0);
  const [sheetInstanceId, setSheetInstanceId] = useState<number | undefined>(undefined);

  // Helper function to replace all isDark references
  const isDarkMode = () => colorScheme === 'dark';

  // Animation value for list transitions (cross-fade between lists)
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Define filter options
  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
  ];

  // Track open swipeables to allow auto-close when another is opened
  const swipeableRefs = useRef<Map<string, Swipeable>>(new Map());

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

  // Simulate refresh - just refresh existing data (no new notifications unless from real server)
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
    }, 1000); // Shorter delay since we're not actually doing anything
  };
  // Pre-classify notifications into categories for instant filtering
  const categorizedNotifications = useMemo(() => {
    return categorizeNotifications(notifications);
  }, [notifications]); // Only recalculate when notifications change

  // Get notifications for current filter and search
  const filteredNotifications = useMemo(() => {
    // Get the pre-filtered category
    const categoryNotifications =
      categorizedNotifications[activeFilter as keyof typeof categorizedNotifications] || [];

    // Apply search if needed
    return filterNotificationsBySearch(categoryNotifications, searchQuery);
  }, [categorizedNotifications, searchQuery, activeFilter]);

  const markAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(item => {
        if (item.id === id) {
          return { ...item, isRead: true };
        }
        return item;
      })
    );
  };

  const openNotification = (notification: NotificationData) => {
    markAsRead(notification.id);
    const order: ItineraryData = {
      id: notification.id,
      name: notification.name,
      message: notification.message,
      type: 'order',
      date: '',
      time: '',
      location: `Order #${notification.id}`,
      isRead: true,
      unreadCount: 0,
      avatar: getNotificationAvatarColor(notification.type),
      status: 'received',
      notes: 'Status: Read',
      category: 'default',
    };

    sheetInstanceRef.current += 1;
    const instanceId = sheetInstanceRef.current;
    setSheetInstanceId(instanceId);
    setActiveOrderSheet({ order, instanceId });
  };

  // Using OrderSheet's internal status pill logic; no local statusConfig/details needed

  const reportNotification = (id: string) => {
    const swipeable = swipeableRefs.current.get(id);
    if (swipeable) {
      swipeable.close();
    }

    Alert.alert(
      'Thank You',
      "Your report has been submitted. We'll review this notification shortly.",
      [{ text: 'OK' }]
    );
  };

  const deleteNotification = (id: string) => {
    LayoutAnimation.configureNext(messageAnimations.deletion);
    setNotifications(prevNotifications => prevNotifications.filter(item => item.id !== id));
  };

  const clearAllNotifications = () => {
    Alert.alert(
      'Delete All Notifications',
      'Are you sure you want to delete all notifications? This action cannot be undone.',
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
            setNotifications([]);
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

  const renderItem = ({ item }: { item: NotificationData }) => {
    const swipeActions: SwipeAction[] = [
      {
        icon: 'flag',
        onPress: () => reportNotification(item.id),
        confirmTitle: 'Report Notification',
        confirmMessage: 'Are you sure you want to report this notification?',
        confirmButtonText: 'Report',
        isDestructive: true,
      },
      {
        icon: 'trash-outline',
        onPress: () => deleteNotification(item.id),
        confirmTitle: 'Delete Notification',
        confirmMessage:
          'Are you sure you want to delete this notification? This action cannot be undone.',
        confirmButtonText: 'Delete',
        isDestructive: true,
      },
    ];

    return (
      <MessageItem
        item={item}
        onPress={() => openNotification(item)}
        // Long press disabled per request
        swipeActions={swipeActions}
        swipeableRef={ref => {
          if (ref) swipeableRefs.current.set(item.id, ref);
          else swipeableRefs.current.delete(item.id);
        }}
        onSwipeStart={handleSwipeStart}
        onSwipeOpen={() => closeOtherSwipeables(item.id)}
        getAvatarColor={getNotificationAvatarColor}
        style={[
          styles.notificationCard,
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
              onPress: clearAllNotifications,
              color: '#FF3B30',
            }}
          />

          {/* Title under logo, left-aligned */}
          <View style={styles.titleSection}>
            <ThemedText type="title1" style={styles.pageTitle}>
              Notifications
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
            {filteredNotifications.length > 0 ? (
              <Animated.View style={{ flex: 1, opacity: fadeAnim, paddingBottom: 0 }}>
                <FlatList
                  data={filteredNotifications}
                  renderItem={renderItem}
                  keyExtractor={item => item.id}
                  contentContainerStyle={[
                    styles.listContent,
                    { paddingHorizontal: 0, paddingBottom: 100 },
                  ]}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false} // Disable FlatList scroll since ScrollView handles it
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  windowSize={10}
                  removeClippedSubviews={true}
                  getItemLayout={(data, index) => ({ length: 78, offset: 78 * index, index })}
                  extraData={activeFilter}
                  onScrollBeginDrag={() => closeAllSwipeables()}
                />
              </Animated.View>
            ) : (
              <Animated.View
                style={[
                  styles.emptyContainer,
                  {
                    opacity: fadeAnim,
                    position: 'relative',
                    height: '70%',
                  },
                ]}
              >
                {searchQuery.length > 0 ? (
                  <>
                    <Ionicons
                      name="search-outline"
                      size={60}
                      color={isDarkMode() ? '#555' : '#ccc'}
                    />
                    <ThemedText type="headline" style={styles.emptyText}>
                      No matching notifications
                    </ThemedText>
                    <ThemedText type="caption" style={styles.emptySubText}>
                      No notifications match your search term “{searchQuery}”
                    </ThemedText>
                  </>
                ) : activeFilter === 'unread' ? (
                  <>
                    <Ionicons
                      name="notifications-off-outline"
                      size={60}
                      color={isDarkMode() ? '#555' : '#ccc'}
                    />
                    <ThemedText type="headline" style={styles.emptyText}>
                      No unread notifications
                    </ThemedText>
                    <ThemedText type="caption" style={styles.emptySubText}>
                      All your notifications have been read
                    </ThemedText>
                  </>
                ) : (
                  <>
                    <Ionicons
                      name="notifications-off-outline"
                      size={60}
                      color={isDarkMode() ? '#555' : '#ccc'}
                    />
                    <ThemedText type="headline" style={styles.emptyText}>
                      No notifications
                    </ThemedText>
                    <ThemedText type="caption" style={styles.emptySubText}>
                      You don’t have any notifications at the moment
                    </ThemedText>
                  </>
                )}
              </Animated.View>
            )}
          </ScrollView>

          {/* Wrap with Modal to match booking sheet presentation/position */}
          <Modal
            visible={!!activeOrderSheet}
            transparent
            animationType="fade"
            presentationStyle="overFullScreen"
            statusBarTranslucent
            onRequestClose={() => setActiveOrderSheet(null)}
          >
            {activeOrderSheet ? (
              <OrderSheet
                key={activeOrderSheet.instanceId}
                order={activeOrderSheet.order}
                onClose={() => setActiveOrderSheet(null)}
                instanceId={activeOrderSheet.instanceId}
                title=""
                showStatus={false}
                showActions={false}
                summaryContentMode="message"
              />
            ) : null}
          </Modal>
        </ThemedView>
      </IOSScreenWrapper>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0, // Remove bottom padding to let FlatList handle it
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
    paddingBottom: 32, // Increased bottom padding for better scrolling
  },
  notificationCard: {
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
