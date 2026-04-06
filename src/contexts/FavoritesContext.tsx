"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import { apiFetch } from "@/lib/client-api";
import { useAuth } from "@/contexts/AuthContext";

type FavoriteRecord = {
  itemId: string;
  itemType: string;
};

type FavoritesContextValue = {
  favorites: FavoriteRecord[];
  isLoading: boolean;
  isFavorite: (itemId: string, itemType?: string) => boolean;
  toggleFavorite: (item: FavoriteRecord) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

const GUEST_FAVORITES_KEY = "off2zim_guest_favorites";

function readGuestFavorites() {
  if (typeof window === "undefined") {
    return [] as FavoriteRecord[];
  }

  try {
    const raw = localStorage.getItem(GUEST_FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as FavoriteRecord[]) : [];
  } catch {
    return [];
  }
}

function writeGuestFavorites(favorites: FavoriteRecord[]) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(favorites));
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      const guestFavorites = readGuestFavorites();
      setFavorites(guestFavorites);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const guestFavorites = readGuestFavorites();
      const payload = await apiFetch<{ favorites: FavoriteRecord[] }>("/api/favorites");
      let nextFavorites = payload.favorites;

      const missingGuestFavorites = guestFavorites.filter(
        (guestFavorite) =>
          !payload.favorites.some(
            (favorite) =>
              favorite.itemId === guestFavorite.itemId &&
              favorite.itemType === guestFavorite.itemType
          )
      );

      for (const favorite of missingGuestFavorites) {
        const merged = await apiFetch<{ favorites: FavoriteRecord[] }>("/api/favorites", {
          method: "POST",
          body: JSON.stringify(favorite),
        });
        nextFavorites = merged.favorites;
      }

      writeGuestFavorites([]);
      setFavorites(nextFavorites);
    } catch {
      const guestFavorites = readGuestFavorites();
      setFavorites(guestFavorites);
    } finally {
      setIsLoading(false);
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const isFavorite = useCallback(
    (itemId: string, itemType = "unknown") =>
      favorites.some(
        (favorite) =>
          favorite.itemId === itemId &&
          (favorite.itemType === itemType || favorite.itemType === "unknown")
      ),
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (item: FavoriteRecord) => {
      const currentlyFavorite = favorites.some(
        (favorite) =>
          favorite.itemId === item.itemId && favorite.itemType === item.itemType
      );

      const optimistic = currentlyFavorite
        ? favorites.filter(
            (favorite) =>
              favorite.itemId !== item.itemId || favorite.itemType !== item.itemType
          )
        : [...favorites, item];

      setFavorites(optimistic);

      try {
        if (!isAuthenticated) {
          writeGuestFavorites(optimistic);
        } else if (currentlyFavorite) {
          const payload = await apiFetch<{ favorites: FavoriteRecord[] }>("/api/favorites", {
            method: "DELETE",
            body: JSON.stringify(item),
          });
          setFavorites(payload.favorites);
        } else {
          const payload = await apiFetch<{ favorites: FavoriteRecord[] }>("/api/favorites", {
            method: "POST",
            body: JSON.stringify(item),
          });
          setFavorites(payload.favorites);
        }

        toast.success(currentlyFavorite ? "Removed from favorites" : "Saved to favorites");
      } catch {
        setFavorites(favorites);
        if (!isAuthenticated) {
          writeGuestFavorites(favorites);
        }
        toast.error("Could not update favorites");
      }
    },
    [favorites, isAuthenticated]
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      isLoading,
      isFavorite,
      toggleFavorite,
    }),
    [favorites, isLoading, isFavorite, toggleFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
