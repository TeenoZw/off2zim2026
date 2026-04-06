// Utility functions for itinerary operations
import { ItineraryData } from '@/components';

// Date formatting utilities
export const formatDate = (date: string): string => {
  const dateObj = new Date(date);
  const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString('en-US', { month: 'long' });
  const year = dateObj.getFullYear();
  return `${weekday} ${day} ${month} ${year}`;
};

export const formatTime = (time?: string): string => {
  if (!time || !time.trim()) return '';
  const parts = time.trim().split(':');
  if (parts.length < 2) return '';

  const [hours, minutes] = parts;
  const hour = parseInt(hours);
  const minute = parseInt(minutes);

  if (isNaN(hour) || isNaN(minute)) return '';

  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  const displayMinute = String(minute).padStart(2, '0');
  return `${displayHour}:${displayMinute} ${ampm}`;
};

export const normalizeItineraryTime = (time?: string | null): string | undefined => {
  if (!time) return undefined;

  const trimmed = time.trim();
  if (!trimmed) return undefined;

  const amPmMatch = trimmed.match(/^([0-9]{1,2}):([0-9]{2})\s*(AM|PM)$/i);
  if (amPmMatch) {
    let hours = parseInt(amPmMatch[1], 10);
    const minutes = parseInt(amPmMatch[2], 10);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
      return undefined;
    }

    const suffix = amPmMatch[3].toUpperCase();
    if (suffix === 'PM' && hours < 12) {
      hours += 12;
    }
    if (suffix === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  const twentyFourHourMatch = trimmed.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (twentyFourHourMatch) {
    const hours = parseInt(twentyFourHourMatch[1], 10);
    const minutes = parseInt(twentyFourHourMatch[2], 10);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
      return undefined;
    }

    const normalizedHours = Math.max(0, Math.min(23, hours));
    const normalizedMinutes = Math.max(0, Math.min(59, minutes));

    return `${String(normalizedHours).padStart(2, '0')}:${String(normalizedMinutes).padStart(2, '0')}`;
  }

  return undefined;
};

export const getTodayString = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// Icon and color utilities
export const TYPE_ICONS = {
  transport: 'plane',
  accommodation: 'bed',
  activity: 'sailboat',
  dining: 'utensils',
  default: 'calendar-days',
} as const;

export const TYPE_COLORS = {
  transport: '#007AFF',
  accommodation: '#FF6B6B',
  activity: '#34C759',
  dining: '#FF9500',
  default: '#8E8E93',
} as const;

export const getTypeIcon = (type: string): string => {
  return TYPE_ICONS[type as keyof typeof TYPE_ICONS] || TYPE_ICONS.default;
};

export const getTypeColor = (type: string): string => {
  return TYPE_COLORS[type as keyof typeof TYPE_COLORS] || TYPE_COLORS.default;
};

export const getSpecificTypeIcon = (item: ItineraryData): string => {
  // Always use type-specific icon for accommodations
  if (item.type === 'accommodation') {
    return 'bed';
  }

  const name = item.name.toLowerCase();

  // Specific activity mappings using FontAwesome6 icons
  if (name.includes('flight of angels') || name.includes('helicopter')) {
    return 'helicopter';
  }
  if (name.includes('flight') || name.includes('emirates')) {
    return 'plane';
  }
  if (name.includes('bus') || name.includes('coach') || name.includes('intercape')) {
    return 'bus';
  }
  if (name.includes('rafting') || name.includes('cruise') || name.includes('boat')) {
    return 'sailboat';
  }
  if (name.includes('safari') || name.includes('game drive') || name.includes('tour')) {
    return 'binoculars';
  }

  return getTypeIcon(item.type);
};

// Accommodation logic utilities
export const isAccommodationAllDay = (
  event: ItineraryData,
  dateString: string,
  itinerary?: ItineraryData[]
): boolean => {
  if (event.type !== 'accommodation') return false;

  // Check-in day: show at specific time
  if (
    event.date === dateString &&
    event.actualTime &&
    !event.message.toLowerCase().includes('check-out')
  ) {
    return false;
  }

  // Check-out day: show at specific time
  if (
    event.date === dateString &&
    event.actualTime &&
    event.message.toLowerCase().includes('check-out')
  ) {
    return false;
  }

  // For accommodation spans (middle days of stay), it's all-day
  if (event.duration === 'Check-in' && itinerary) {
    const checkOutEntry = itinerary.find(
      checkOut =>
        checkOut.type === 'accommodation' &&
        checkOut.duration === 'Check-out' &&
        checkOut.name === event.name
    );
    if (checkOutEntry) {
      const startDate = new Date(event.date);
      const endDate = new Date(checkOutEntry.date);
      const checkDate = new Date(dateString);
      return checkDate > startDate && checkDate < endDate;
    }
  }

  // Alternative check for expanded itinerary items
  if (event.duration === 'All day' || (!event.actualTime && event.message.includes('All day'))) {
    return true;
  }

  return false;
};

// Sorting utilities
export const sortEventsByTime = (
  events: ItineraryData[],
  dateString: string,
  itinerary?: ItineraryData[]
): ItineraryData[] => {
  return events.sort((a, b) => {
    // Helper function to determine if accommodation should be treated as all-day
    const isAllDay = (event: ItineraryData) => {
      if (event.type !== 'accommodation') return false;
      // Check-in/out days show at specific times
      if (event.date === dateString && event.actualTime) return false;
      // Middle days of stays are all-day
      return event.duration === 'All day' || event.actualTime === '';
    };

    const aIsAllDay = isAllDay(a);
    const bIsAllDay = isAllDay(b);

    // All-day events first
    if (aIsAllDay && !bIsAllDay) return -1;
    if (bIsAllDay && !aIsAllDay) return 1;

    // Among all-day events, accommodations first
    if (aIsAllDay && bIsAllDay) {
      if (a.type === 'accommodation' && b.type !== 'accommodation') return -1;
      if (b.type === 'accommodation' && a.type !== 'accommodation') return 1;
      return 0;
    }

    // Time-based events by actual time
    return (a.actualTime || '').localeCompare(b.actualTime || '');
  });
};

// Itinerary expansion utilities
export const expandAccommodationStays = (itinerary: ItineraryData[]): ItineraryData[] => {
  const expanded: ItineraryData[] = [];

  itinerary.forEach(item => {
    if (item.type === 'accommodation' && item.duration === 'Check-in') {
      // Check if this item has an endDate field (from database bookings)
      if (item.endDate) {
        const startDate = new Date(item.date);
        const endDate = new Date(item.endDate);
        const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

        // Add check-in day with specific time
        expanded.push(item);

        // Add middle days as all-day stays
        for (let i = 1; i < nights; i++) {
          const stayDate = new Date(startDate);
          stayDate.setDate(startDate.getDate() + i);
          const stayDateString = `${stayDate.getFullYear()}-${String(stayDate.getMonth() + 1).padStart(2, '0')}-${String(stayDate.getDate()).padStart(2, '0')}`;

          expanded.push({
            ...item,
            id: `${item.id}_stay_${i}`,
            name: item.name,
            date: stayDateString,
            message: 'Staying at hotel - All day',
            time: `${stayDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - All day`,
            actualTime: '', // No specific time for all-day stays
            duration: 'All day',
          });
        }

        // Add check-out day entry
        const checkOutDateString = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
        const normalizedCheckOutTime = normalizeItineraryTime(item.checkOutTime);
        const fallbackCheckOutTime = normalizedCheckOutTime ?? '11:00';
        const checkOutDisplayTime = formatTime(fallbackCheckOutTime) || '11:00 AM';

        expanded.push({
          ...item,
          id: `${item.id}_checkout`,
          name: item.name,
          date: checkOutDateString,
          message: `Check-out: ${checkOutDisplayTime}`,
          time: `${endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at ${checkOutDisplayTime}`,
          actualTime: fallbackCheckOutTime,
          checkOutTime: fallbackCheckOutTime,
          duration: 'Check-out',
        });
      } else {
        // Legacy path: find the corresponding check-out to calculate nights
        const checkOutEntry = itinerary.find(
          checkOut =>
            checkOut.type === 'accommodation' &&
            checkOut.duration === 'Check-out' &&
            checkOut.name === item.name
        );

        if (checkOutEntry) {
          const startDate = new Date(item.date);
          const endDate = new Date(checkOutEntry.date);
          const nights = Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          // Add check-in day with specific time
          expanded.push(item);

          // Add middle days as all-day stays
          for (let i = 1; i < nights; i++) {
            const stayDate = new Date(startDate);
            stayDate.setDate(startDate.getDate() + i);
            const stayDateString = `${stayDate.getFullYear()}-${String(stayDate.getMonth() + 1).padStart(2, '0')}-${String(stayDate.getDate()).padStart(2, '0')}`;

            expanded.push({
              ...item,
              id: `${item.id}_stay_${i}`,
              name: item.name,
              date: stayDateString,
              message: 'Staying at hotel - All day',
              time: `${stayDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - All day`,
              actualTime: '', // No specific time for all-day stays
              duration: 'All day',
            });
          }
        } else {
          // No check-out found, just add the check-in
          expanded.push(item);
        }
      }
    } else {
      // Regular event or check-out, add as-is
      expanded.push(item);
    }
  });

  return expanded;
};

// Filter utilities
export const filterItineraryItems = (
  items: ItineraryData[],
  filter: string,
  searchQuery: string
): ItineraryData[] => {
  let filteredItems = items;

  // Apply filter
  switch (filter) {
    case 'Today':
      const todayStr = getTodayString();
      filteredItems = items.filter(item => item.date === todayStr);
      break;
    case 'Past':
      const todayString = getTodayString();
      filteredItems = items.filter(item => item.date < todayString);
      break;
    case 'Stays':
      filteredItems = items.filter(item => item.type === 'accommodation');
      break;
    case 'Events':
      filteredItems = items.filter(
        item =>
          item.type === 'activity' &&
          (item.name.toLowerCase().includes('dinner') ||
            item.name.toLowerCase().includes('show') ||
            item.name.toLowerCase().includes('cultural') ||
            item.name.toLowerCase().includes('restaurant'))
      );
      break;
    case 'ThingsToDo':
      filteredItems = items.filter(
        item =>
          item.type === 'activity' &&
          !(
            item.name.toLowerCase().includes('dinner') ||
            item.name.toLowerCase().includes('show') ||
            item.name.toLowerCase().includes('cultural') ||
            item.name.toLowerCase().includes('restaurant')
          )
      );
      break;
    case 'Flights':
      filteredItems = items.filter(
        item =>
          item.type === 'transport' &&
          (item.name.toLowerCase().includes('flight') ||
            item.name.toLowerCase().includes('helicopter') ||
            item.name.toLowerCase().includes('emirates') ||
            item.name.toLowerCase().includes('airline'))
      );
      break;
    case 'Bus':
      filteredItems = items.filter(
        item =>
          item.type === 'transport' &&
          (item.name.toLowerCase().includes('bus') ||
            item.name.toLowerCase().includes('coach') ||
            item.name.toLowerCase().includes('intercape'))
      );
      break;
    case 'Dining':
      filteredItems = items.filter(item => item.type === 'dining');
      break;
    default: // 'All'
      filteredItems = items;
  }

  // Apply search if needed
  if (searchQuery.trim()) {
    const lowerQuery = searchQuery.toLowerCase();
    filteredItems = filteredItems.filter(
      item =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.message.toLowerCase().includes(lowerQuery) ||
        item.location?.toLowerCase().includes(lowerQuery)
    );
  }

  // Sort chronologically by date, then by time
  return filteredItems.sort((a, b) => {
    // First sort by date
    const dateComparison = a.date.localeCompare(b.date);
    if (dateComparison !== 0) return dateComparison;

    // If same date, sort by time
    // Handle all-day events (empty actualTime) - they should come first for that day
    if (!a.actualTime && b.actualTime) return -1; // a (all-day) comes before b (timed)
    if (a.actualTime && !b.actualTime) return 1; // b (all-day) comes before a (timed)
    if (!a.actualTime && !b.actualTime) return 0; // Both all-day, maintain order

    // Both have times, sort by actual time
    return (a.actualTime || '').localeCompare(b.actualTime || '');
  });
};

// Filter options for itinerary
export const FILTER_OPTIONS = [
  { key: 'All', label: 'All' },
  { key: 'Today', label: 'Today' },
  { key: 'Past', label: 'Past' },
  { key: 'Stays', label: 'Stays' },
  { key: 'Flights', label: 'Flights' },
  { key: 'Bus', label: 'Bus' },
  { key: 'ThingsToDo', label: 'Things To Do' },
  { key: 'Events', label: 'Events' },
  { key: 'Dining', label: 'Dining' },
];
