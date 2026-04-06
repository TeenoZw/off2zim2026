/**
 * Order utility functions for the Orders screen
 */

import type { OrderData } from '@/utils/orderData';

// Get unique color for each vendor
export const getOrderAvatarColor = (providerId: string): string => {
  const colors: Record<string, string> = {
    VF: '#8B4513', // Victoria Falls Craft Market brown
    ZA: '#228B22', // Zimbabwe Art Gallery green
    HS: '#CD853F', // Hwange Safari Store tan
    LA: '#4682B4', // Local Artisan Collective steel blue
    ZT: '#DC143C', // Zambezi Trading Post red
    HC: '#9932CC', // Heritage Craft Shop purple
    default: '#8E8E93',
  };
  return colors[providerId] || colors.default;
};

// Generate options text for long press
export const generateOrderOptionsText = (vendorName: string): string => {
  return `Options for ${vendorName}:\n- View order details\n- Track shipment\n- Contact vendor\n- Leave review\n- Download invoice`;
};

// Helper function to categorize orders
export const categorizeOrders = (orders: OrderData[]) => {
  return {
    all: orders,
    pending: orders.filter(item => item.orderStatus === 'pending'),
    completed: orders.filter(item => item.orderStatus === 'completed'),
    failed: orders.filter(item => item.orderStatus === 'failed'),
  };
};

// Helper function to filter orders by search query
export const filterOrdersBySearch = (orders: OrderData[], searchQuery: string) => {
  if (!searchQuery.trim()) {
    return orders;
  }

  const lowerQuery = searchQuery.toLowerCase();
  return orders.filter(
    item =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.message.toLowerCase().includes(lowerQuery) ||
      item.orderNumber.toLowerCase().includes(lowerQuery) ||
      item.amount.toLowerCase().includes(lowerQuery)
  );
};
