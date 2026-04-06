/**
 * Usage Examples for Reusable Message Components
 *
 * This file demonstrates how to use the reusable components created for the messages page
 * in other parts of your application.
 */

import React, { useState } from 'react';
import { View, FlatList, Alert } from 'react-native';
import {
  SearchBar,
  FilterBar,
  CustomHeader,
  EmptyState,
  MessageItem,
  SwipeActions,
} from '@/components';
import type { MessageData, SwipeAction } from '@/components';

// Example 1: Using SearchBar component
export function SearchExample() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SearchBar
      value={searchQuery}
      onChangeText={setSearchQuery}
      placeholder="Search notifications..."
      containerStyle={{ paddingHorizontal: 8 }}
    />
  );
}

// Example 2: Using FilterBar component
export function FilterExample() {
  const [activeFilter, setActiveFilter] = useState('all');

  const notificationFilters = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'important', label: 'Important' },
    { key: 'today', label: 'Today' },
  ];

  return (
    <FilterBar
      options={notificationFilters}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
    />
  );
}

// Example 3: Using CustomHeader component
export function HeaderExample() {
  const handleBackPress = () => {
    console.log('Back pressed');
  };

  const handleSettingsPress = () => {
    console.log('Settings pressed');
  };

  return (
    <CustomHeader
      title="Notifications"
      leftAction={{
        icon: 'arrow-back',
        onPress: handleBackPress,
        color: '#007AFF',
      }}
      rightAction={{
        icon: 'settings-outline',
        onPress: handleSettingsPress,
        color: '#007AFF',
      }}
    />
  );
}

// Example 4: Using EmptyState component
export function EmptyStateExample() {
  return (
    <EmptyState
      icon="notifications-outline"
      title="No Notifications"
      description="You're all caught up! New notifications will appear here."
      iconSize={80}
    />
  );
}

// Example 5: Using MessageItem component for different data types
export function NotificationListExample() {
  const [notifications, setNotifications] = useState<MessageData[]>([
    {
      id: '1',
      name: 'System Notification',
      message: 'Your booking has been confirmed',
      time: '2 min ago',
      isRead: false,
      avatar: 'SN',
      status: 'received',
    },
    {
      id: '2',
      name: 'Booking Update',
      message: 'Flight schedule changed',
      time: '1 hour ago',
      isRead: true,
      avatar: 'BU',
      status: 'read',
    },
  ]);

  const handleNotificationPress = (id: string) => {
    setNotifications(prev => prev.map(item => (item.id === id ? { ...item, isRead: true } : item)));
  };

  const handleArchive = (id: string) => {
    Alert.alert('Archived', 'Notification has been archived');
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
  };

  const getNotificationColor = (avatar: string) => {
    const colors = {
      SN: '#4CAF50', // System - Green
      BU: '#FF9800', // Booking Update - Orange
      default: '#2196F3',
    };
    return colors[avatar as keyof typeof colors] || colors.default;
  };

  const renderNotificationItem = ({ item }: { item: MessageData }) => {
    const swipeActions: SwipeAction[] = [
      {
        icon: 'archive-outline',
        onPress: () => handleArchive(item.id),
        color: '#FF9800',
      },
      {
        icon: 'trash-outline',
        onPress: () => handleDelete(item.id),
        confirmTitle: 'Delete Notification',
        confirmMessage: 'Are you sure you want to delete this notification?',
        confirmButtonText: 'Delete',
        isDestructive: true,
      },
    ];

    return (
      <MessageItem
        item={item}
        onPress={() => handleNotificationPress(item.id)}
        swipeActions={swipeActions}
        getAvatarColor={getNotificationColor}
      />
    );
  };

  return (
    <FlatList
      data={notifications}
      renderItem={renderNotificationItem}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
    />
  );
}

// Example 6: Using SwipeActions component independently
export function StandaloneSwipeExample() {
  const actions: SwipeAction[] = [
    {
      icon: 'heart-outline',
      onPress: () => console.log('Liked'),
      color: '#FF3B30',
    },
    {
      icon: 'share-outline',
      onPress: () => console.log('Shared'),
      color: '#007AFF',
    },
  ];

  // Note: SwipeActions is typically used within MessageItem or similar swipeable containers
  // This is just to show the actions configuration
  console.log('Swipe actions configured:', actions);
  return <View />;
}

// Example 7: Complete page using all components together
export function CompletePageExample() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [data, setData] = useState<MessageData[]>([]);

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
  ];

  const filteredData = data.filter(item => {
    // Apply filter logic
    if (activeFilter === 'unread' && item.isRead) return false;
    // Apply search logic
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader
        title="My Page"
        rightAction={{
          icon: 'add-outline',
          onPress: () => console.log('Add pressed'),
          color: '#007AFF',
        }}
      />

      <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search items..." />

      <FilterBar
        options={filterOptions}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          renderItem={({ item }) => (
            <MessageItem
              item={item}
              onPress={() => console.log('Item pressed:', item.id)}
              swipeActions={[
                {
                  icon: 'trash-outline',
                  onPress: () => setData(prev => prev.filter(i => i.id !== item.id)),
                  isDestructive: true,
                },
              ]}
            />
          )}
          keyExtractor={item => item.id}
        />
      ) : (
        <EmptyState
          icon="folder-open-outline"
          title="No Items Found"
          description={searchQuery ? 'No items match your search' : 'Add some items to get started'}
        />
      )}
    </View>
  );
}
