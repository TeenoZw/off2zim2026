import { ItineraryData } from '@/components';

// Types and Interfaces
export interface CalendarDay {
  date: string; // YYYY-MM-DD
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isPast: boolean;
  events: ItineraryData[];
}

export interface DisplayWeek {
  week: CalendarDay[];
  state: 'focused' | 'below';
}

// Calendar utility functions
export const getCalendarDaysForMonth = (
  monthDate: Date,
  expandedItinerary: ItineraryData[],
  selectedDate: string | null
): CalendarDay[] => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  startDate.setDate(startDate.getDate() - mondayOffset);
  const days: CalendarDay[] = [];
  const now = new Date();
  const todayString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const dayEvents = expandedItinerary.filter((event: ItineraryData) => event.date === dateString);
    const isCurrentMonth = date.getMonth() === month;
    const isPast = dateString < todayString;

    days.push({
      date: dateString,
      day: date.getDate(),
      isCurrentMonth: isCurrentMonth,
      isToday: dateString === todayString,
      isSelected: dateString === selectedDate,
      isPast: isPast,
      events: dayEvents,
    });
  }

  return days;
};

export const isSelectedWeek = (
  calendarDays: CalendarDay[],
  selectedDate: string | null,
  weekIndex: number
): boolean => {
  if (!selectedDate) return false;
  const index = calendarDays.findIndex(day => day.date === selectedDate);
  const selectedWeekIndex = Math.floor(index / 7);
  return weekIndex === selectedWeekIndex;
};

// Calendar constants
export const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const CALENDAR_WEEKS = 6;
export const CALENDAR_DAYS = CALENDAR_WEEKS * 7; // 42 days

export const ANIMATION_DURATION = {
  CARD: 260,
  MONTH_TRANSITION: {
    OUT: 180,
    IN: 220,
  },
};
