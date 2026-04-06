import { apiFetch } from '@/lib/api';

const normalizeDateOfBirth = (value?: string | null): string | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const match = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) {
    return null;
  }

  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
};

export const carouselService = {
  getAll: async () => {
    const { destinations } = await apiFetch<{ destinations: any[] }>('/api/destinations');
    const data = destinations.slice(0, 5).map((destination, index) => ({
      id: destination.id,
      image_url: destination.image_url,
      title: destination.name,
      location: destination.location || destination.name,
      active: true,
      order_index: index,
    }));
    return { data, error: null };
  },
  getById: async (id: string) => {
    const { destinations } = await apiFetch<{ destinations: any[] }>('/api/destinations');
    return { data: destinations.find(item => item.id === id) || null, error: null };
  },
};

export const destinationsService = {
  getAll: async (featured?: boolean) => {
    const payload = await apiFetch<{ destinations: any[] }>('/api/destinations');
    const data = featured ? payload.destinations.slice(0, 6) : payload.destinations;
    return { data, error: null };
  },
  getById: async (id: string) => {
    const payload = await apiFetch<{ destination: any }>(`/api/destinations/${id}`);
    return { data: payload.destination, error: null };
  },
  search: async (query: string) => {
    const payload = await apiFetch<{ destinations: any[] }>('/api/destinations');
    const normalized = query.trim().toLowerCase();
    const data = payload.destinations.filter(
      item =>
        item.name?.toLowerCase().includes(normalized) ||
        item.location?.toLowerCase().includes(normalized) ||
        item.description?.toLowerCase().includes(normalized)
    );
    return { data, error: null };
  },
};

export const staysService = {
  getAll: async (_destinationId?: string, featured?: boolean) => {
    const payload = await apiFetch<{ stays: any[] }>('/api/stays');
    const data = featured ? payload.stays.filter(item => item.featured) : payload.stays;
    return { data, error: null };
  },
  getById: async (id: string) => {
    const payload = await apiFetch<{ stay: any }>(`/api/stays/${id}`);
    return { data: payload.stay, error: null };
  },
  search: async (query: string) => {
    const payload = await apiFetch<{ stays: any[] }>('/api/stays');
    const normalized = query.trim().toLowerCase();
    const data = payload.stays.filter(
      item =>
        item.name?.toLowerCase().includes(normalized) ||
        item.location?.toLowerCase().includes(normalized) ||
        item.description?.toLowerCase().includes(normalized)
    );
    return { data, error: null };
  },
};

export const eventsService = {
  getAll: async (_destinationId?: string, featured?: boolean) => {
    const payload = await apiFetch<{ events: any[] }>('/api/events');
    const data = featured ? payload.events.filter(item => item.featured) : payload.events;
    return { data, error: null };
  },
  getById: async (id: string) => {
    const payload = await apiFetch<{ event: any }>(`/api/events/${id}`);
    return { data: payload.event, error: null };
  },
  getUpcoming: async (limit = 10) => {
    const payload = await apiFetch<{ events: any[] }>('/api/events');
    return { data: payload.events.slice(0, limit), error: null };
  },
};

export interface StaysBookingInsert {
  userId: string;
  stayId?: string | null;
  stayName?: string | null;
  roomId?: string | null;
  transactionNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  checkInDate: string;
  checkOutDate: string;
  guestsCount: number;
  adultsCount: number;
  childrenCount: number;
  roomsCount: number;
  roomType?: string | null;
  roomTypeRate?: number | null;
  subtotal?: number | null;
  tax?: number | null;
  totalAmount: number;
  paymentMethod?: string | null;
  paymentGateway?: Record<string, unknown> | null;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'failed';
  sameAsAccountHolder?: boolean;
  idType?: string | null;
  identityNumber?: string | null;
  dateOfBirth?: string | null;
  nationality?: string | null;
  travelingWithInfant?: boolean;
}

export const bookingsService = {
  create: async (bookingData: any) => {
    const payload = await apiFetch<{ booking: any }>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
    return { data: payload.booking, error: null };
  },
  getUserBookings: async (_userId: string) => {
    const payload = await apiFetch<{ bookings: any[] }>('/api/bookings');
    return { data: payload.bookings, error: null };
  },
  update: async (bookingId: string, updates: any) => {
    const payload = await apiFetch<{ booking: any }>('/api/bookings', {
      method: 'PATCH',
      body: JSON.stringify({ bookingId, ...updates }),
    });
    return { data: payload.booking, error: null };
  },
  cancel: async (bookingId: string) => {
    return bookingsService.update(bookingId, { status: 'cancelled' });
  },
};

export const staysBookingsService = {
  create: async (input: StaysBookingInsert) => {
    const payload = await apiFetch<{ booking: any }>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        ...input,
        dateOfBirth: normalizeDateOfBirth(input.dateOfBirth),
      }),
    });
    return { data: payload.booking, error: null };
  },
  getUserBookings: async (_userId: string) => {
    const payload = await apiFetch<{ bookings: any[] }>('/api/bookings');
    return { data: payload.bookings, error: null };
  },
  markAsDeleted: async (bookingId: string, _userId?: string) => {
    const payload = await apiFetch<{ booking: any }>('/api/bookings', {
      method: 'PATCH',
      body: JSON.stringify({ bookingId, markedAsDeleted: true }),
    });
    return { data: payload.booking ? [payload.booking] : [], error: null };
  },
  delete: async (bookingId: string, _userId?: string) => {
    await apiFetch('/api/bookings', {
      method: 'DELETE',
      body: JSON.stringify({ bookingId }),
    });
    return { data: [{ id: bookingId }], error: null };
  },
};

export const favoritesService = {
  add: async (_userId: string, itemType: string, itemId: string) => {
    const payload = await apiFetch<{ favorites: any[] }>('/api/favorites', {
      method: 'POST',
      body: JSON.stringify({ itemType, itemId }),
    });
    return { data: payload.favorites, error: null };
  },
  remove: async (_userId: string, itemType: string, itemId: string) => {
    const payload = await apiFetch<{ favorites: any[] }>('/api/favorites', {
      method: 'DELETE',
      body: JSON.stringify({ itemType, itemId }),
    });
    return { data: payload.favorites, error: null };
  },
  getUserFavorites: async (_userId: string, itemType?: string) => {
    const payload = await apiFetch<{ favorites: any[] }>('/api/favorites');
    const data = itemType
      ? payload.favorites.filter(item => item.itemType === itemType)
      : payload.favorites;
    return {
      data: data.map(item => ({
        item_id: item.itemId,
        item_type: item.itemType,
      })),
      error: null,
    };
  },
  isFavorited: async (_userId: string, itemType: string, itemId: string) => {
    const payload = await apiFetch<{ favorites: any[] }>('/api/favorites');
    const data = payload.favorites.find(
      item => item.itemId === itemId && item.itemType === itemType
    );
    return { data: data ? { id: itemId } : null, error: null };
  },
};
