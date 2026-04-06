import { Image } from 'react-native';

// Logo image sources
export const LOGO_IMAGES = {
  black: require('@/assets/images/logo_black.png'),
  white: require('@/assets/images/logo_white.png'),
} as const;

// Track if images are preloaded
let imagesPreloaded = false;
let preloadingPromise: Promise<void> | null = null;

/**
 * Preload logo images to prevent flashing when switching themes or pages
 */
export const preloadLogoImages = async (): Promise<void> => {
  if (imagesPreloaded) {
    return;
  }

  // If already preloading, return the existing promise
  if (preloadingPromise) {
    return preloadingPromise;
  }

  preloadingPromise = (async () => {
    try {
      // Get URIs for both logo variants
      const blackLogoUri = Image.resolveAssetSource(LOGO_IMAGES.black).uri;
      const whiteLogoUri = Image.resolveAssetSource(LOGO_IMAGES.white).uri;

      // Preload both images and wait for completion
      const prefetchPromises = [Image.prefetch(blackLogoUri), Image.prefetch(whiteLogoUri)];

      await Promise.all(prefetchPromises);

      // Mark as completed
      imagesPreloaded = true;

      console.log('Logo images preloaded successfully');
    } catch (error) {
      console.warn('Failed to preload logo images:', error);
      // Still mark as completed to prevent infinite retries
      imagesPreloaded = true;
    } finally {
      preloadingPromise = null;
    }
  })();

  return preloadingPromise;
};

/**
 * Get the appropriate logo source for the current theme
 */
export const getLogoSource = (isDark: boolean) => {
  return isDark ? LOGO_IMAGES.white : LOGO_IMAGES.black;
};

/**
 * Check if logo images are preloaded
 */
export const areImagesPreloaded = (): boolean => {
  return imagesPreloaded;
};

/**
 * Reset the preload state (for development/testing)
 */
export const resetImageCache = (): void => {
  imagesPreloaded = false;
  preloadingPromise = null;
};
