import React, { useMemo, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View, ViewProps } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Asset } from 'expo-asset';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const PATTERN_TILE_SIZE = 160; // Reduced from original for better performance

export interface WallpaperPatternProps extends Omit<ViewProps, 'children'> {
  /**
   * Pixel offset from the top before the wallpaper begins rendering.
   * Defaults to combining the device safe-area inset and a 96px header height.
   */
  offsetTop?: number;
  /**
   * Optional pixel offset from the bottom to stop rendering the wallpaper.
   */
  offsetBottom?: number;
  /**
   * Whether to render unlimited tiles without performance limits.
   */
  unlimited?: boolean;
  /**
   * Custom height for the pattern coverage. If not provided, uses screen height.
   */
  height?: number;
}

export function WallpaperPattern({
  offsetTop,
  offsetBottom = 0,
  unlimited = false,
  height,
  style,
  ...viewProps
}: WallpaperPatternProps) {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const [patternSvgString, setPatternSvgString] = useState<string | null>(null);

  const resolvedOffsetTop = useMemo(() => offsetTop ?? insets.top + 96, [offsetTop, insets.top]);

  // Load the original pattern SVG as a string
  const patternAsset = useMemo(() => Asset.fromModule(require('@/assets/images/pattern.svg')), []);

  useEffect(() => {
    const loadPatternSvg = async () => {
      try {
        if (!patternAsset.downloaded) {
          await patternAsset.downloadAsync();
        }

        // Fetch the SVG content as text
        const response = await fetch(patternAsset.localUri ?? patternAsset.uri ?? '');
        const svgText = await response.text();
        setPatternSvgString(svgText);
      } catch (error) {
        console.error('Failed to load pattern SVG:', error);
      }
    };

    loadPatternSvg();
  }, [patternAsset]);

  const patternOpacity = colorScheme === 'dark' ? 0.26 : 0.1;
  const coverageHeight = height ?? Math.max(screenHeight - resolvedOffsetTop - offsetBottom, 0);

  // Calculate how many tiles we need (but limit to reasonable number for performance unless unlimited)
  const patternColumns = unlimited
    ? Math.ceil(screenWidth / PATTERN_TILE_SIZE) + 1
    : Math.min(Math.ceil(screenWidth / PATTERN_TILE_SIZE) + 1, 6);
  const patternRows = unlimited
    ? Math.ceil(coverageHeight / PATTERN_TILE_SIZE) + 1
    : Math.min(Math.ceil(coverageHeight / PATTERN_TILE_SIZE) + 1, 10);

  // Render a limited number of your original pattern tiles
  const patternTiles = useMemo(() => {
    if (!patternSvgString) return null;

    const tiles = [];
    const totalTiles = patternRows * patternColumns;

    // Limit total tiles for performance unless unlimited
    const maxTiles = unlimited ? totalTiles : 20;
    const step = unlimited ? 1 : Math.max(1, Math.floor(totalTiles / maxTiles));

    for (let index = 0; index < totalTiles; index += step) {
      const row = Math.floor(index / patternColumns);
      const col = index % patternColumns;

      tiles.push(
        <View
          key={`${row}-${col}`}
          style={[
            styles.tile,
            {
              width: PATTERN_TILE_SIZE,
              height: PATTERN_TILE_SIZE,
              left: col * PATTERN_TILE_SIZE,
              top: row * PATTERN_TILE_SIZE,
              opacity: patternOpacity,
            },
          ]}
        >
          <SvgXml xml={patternSvgString} width="100%" height="100%" />
        </View>
      );
    }

    return tiles;
  }, [patternSvgString, patternRows, patternColumns, patternOpacity, unlimited]);

  return (
    <View
      pointerEvents="none"
      {...viewProps}
      style={[
        styles.container,
        {
          top: resolvedOffsetTop,
          bottom: offsetBottom,
        },
        style,
      ]}
    >
      {patternTiles}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    left: 0,
    right: 0,
    position: 'absolute',
  },
  tile: {
    position: 'absolute',
  },
});
