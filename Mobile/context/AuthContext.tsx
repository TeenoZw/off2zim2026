import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearAllFavorites, initFavorites } from '@/utils/favoritesUtils';
import {
  buildSession,
  MobileAuthUser,
  MobileSession,
  subscribeToAuth,
} from '@/lib/api';
import {
  fetchMobileProfile,
  hydrateAuthenticatedUser,
  patchMobileProfile,
  requestEmailVerification as requestEmailVerificationEmail,
  requestPasswordReset,
  registerMobileUser,
  signInMobileUser,
  signOutMobileUser,
} from '@/core/auth/service';

type Session = MobileSession;
type User = MobileAuthUser;

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isGuest: boolean;
  isBusinessUser: boolean;
  needsBusinessOnboarding: boolean;
  setNeedsBusinessOnboarding: (needs: boolean) => void;
  signUp: (
    email: string,
    password: string,
    fullName?: string,
    userType?: string,
    businessName?: string,
    individualMetadata?: {
      title?: string | null;
      gender?: string | null;
      id_type?: string | null;
      identity_number?: string | null;
      date_of_birth?: string | null;
      nationality?: string | null;
      phone?: string | null;
    },
    options?: {
      explorerType?: 'local' | 'foreign';
      providerProfile?: {
        tradingName?: string | null;
        businessRegistrationNumber?: string | null;
        mainContactPerson?: string | null;
        businessPhone?: string | null;
        physicalAddress?: string | null;
      };
    }
  ) => Promise<{ data: any; error: { message: string } | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ data: any; error: { message: string } | null }>;
  signOut: () => Promise<void>;
  setGuestMode: (isGuest: boolean) => void;
  resetPassword: (email: string) => Promise<any>;
  requestEmailVerification: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [needsBusinessOnboarding, setNeedsBusinessOnboarding] = useState(false);

  const isBusinessUser = useMemo(
    () => user?.user_metadata?.user_type === 'business',
    [user?.user_metadata?.user_type]
  );

  useEffect(() => {
    let mounted = true;

    const hydrateSession = async () => {
      try {
        const existingSession = await buildSession();
        if (!mounted) {
          return;
        }

        if (existingSession) {
          try {
            const nextSession = await hydrateAuthenticatedUser();
            if (!nextSession) {
              throw new Error('Unable to hydrate session');
            }
            setSession(nextSession);
            setUser(nextSession.user);
          } catch {
            await signOutMobileUser();
            setSession(null);
            setUser(null);
          }
        } else {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    hydrateSession();

    const subscription = subscribeToAuth((_event, nextSession) => {
      if (!mounted) {
        return;
      }

      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setIsGuest(prev => (nextSession?.user ? false : prev));
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      initFavorites(user.id).catch(error => {
        console.error('Failed to initialize favorites:', error);
      });
    } else {
      clearAllFavorites();
    }
  }, [user]);

  const signUp = async (
    email: string,
    password: string,
    fullName?: string,
    userType = 'individual',
    businessName?: string,
    individualMetadata?: {
      title?: string | null;
      gender?: string | null;
      id_type?: string | null;
      identity_number?: string | null;
      date_of_birth?: string | null;
      nationality?: string | null;
      phone?: string | null;
    },
    options?: {
      explorerType?: 'local' | 'foreign';
      providerProfile?: {
        tradingName?: string | null;
        businessRegistrationNumber?: string | null;
        mainContactPerson?: string | null;
        businessPhone?: string | null;
        physicalAddress?: string | null;
      };
    }
  ) => {
    try {
      const nextSession = await registerMobileUser(
        email,
        password,
        fullName,
        userType,
        businessName,
        individualMetadata,
        options
      );
      setSession(nextSession);
      setUser(nextSession.user);
      setIsGuest(false);

      return {
        data: {
          session: nextSession,
        },
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Unable to create account.',
        },
      };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const nextSession = await signInMobileUser(email, password);
      setSession(nextSession);
      setUser(nextSession.user);
      setIsGuest(false);
      return { data: { session: nextSession, user: nextSession.user }, error: null };
    } catch (error) {
      return {
        data: { session: null, user: null },
        error: {
          message: error instanceof Error ? error.message : 'Unable to sign in.',
        },
      };
    }
  };

  const signOut = async () => {
    await signOutMobileUser();
    setSession(null);
    setUser(null);
    setIsGuest(false);
    setNeedsBusinessOnboarding(false);
  };

  const setGuestMode = (guestMode: boolean) => {
    setIsGuest(guestMode);
    if (guestMode) {
      setNeedsBusinessOnboarding(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const data = await requestPasswordReset(email);
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Unable to start password reset.',
        },
      };
    }
  };

  const requestEmailVerification = async (email: string) => {
    try {
      const data = await requestEmailVerificationEmail(email);
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          message:
            error instanceof Error ? error.message : 'Unable to send verification email.',
        },
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        isGuest,
        isBusinessUser,
        needsBusinessOnboarding,
        setNeedsBusinessOnboarding,
        signUp,
        signIn,
        signOut,
        setGuestMode,
        resetPassword,
        requestEmailVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const getProfile = async (userId: string) => {
  try {
    const profile = await fetchMobileProfile();
    if (profile?.id && profile.id !== userId) {
      return { data: null, error: { message: 'Profile mismatch' } };
    }
    return { data: profile, error: null };
  } catch (error) {
    return {
      data: null,
      error: { message: error instanceof Error ? error.message : 'Unable to load profile.' },
    };
  }
};

export const updateProfile = async (_userId: string, updates: any) => {
  try {
    const profile = await patchMobileProfile(updates);
    return { data: profile, error: null };
  } catch (error) {
    return {
      data: null,
      error: { message: error instanceof Error ? error.message : 'Unable to update profile.' },
    };
  }
};
