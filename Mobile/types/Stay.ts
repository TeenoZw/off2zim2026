export interface StayHost {
  name: string;
  avatar: string;
  joinedYear: string;
  responseRate: string;
  responseTime: string;
}

export interface StayDetails {
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
}

export interface RoomType {
  id: string;
  name: string;
  price: number;
  maxGuests: number;
  description: string;
  amenities: string[];
  available: boolean;
  totalRooms?: number;
  availableRooms?: number;
  stayName?: string;
}

export interface Stay {
  id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  perNight?: boolean;
  rating: number;
  imageUrl?: string;
  images: string[];
  amenities: string[];
  host?: StayHost;
  details?: StayDetails;
  roomTypes?: RoomType[];
  providerLogo?: string;
  providerName?: string;
  providerId?: string;
  phone?: string;
  fullLocation?: string;
  totalReviews?: number;
  checkInTime?: string;
  checkOutTime?: string;
}
