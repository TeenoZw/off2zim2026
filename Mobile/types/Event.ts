// Event type definition - mirrors Stay structure but for events

export interface Event {
  id: string;
  name: string;
  location: string;
  venue: string;
  date: string; // ISO format
  time: string; // e.g., "18:00"
  endTime?: string; // Optional end time
  images: string[];
  description: string;
  rating: number;
  totalRatings: number;
  ticketPrice: number;
  currency: string;
  ticketTypes: TicketType[];
  category: string; // e.g., "Music", "Sports", "Festival", "Cultural"
  tags: string[]; // e.g., ["Live Music", "Outdoor", "Family Friendly"]
  organizer: {
    name: string;
    contact: string;
    verified: boolean;
  };
  capacity?: number;
  ticketsAvailable?: number;
  featured?: boolean;
  ageRestriction?: string; // e.g., "18+", "All Ages"
  accessibility?: string[]; // e.g., ["Wheelchair Accessible", "Sign Language Interpreter"]

  // Service Provider Info (matches Stay structure)
  providerId?: string;
  providerName?: string;
  providerLogo?: string;
}

export interface TicketType {
  id: string;
  name: string; // e.g., "General Admission", "VIP", "Early Bird"
  price: number;
  description?: string;
  available: number;
  perks?: string[]; // e.g., ["Free Drink", "Meet & Greet"]
}
