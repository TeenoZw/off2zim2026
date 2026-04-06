/**
 * Notification utility functions for the Notifications screen
 */

import type { NotificationData } from '@/utils/notificationData';

// Get unique color for each service provider
export const getNotificationAvatarColor = (providerId: string): string => {
  const colors: Record<string, string> = {
    EM: '#C8102E', // Emirates red
    HS: '#228B22', // Hwange Safari green (nature)
    VF: '#007AFF', // Victoria Falls blue (water)
    VH: '#8B4513', // Victoria Falls Hotel brown (luxury)
    IB: '#FF6B35', // Intercape Bus orange
    ZH: '#4682B4', // Zambezi Helicopter steel blue (sky)
    ZT: '#2E8B57', // Zimbabwe Tourism Authority green
    AZ: '#DC143C', // Air Zimbabwe red
    default: '#8E8E93',
  };
  return colors[providerId] || colors.default;
};

// Generate options text for long press
export const generateNotificationOptionsText = (providerName: string): string => {
  return `Options for ${providerName}:\n- Mark as read/unread\n- Archive notification\n- Delete notification\n- View details`;
};

// Helper function to categorize notifications
export const categorizeNotifications = (notifications: NotificationData[]) => {
  return {
    all: notifications,
    unread: notifications.filter(item => !item.isRead),
  };
};

// Helper function to filter notifications by search query
export const filterNotificationsBySearch = (
  notifications: NotificationData[],
  searchQuery: string
) => {
  if (!searchQuery.trim()) {
    return notifications;
  }

  const lowerQuery = searchQuery.toLowerCase();
  return notifications.filter(
    item =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.message.toLowerCase().includes(lowerQuery)
  );
};
