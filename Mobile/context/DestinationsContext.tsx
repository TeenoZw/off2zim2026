import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type DatabaseDestination = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  stays_count?: number;
  activities_count?: number;
  weather?: string;
};

type DestinationsContextType = {
  destinations: DatabaseDestination[];
  setDestinations: (destinations: DatabaseDestination[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

const DestinationsContext = createContext<DestinationsContextType | undefined>(undefined);

export function DestinationsProvider({ children }: { children: ReactNode }) {
  const [destinations, setDestinations] = useState<DatabaseDestination[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <DestinationsContext.Provider
      value={{
        destinations,
        setDestinations,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </DestinationsContext.Provider>
  );
}

export function useDestinations() {
  const context = useContext(DestinationsContext);
  if (context === undefined) {
    throw new Error('useDestinations must be used within a DestinationsProvider');
  }
  return context;
}
