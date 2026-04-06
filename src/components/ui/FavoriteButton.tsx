"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";

interface FavoriteButtonProps {
  itemId: string;
  itemType: string;
  label?: string;
  className?: string;
  iconClassName?: string;
}

export default function FavoriteButton({
  itemId,
  itemType,
  label = "Save to favorites",
  className = "",
  iconClassName = "h-4 w-4",
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(itemId, itemType);

  return (
    <button
      type="button"
      aria-label={active ? "Remove from favorites" : label}
      aria-pressed={active}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void toggleFavorite({ itemId, itemType });
      }}
      className={className}
    >
      <Heart
        className={`${iconClassName} transition ${
          active ? "fill-[#ff5b65] text-[#ff5b65]" : ""
        }`}
      />
    </button>
  );
}
