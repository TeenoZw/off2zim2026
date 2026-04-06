/**
 * Shared order data contracts and constants for the Orders screen.
 */

import type { MessageData } from '@/components';

// Define OrderData interface that extends MessageData for consistency
export interface OrderData extends MessageData {
  orderNumber: string;
  amount: string;
  category: string;
  confirmationCode: string;
  bookingDate: string;
  orderStatus: 'pending' | 'completed' | 'failed';
  // Extended booking details for OrderSheet
  type?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guestsCount?: number;
  adultsCount?: number;
  childrenCount?: number;
  roomsCount?: number;
  roomType?: string;
  roomTypeRate?: number;
  paymentMethod?: string;
  price?: number;
  currency?: string;
  notes?: string;
  providerLogo?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

// Filter options for orders
export const ORDER_FILTER_OPTIONS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
  { key: 'failed', label: 'Failed' },
] as const;
