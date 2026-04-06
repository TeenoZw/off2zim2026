import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import Svg, { Path } from 'react-native-svg';

const [HOUSE_VIEWBOX_WIDTH, HOUSE_VIEWBOX_HEIGHT, , , HOUSE_PATH_RAW] = faHouse.icon as [
  number,
  number,
  (string | number)[],
  string,
  string | string[],
];

const HOUSE_PATH_DATA = Array.isArray(HOUSE_PATH_RAW) ? HOUSE_PATH_RAW.join(' ') : HOUSE_PATH_RAW;
const HOUSE_STROKE_WIDTH = 48;

interface FAIconProps {
  name: string;
  solid?: boolean;
  color: string;
  size?: number;
}

// This component only implements the home icon replacement
export function FAIcon({ name, solid = true, color, size = 24 }: FAIconProps) {
  // Only handle the home icon case for now
  if (name === 'home') {
    if (solid) {
      return <FontAwesomeIcon icon={faHouse} size={size} color={color} />;
    }

    return (
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${HOUSE_VIEWBOX_WIDTH} ${HOUSE_VIEWBOX_HEIGHT}`}
      >
        <Path
          d={HOUSE_PATH_DATA}
          fill="none"
          stroke={color}
          strokeWidth={HOUSE_STROKE_WIDTH}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  // For other icons, return null (we're only replacing the home icon)
  return null;
}
