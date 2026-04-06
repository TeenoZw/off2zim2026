// Utility for computing open/closing/closed status based on local time
export type ActivityStatus = 'Open' | 'Closing' | 'Closed';

export interface ActivitySchedule {
  operatingHours?: string; // e.g. "09:00 - 18:00"
  durationHours?: number;
  durationMinutes?: number;
  closingBufferMinutes?: number;
}

const toMinutes = (hours: number, minutes: number) => hours * 60 + minutes;

const parseTime = (time: string): number | null => {
  const [hourStr, minuteStr] = time.split(':');
  const hours = Number(hourStr);
  const minutes = Number(minuteStr);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }
  return toMinutes(hours, minutes);
};

const parseOperatingHours = (operatingHours: string): { open: number; close: number } | null => {
  const [openStr, closeStr] = operatingHours.split(' - ').map(part => part.trim());
  if (!openStr || !closeStr) {
    return null;
  }
  const open = parseTime(openStr);
  const close = parseTime(closeStr);
  if (open === null || close === null) {
    return null;
  }
  return { open, close };
};

export const getActivityStatus = (now: Date, schedule?: ActivitySchedule): ActivityStatus => {
  const current = toMinutes(now.getHours(), now.getMinutes());

  if (schedule?.operatingHours) {
    const parsed = parseOperatingHours(schedule.operatingHours);
    if (parsed) {
      const { open, close } = parsed;
      const closingBuffer = schedule.closingBufferMinutes ?? 60;
      const rawDuration = schedule.durationMinutes ?? (schedule.durationHours ?? 0) * 60;
      const duration = rawDuration > 0 ? rawDuration : 0;
      const lastBookingStart = duration > 0 ? close - duration : close - closingBuffer;
      const closingThreshold = Math.max(open, lastBookingStart - closingBuffer);

      if (current < open || current >= close) {
        return 'Closed';
      }

      if (current >= lastBookingStart || current >= closingThreshold) {
        return 'Closing';
      }

      return 'Open';
    }
  }

  // Fallback generic schedule (08:00 - 17:00 with closing window from 16:30)
  const openStart = toMinutes(8, 0); // 08:00
  const closingSoonStart = toMinutes(16, 30); // 16:30
  const closedStart = toMinutes(17, 0); // 17:00

  if (current >= closedStart || current < openStart) {
    return 'Closed';
  }

  if (current >= closingSoonStart) {
    return 'Closing';
  }

  return 'Open';
};

export const activityStatusColor = (status: ActivityStatus) =>
  status === 'Open' ? '#34C759' : status === 'Closing' ? '#FF9500' : '#FF3B30';
