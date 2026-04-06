import { Ionicons } from '@expo/vector-icons';

export type IoniconName = keyof typeof Ionicons.glyphMap;

/**
 * Get the appropriate Ionicon name for a given amenity string.
 * This is the single source of truth for amenity icon mapping across the entire app.
 */
export const getAmenityIcon = (amenity: string): IoniconName => {
  const amenityLower = amenity.toLowerCase();

  // Basic amenities
  if (amenityLower.includes('wifi')) return 'wifi';
  if (amenityLower.includes('pool')) return 'water';
  if (amenityLower.includes('gym') || amenityLower.includes('fitness')) return 'barbell-outline';
  if (amenityLower.includes('restaurant')) return 'fast-food';
  if (amenityLower.includes('breakfast')) return 'cafe-outline';
  if (amenityLower.includes('spa')) return 'flower-outline';
  if (amenityLower.includes('bar')) return 'wine-outline';
  if (amenityLower.includes('parking')) return 'car-outline';
  if (amenityLower.includes('air') || amenityLower.includes('ac')) return 'snow-outline';

  // Zimbabwe-specific amenities
  if (amenityLower.includes('safari')) return 'compass-outline';
  if (amenityLower.includes('golf')) return 'golf-outline';
  if (amenityLower.includes('casino')) return 'diamond-outline';
  if (amenityLower.includes('conference') || amenityLower.includes('business'))
    return 'briefcase-outline';
  if (amenityLower.includes('garden')) return 'leaf-outline';
  if (amenityLower.includes('fishing')) return 'fish-outline';
  if (amenityLower.includes('horse') || amenityLower.includes('riding'))
    return 'trail-sign-outline';
  if (amenityLower.includes('library')) return 'book-outline';

  // Default fallback
  return 'checkmark-circle-outline';
};
