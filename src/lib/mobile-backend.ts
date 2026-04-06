import { prisma } from '@/lib/prisma';

type FavoriteRecord = {
  itemId: string;
  itemType: string;
};

type UserPreferencesShape = {
  favorites?: FavoriteRecord[];
  mobileProfile?: Record<string, unknown>;
};

function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function parseUserPreferences(preferences: string | null | undefined) {
  return safeJsonParse<UserPreferencesShape>(preferences, {});
}

export function serializeUserPreferences(preferences: UserPreferencesShape) {
  return JSON.stringify(preferences);
}

function getProfileExtras(preferences: UserPreferencesShape) {
  const profile = preferences.mobileProfile;
  return typeof profile === 'object' && profile ? profile : {};
}

export function buildMobileProfile(user: {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  phone: string | null;
  nationality: string | null;
  image: string | null;
  role: string;
  explorerScore: string | null;
  preferences: string | null;
}) {
  const preferences = parseUserPreferences(user.preferences);
  const extras = getProfileExtras(preferences) as Record<string, any>;
  const fullName =
    (typeof extras.full_name === 'string' && extras.full_name.trim()) ||
    [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
    user.name ||
    '';

  return {
    id: user.id,
    full_name: fullName,
    business_name:
      typeof extras.business_name === 'string' ? extras.business_name : null,
    phone: user.phone || (typeof extras.phone === 'string' ? extras.phone : null),
    email: user.email,
    user_type: user.role === 'provider' ? 'business' : 'individual',
    title: typeof extras.title === 'string' ? extras.title : null,
    gender: typeof extras.gender === 'string' ? extras.gender : null,
    id_type: typeof extras.id_type === 'string' ? extras.id_type : null,
    identity_number:
      typeof extras.identity_number === 'string' ? extras.identity_number : null,
    date_of_birth:
      typeof extras.date_of_birth === 'string' ? extras.date_of_birth : null,
    nationality:
      user.nationality ||
      (typeof extras.nationality === 'string' ? extras.nationality : null),
    avatar_url: user.image,
    rating: safeJsonParse(user.explorerScore, { rating: 0 }).rating ?? 0,
  };
}

const DESTINATION_IMAGE_MAP: Record<string, string> = {
  'Victoria Falls': '/images/destinations/victoria-falls.jpg',
  Hwange: '/images/destinations/hwange.jpg',
  'Great Zimbabwe': '/images/destinations/great-zimbabwe.jpg',
  Kariba: '/images/destinations/lake-kariba.jpg',
  Nyanga: '/images/destinations/eastern-highlands.jpg',
  Harare: '/images/jacaranda.JPG',
  Bulawayo: '/images/destinations/matobo.jpg',
};

function publicImage(path: string | null | undefined) {
  return path || null;
}

function isPrismaBuildConfigError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.name === 'PrismaClientInitializationError' ||
    error.message.includes('Error validating datasource `db`') ||
    error.message.includes('the URL must start with the protocol `file:`')
  );
}

function handleMobileDataFallback<T>(dataset: string, error: unknown, fallback: T): T {
  if (isPrismaBuildConfigError(error)) {
    console.warn(
      `[mobile-backend] Falling back to ${dataset} defaults because Prisma is unavailable during build.`
    );
    return fallback;
  }

  throw error;
}

export async function getMobileDestinations() {
  try {
    const [hotels, activities, restaurants, events] = await Promise.all([
      prisma.hotel.findMany({ select: { city: true, description: true, images: true } }),
      prisma.activity.findMany({ select: { location: true, description: true, images: true } }),
      prisma.restaurant.findMany({ select: { location: true, description: true, images: true } }),
      prisma.event.findMany({ select: { location: true, description: true, images: true } }),
    ]);

    const locations = new Map<
      string,
      { description: string | null; images: string[]; stays: number; activities: number }
    >();

    const addLocation = (
      name: string,
      description: string | null,
      images: string[],
      type: 'stay' | 'activity'
    ) => {
      const key = name.trim();
      const existing = locations.get(key) || {
        description: null,
        images: [],
        stays: 0,
        activities: 0,
      };

      if (!existing.description && description) {
        existing.description = description;
      }
      if (images.length > 0) {
        existing.images = [...existing.images, ...images];
      }
      if (type === 'stay') {
        existing.stays += 1;
      } else {
        existing.activities += 1;
      }
      locations.set(key, existing);
    };

    hotels.forEach(hotel =>
      addLocation(hotel.city, hotel.description, safeJsonParse(hotel.images, []), 'stay')
    );
    activities.forEach(activity =>
      addLocation(
        activity.location,
        activity.description,
        safeJsonParse(activity.images, []),
        'activity'
      )
    );
    restaurants.forEach(restaurant =>
      addLocation(
        restaurant.location,
        restaurant.description,
        safeJsonParse(restaurant.images, []),
        'activity'
      )
    );
    events.forEach(event =>
      addLocation(event.location, event.description, safeJsonParse(event.images, []), 'activity')
    );

    return Array.from(locations.entries()).map(([name, data]) => ({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name,
      description: data.description,
      location: name,
      image_url: publicImage(data.images[0] || DESTINATION_IMAGE_MAP[name] || null),
      images: data.images.length > 0 ? data.images : [DESTINATION_IMAGE_MAP[name]].filter(Boolean),
      latitude: null,
      longitude: null,
      created_at: new Date().toISOString(),
      stays_count: data.stays,
      activities_count: data.activities,
    }));
  } catch (error) {
    return handleMobileDataFallback('destinations', error, []);
  }
}

export async function getMobileStays() {
  try {
    const hotels = await prisma.hotel.findMany({
      include: {
        rooms: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return hotels.map(hotel => {
      const images = safeJsonParse<string[]>(hotel.images, []);
      const amenities = safeJsonParse<string[]>(hotel.amenities, []);

      return {
        id: hotel.id,
        name: hotel.name,
        description: hotel.description,
        location: hotel.city,
        image_url: publicImage(images[0]),
        images,
        featured: hotel.rating ? hotel.rating >= 4.8 : false,
        rating: hotel.rating,
        price: hotel.rooms[0]?.price ?? null,
        phone: null,
        full_location: hotel.address,
        total_reviews: 0,
        check_in_time: '14:00',
        check_out_time: '10:00',
        amenities,
        created_at: hotel.createdAt.toISOString(),
        destinations: {
          name: hotel.city,
          location: hotel.city,
        },
        service_providers: null,
        stay_rooms: hotel.rooms.map(room => ({
          id: room.id,
          room_type: room.name,
          name: room.name,
          base_price: room.price,
          max_guests: room.capacity,
          description: room.description,
          amenities: safeJsonParse<string[]>(room.amenities, []),
          is_active: room.isAvailable,
          total_rooms: null,
          available_rooms: null,
          stay_name: hotel.name,
        })),
        stay_gallery: images.map((image, index) => ({
          id: `${hotel.id}-${index}`,
          image_url: image,
          caption: hotel.name,
          sort_order: index,
        })),
      };
    });
  } catch (error) {
    return handleMobileDataFallback('stays', error, []);
  }
}

export async function getMobileEvents() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        startDate: 'asc',
      },
    });

    return events.map(event => {
      const images = safeJsonParse<string[]>(event.images, []);
      const now = new Date();
      const isUpcoming = event.startDate >= now;

      return {
        id: event.id,
        name: event.name,
        description: event.description,
        location: event.location,
        venue: event.location,
        category: event.category,
        featured: isUpcoming,
        rating: 4.6,
        total_ratings: 0,
        currency: event.currency,
        capacity: event.capacity,
        tickets_available: event.capacity,
        image_url: publicImage(images[0]),
        images,
        start_date: event.startDate.toISOString(),
        start_time: event.startDate.toISOString().slice(11, 16),
        end_time: event.endDate?.toISOString().slice(11, 16) ?? null,
        created_at: event.createdAt.toISOString(),
        destinations: {
          name: event.location,
          location: event.location,
        },
        service_providers: null,
        event_tickets: [
          {
            id: `${event.id}-standard`,
            ticket_type: 'standard',
            name: 'Standard Ticket',
            description: 'General admission',
            base_price: event.price,
            original_price: null,
            currency: event.currency,
            total_tickets: event.capacity,
            tickets_sold: 0,
            tickets_available: event.capacity,
            perks: [],
            min_purchase: 1,
            max_purchase: 10,
            sale_start_date: null,
            sale_end_date: null,
            is_active: true,
          },
        ],
        event_gallery: images.map((image, index) => ({
          id: `${event.id}-${index}`,
          image_url: image,
          thumbnail_url: image,
          caption: event.name,
          category: 'general',
          is_featured: index === 0,
          sort_order: index,
        })),
      };
    });
  } catch (error) {
    return handleMobileDataFallback('events', error, []);
  }
}

export async function getUserFavorites(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { preferences: true },
  });

  const preferences = parseUserPreferences(user?.preferences);
  return preferences.favorites || [];
}

export async function saveUserFavorites(userId: string, favorites: FavoriteRecord[]) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { preferences: true },
  });

  const preferences = parseUserPreferences(user?.preferences);
  preferences.favorites = favorites;

  await prisma.user.update({
    where: { id: userId },
    data: {
      preferences: serializeUserPreferences(preferences),
    },
  });
}

export function buildMobileAuthMetadata(user: {
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  email: string;
  phone?: string | null;
  nationality?: string | null;
  role: string;
  image?: string | null;
  preferences?: string | null;
  explorerScore?: string | null;
}) {
  const profile = buildMobileProfile({
    id: '',
    email: user.email,
    firstName: user.firstName ?? null,
    lastName: user.lastName ?? null,
    name: user.name ?? null,
    phone: user.phone ?? null,
    nationality: user.nationality ?? null,
    image: user.image ?? null,
    role: user.role,
    explorerScore: user.explorerScore ?? null,
    preferences: user.preferences ?? null,
  });

  return {
    full_name: profile.full_name,
    first_name: user.firstName ?? undefined,
    last_name: user.lastName ?? undefined,
    phone: profile.phone ?? undefined,
    nationality: profile.nationality ?? undefined,
    business_name: profile.business_name ?? undefined,
    user_type: profile.user_type,
    avatar_url: profile.avatar_url ?? undefined,
    title: profile.title ?? undefined,
    gender: profile.gender ?? undefined,
    id_type: profile.id_type ?? undefined,
    identity_number: profile.identity_number ?? undefined,
    date_of_birth: profile.date_of_birth ?? undefined,
    rating: profile.rating ?? 0,
  };
}
