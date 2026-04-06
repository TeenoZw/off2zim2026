import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { TextStyle } from 'react-native';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export type DrawerIconConfig = {
  /** Ionicon name to render. */
  name: IoniconName;
  /** Optional override for icon size; defaults to 24. */
  size?: number;
  /** Optional style passed through to the icon. */
  style?: TextStyle;
};

type DrawerIconProps = DrawerIconConfig & {
  /** Resolved color provided by React Navigation's drawer renderer. */
  color: string;
};

/** Lightweight typed wrapper around Ionicons for drawer usage. */
export function DrawerIcon({ name, color, size = 24, style }: DrawerIconProps) {
  return <Ionicons name={name} size={size} color={color} style={style} />;
}

/** Convenience helper to satisfy React Navigation's icon signature. */
export const createDrawerIconRenderer = (config: DrawerIconConfig) => {
  const DrawerIconRenderer = ({ color }: { color: string }) => (
    <DrawerIcon color={color} {...config} />
  );

  DrawerIconRenderer.displayName = `DrawerIconRenderer(${config.name})`;

  return DrawerIconRenderer;
};
