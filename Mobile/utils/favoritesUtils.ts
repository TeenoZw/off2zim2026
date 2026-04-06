import { favoritesService } from '@/services/database';
import { buildSession } from '@/lib/api';

// In-memory favorites store (IDs)
let favorites = new Set<string>();

// Subscribers to notify on changes (simple pub/sub for React reactivity)
type Subscriber = () => void;
const subscribers = new Set<Subscriber>();

const notifySubscribers = () => {
  subscribers.forEach(cb => {
    try {
      cb();
    } catch (err) {
      // ignore subscriber errors
    }
  });
};

export const subscribeFavorites = (cb: Subscriber) => {
  subscribers.add(cb);
  // Return a cleanup function that returns void (React useEffect expects a void-returning cleanup)
  return () => {
    subscribers.delete(cb);
  };
};

/**
 * Initialize favorites for the given user by loading them from the database.
 */
export const initFavorites = async (userId?: string) => {
  favorites.clear();
  if (!userId) return;

  try {
    const { data, error } = await favoritesService.getUserFavorites(userId);
    if (error) {
      console.error('Failed to load user favorites:', error);
      return;
    }

    (data || []).forEach((row: any) => {
      if (row && row.item_id) favorites.add(row.item_id);
    });

    console.debug(`initFavorites: loaded ${favorites.size} favorites for user ${userId}`);
    // Notify listeners that favorites changed
    notifySubscribers();
  } catch (err) {
    console.error('Error initializing favorites:', err);
  }
};

/**
 * Check if an item is favorited (by id)
 */
export const isFavorited = (itemId: string): boolean => {
  return favorites.has(itemId);
};

/**
 * Toggle the favorite status of an item (immediate in-memory update, persistent to DB async)
 * itemType is optional; if not provided, database calls will remove/add by item_id regardless of type
 */
export const toggleFavorite = (itemId: string, itemType?: string): boolean => {
  const nowFavorited = !favorites.has(itemId);
  if (nowFavorited) favorites.add(itemId); else favorites.delete(itemId);

  // Notify subscribers immediately so UI can update
  notifySubscribers();

  // Persist asynchronously
  (async () => {
    try {
      const user = (await buildSession())?.user;
      if (!user) return;

      if (nowFavorited) {
        await favoritesService.add(user.id, itemType ?? 'unknown', itemId);
      } else {
        if (itemType) {
          await favoritesService.remove(user.id, itemType, itemId);
        } else {
          await favoritesService.remove(user.id, 'unknown', itemId);
        }
      }
    } catch (err) {
      console.error('Failed to persist favorite change:', err);
    }
  })().catch(() => {});

  return nowFavorited;
};

export const addToFavorites = (itemId: string, itemType?: string) => {
  favorites.add(itemId);
  notifySubscribers();
  (async () => {
    try {
      const user = (await buildSession())?.user;
      if (!user) return;
      await favoritesService.add(user.id, itemType ?? 'unknown', itemId);
    } catch (err) {
      console.error('Failed to add favorite:', err);
    }
  })().catch(() => {});
};

export const removeFromFavorites = (itemId: string, itemType?: string) => {
  favorites.delete(itemId);
  notifySubscribers();
  (async () => {
    try {
      const user = (await buildSession())?.user;
      if (!user) return;
      if (itemType) {
        await favoritesService.remove(user.id, itemType, itemId);
      } else {
        await favoritesService.remove(user.id, 'unknown', itemId);
      }
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  })().catch(() => {});
};

export const getAllFavorites = (): Record<string, boolean> => {
  const record: Record<string, boolean> = {};
  favorites.forEach(id => (record[id] = true));
  return record;
};

export const clearAllFavorites = (): void => {
  favorites.clear();
  notifySubscribers();
};

export const getFavoritedIds = (): string[] => {
  return Array.from(favorites);
};
