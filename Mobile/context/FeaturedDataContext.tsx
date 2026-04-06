import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type CarouselItem = {
  id: string;
  image: { uri: string };
  title: string;
  location: string;
};

type DatabaseDestination = {
  id: string;
  name: string;
  country: string;
  description: string | null;
  image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  display_order: number | null;
  created_at: string;
};

type FeaturedDataContextType = {
  carouselData: CarouselItem[];
  destinationsData: DatabaseDestination[];
  setCarouselData: (data: CarouselItem[]) => void;
  setDestinationsData: (data: DatabaseDestination[]) => void;
  clearCache: () => void;
};

const FeaturedDataContext = createContext<FeaturedDataContextType | undefined>(undefined);

export function FeaturedDataProvider({ children }: { children: ReactNode }) {
  const [carouselData, setCarouselData] = useState<CarouselItem[]>([]);
  const [destinationsData, setDestinationsData] = useState<DatabaseDestination[]>([]);

  const clearCache = useCallback(() => {
    setCarouselData([]);
    setDestinationsData([]);
  }, []);

  return (
    <FeaturedDataContext.Provider
      value={{
        carouselData,
        destinationsData,
        setCarouselData,
        setDestinationsData,
        clearCache,
      }}
    >
      {children}
    </FeaturedDataContext.Provider>
  );
}

export function useFeaturedData() {
  const context = useContext(FeaturedDataContext);
  if (context === undefined) {
    throw new Error('useFeaturedData must be used within a FeaturedDataProvider');
  }
  return context;
}
