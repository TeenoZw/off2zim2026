export type DestinationWeatherKey =
  | "Eastern Highlands"
  | "Harare"
  | "Victoria Falls"
  | "Kariba"
  | "Hwange"
  | "Hwange National Park"
  | "Great Zimbabwe"
  | "Lake Kariba"
  | "Mana Pools"
  | "Matobo Hills";

export interface DestinationWeatherLocation {
  name: DestinationWeatherKey;
  latitude: number;
  longitude: number;
}

export const destinationWeatherLocations: Record<
  DestinationWeatherKey,
  DestinationWeatherLocation
> = {
  "Eastern Highlands": {
    name: "Eastern Highlands",
    latitude: -18.1783,
    longitude: 32.7459,
  },
  Harare: {
    name: "Harare",
    latitude: -17.8252,
    longitude: 31.0335,
  },
  "Victoria Falls": {
    name: "Victoria Falls",
    latitude: -17.9243,
    longitude: 25.8572,
  },
  Kariba: {
    name: "Kariba",
    latitude: -16.5167,
    longitude: 28.8,
  },
  Hwange: {
    name: "Hwange",
    latitude: -18.6299,
    longitude: 26.4793,
  },
  "Hwange National Park": {
    name: "Hwange National Park",
    latitude: -18.7467,
    longitude: 26.95,
  },
  "Great Zimbabwe": {
    name: "Great Zimbabwe",
    latitude: -20.2675,
    longitude: 30.9333,
  },
  "Lake Kariba": {
    name: "Lake Kariba",
    latitude: -16.5294,
    longitude: 28.8031,
  },
  "Mana Pools": {
    name: "Mana Pools",
    latitude: -15.743,
    longitude: 29.346,
  },
  "Matobo Hills": {
    name: "Matobo Hills",
    latitude: -20.5,
    longitude: 28.5,
  },
};

export function getDestinationWeatherLocation(location: string) {
  return destinationWeatherLocations[location as DestinationWeatherKey] ?? null;
}
