import { TextStyle } from 'react-native';
import { Fonts } from '@/constants/Fonts';

type FontWeight = 'light' | 'regular' | 'medium' | 'bold';

/**
 * Helper function to get the correct Brandon Grotesque font family based on weight
 * Use this when you need to apply Brandon Grotesque font to a component that doesn't use ThemedText
 *
 * @param weight - The desired font weight
 * @returns TextStyle object with the correct fontFamily
 */
export function getBrandonGrotesque(weight: FontWeight = 'regular'): TextStyle {
  return {
    fontFamily: Fonts[weight],
  };
}
