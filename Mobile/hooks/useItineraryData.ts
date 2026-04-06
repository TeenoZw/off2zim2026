import { useMemo } from 'react';
import { expandAccommodationStays } from '@/utils/itineraryUtils';
import type { ItineraryData } from '@/components';

export function useItineraryData(itinerary: ItineraryData[]) {
  const expandedItinerary = useMemo(() => {
    return expandAccommodationStays(itinerary);
  }, [itinerary]);

  const categorizedItinerary = useMemo(() => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    return {
      today: expandedItinerary.filter(item => item.date === todayStr),
      upcoming: expandedItinerary.filter(item => item.date > todayStr),
      past: expandedItinerary.filter(item => item.date < todayStr),
      accommodation: expandedItinerary.filter(item => item.type === 'accommodation'),
      activities: expandedItinerary.filter(item => item.type === 'activity'),
      transport: expandedItinerary.filter(item => item.type === 'transport'),
      dining: expandedItinerary.filter(item => item.type === 'dining'),
    };
  }, [expandedItinerary]);

  return { expandedItinerary, categorizedItinerary };
}

export function useFilteredItinerary(
  expandedItinerary: ItineraryData[],
  categorizedItinerary: ReturnType<typeof useItineraryData>['categorizedItinerary'],
  activeFilter: string,
  searchQuery: string
) {
  return useMemo(() => {
    let items: ItineraryData[] = [];

    switch (activeFilter) {
      case 'All':
        items = expandedItinerary;
        break;
      case 'Today':
        items = categorizedItinerary.today;
        break;
      case 'Past':
        items = categorizedItinerary.past;
        break;
      case 'Stays':
        items = categorizedItinerary.accommodation;
        break;
      case 'Events':
        items = expandedItinerary.filter(
          item =>
            item.type === 'activity' &&
            (item.name.toLowerCase().includes('dinner') ||
              item.name.toLowerCase().includes('show') ||
              item.name.toLowerCase().includes('cultural') ||
              item.name.toLowerCase().includes('restaurant'))
        );
        break;
      case 'ThingsToDo':
        items = expandedItinerary.filter(
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
        items = expandedItinerary.filter(
          item =>
            item.type === 'transport' &&
            (item.name.toLowerCase().includes('flight') ||
              item.name.toLowerCase().includes('helicopter') ||
              item.name.toLowerCase().includes('emirates') ||
              item.name.toLowerCase().includes('airline'))
        );
        break;
      case 'Bus':
        items = expandedItinerary.filter(
          item =>
            item.type === 'transport' &&
            (item.name.toLowerCase().includes('bus') ||
              item.name.toLowerCase().includes('coach') ||
              item.name.toLowerCase().includes('intercape'))
        );
        break;
      case 'Dining':
        items = categorizedItinerary.dining;
        break;
      default:
        items = [];
    }

    // Apply search if needed
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      items = items.filter(
        item =>
          item.name.toLowerCase().includes(lowerQuery) ||
          item.message.toLowerCase().includes(lowerQuery) ||
          item.location?.toLowerCase().includes(lowerQuery)
      );
    }

    // Sort chronologically by date, then by time
    return items.sort((a, b) => {
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
  }, [categorizedItinerary, expandedItinerary, searchQuery, activeFilter]);
}
