export type BackendDestination = {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  image_url: string | null;
  images: string[] | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  weather?: string | null;
  stays_count?: number;
  activities_count?: number;
  featured?: boolean;
  category?: string | null;
  price_range?: string | null;
  rating?: number | null;
};
