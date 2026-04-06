import React, { createContext, useContext, useState, useCallback } from 'react';

interface DrawerContextType {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

const OverlayDrawerContext = createContext<DrawerContextType>({
  isDrawerOpen: false,
  openDrawer: () => {},
  closeDrawer: () => {},
  toggleDrawer: () => {},
});

export const useOverlayDrawer = () => useContext(OverlayDrawerContext);

interface OverlayDrawerProviderProps {
  children: React.ReactNode;
}

export const OverlayDrawerProvider: React.FC<OverlayDrawerProviderProps> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    console.log('[DrawerContext] Closing drawer');
    setIsDrawerOpen(() => false);
  }, []);

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen(prev => {
      const newState = !prev;
      console.log(`[DrawerContext] Toggling drawer: ${newState ? 'open' : 'closed'}`);
      return newState;
    });
  }, []);

  return (
    <OverlayDrawerContext.Provider
      value={{
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
      }}
    >
      {children}
    </OverlayDrawerContext.Provider>
  );
};
