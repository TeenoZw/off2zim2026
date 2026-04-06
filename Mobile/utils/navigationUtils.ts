import { router } from 'expo-router';

import type { Stay } from '@/types/Stay';

export function goBackToDestination(destId: string | string[] | undefined) {
  const normalizedId = Array.isArray(destId) ? destId[0] : destId;

  if (typeof router.canGoBack === 'function' && router.canGoBack()) {
    router.back();
    return;
  }

  if (normalizedId) {
    router.replace({
      pathname: '/screens/DestinationDetail',
      params: { destinationId: normalizedId },
    });
  } else {
    router.replace('/');
  }
}

type NormalizedDestinationId = string | undefined;

function normalizeDestinationId(destinationId?: string | string[]): NormalizedDestinationId {
  if (Array.isArray(destinationId)) {
    return destinationId[0];
  }

  return destinationId;
}

interface NavigateToStayProfileOptions {
  source?: string;
  destinationId?: string | string[];
  location?: string;
  stayDataOverride?: Partial<Stay> & Record<string, unknown>;
}

export function navigateToStayProfile(
  stay: Stay | null | undefined,
  { source, destinationId, location, stayDataOverride }: NavigateToStayProfileOptions = {}
) {
  if (!stay) {
    console.warn('navigateToStayProfile called without a stay payload. Navigation aborted.');
    return;
  }

  const payload: Record<string, unknown> = {
    ...stay,
    perNight: stay.perNight ?? true,
    imageUrl: stay.imageUrl ?? stay.images?.[0],
    ...stayDataOverride,
  };

  router.push({
    pathname: '/stay-profile',
    params: {
      stayId: stay.id,
      stayData: JSON.stringify(payload),
      source,
      destinationId: normalizeDestinationId(destinationId),
      location,
    },
  });
}
