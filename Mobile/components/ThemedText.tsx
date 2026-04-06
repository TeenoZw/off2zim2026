import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { Fonts, FontSizes, LineHeights } from '@/constants/Fonts';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | 'display'
    | 'title1'
    | 'title2'
    | 'title3'
    | 'headline'
    | 'sectionTitle'
    | 'body'
    | 'bodyStrong'
    | 'bodyBold'
    | 'caption'
    | 'overline'
    | 'label'
    | 'link'
    | 'default'
    | 'defaultSemiBold'
    | 'title'
    | 'subtitle';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const resolveTypeStyle = (textType: ThemedTextProps['type']) => {
    switch (textType) {
      case 'display':
        return styles.display;
      case 'title1':
      case 'title':
        return styles.title1;
      case 'title2':
        return styles.title2;
      case 'title3':
      case 'subtitle':
        return styles.title3;
      case 'headline':
        return styles.headline;
      case 'sectionTitle':
        return styles.sectionTitle;
      case 'bodyStrong':
      case 'defaultSemiBold':
        return styles.bodyStrong;
      case 'bodyBold':
        return styles.bodyBold;
      case 'caption':
        return styles.caption;
      case 'overline':
        return styles.overline;
      case 'label':
        return styles.label;
      case 'link':
        return styles.link;
      case 'body':
      case 'default':
      default:
        return styles.body;
    }
  };

  return <Text style={[{ color }, resolveTypeStyle(type), style]} {...rest} />;
}

const styles = StyleSheet.create({
  body: {
    fontSize: FontSizes.md,
    lineHeight: LineHeights.md,
    fontFamily: Fonts.regular,
  },
  bodyStrong: {
    fontSize: FontSizes.md,
    lineHeight: LineHeights.md,
    fontFamily: Fonts.medium,
  },
  bodyBold: {
    fontSize: FontSizes.md,
    lineHeight: LineHeights.md,
    fontFamily: Fonts.bold,
  },
  display: {
    fontSize: FontSizes.display,
    lineHeight: LineHeights.display,
    fontFamily: Fonts.bold,
  },
  title1: {
    fontSize: FontSizes.xxl,
    lineHeight: LineHeights.xxl,
    fontFamily: Fonts.bold,
  },
  title2: {
    fontSize: FontSizes.xl,
    lineHeight: LineHeights.xl,
    fontFamily: Fonts.bold,
  },
  title3: {
    fontSize: FontSizes.lg,
    lineHeight: LineHeights.lg,
    fontFamily: Fonts.bold,
  },
  headline: {
    fontSize: FontSizes.lg,
    lineHeight: LineHeights.lg,
    fontFamily: Fonts.bold,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    lineHeight: LineHeights.xl,
    fontFamily: Fonts.bold,
  },
  caption: {
    fontSize: FontSizes.sm,
    lineHeight: LineHeights.sm,
    fontFamily: Fonts.regular,
  },
  overline: {
    fontSize: FontSizes.xs,
    lineHeight: LineHeights.xs,
    fontFamily: Fonts.medium,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  label: {
    fontSize: FontSizes.sm,
    lineHeight: LineHeights.sm,
    fontFamily: Fonts.medium,
  },
  link: {
    lineHeight: LineHeights.md,
    fontSize: FontSizes.md,
    color: '#0a7ea4',
    fontFamily: Fonts.medium,
  },
});
