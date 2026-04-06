import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { clearAllFavorites, initFavorites } from '@/utils/favoritesUtils';
import { apiFetch, buildSession, clearSession, persistSession } from '@/lib/api';
import { Session, supabase, User } from '@/lib/supabase';

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
    }
  ) => Promise<{ data: any; error: { message: string } | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ data: any; error: { message: string } | null }>;
  signOut: () => Promise<void>;
  setGuestMode: (isGuest: boolean) => void;
  resetPassword: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function splitFullName(fullName?: string) {
  const parts = (fullName || '').trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' '),
  };
}

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
            const payload = await apiFetch<{ user: any }>('/api/auth/session');
            const refreshedUser: User = {
              ...existingSession.user,
              email: payload.user.email,
              user_metadata: {
                ...existingSession.user.user_metadata,
                full_name:
                  payload.user.profile?.fullName ||
                  payload.user.name ||
                  existingSession.user.user_metadata?.full_name,
                first_name: payload.user.firstName,
                last_name: payload.user.lastName,
                phone:
                  payload.user.profile?.phone ||
                  existingSession.user.user_metadata?.phone,
                nationality:
                  payload.user.profile?.nationality ||
                  payload.user.profile?.location ||
                  existingSession.user.user_metadata?.nationality,
                business_name:
                  payload.user.profile?.companyName ||
                  existingSession.user.user_metadata?.business_name,
                user_type: payload.user.role === 'provider' ? 'business' : 'individual',
                rating: payload.user.explorerScore?.rating ?? 0,
              },
            };

            const nextSession = {
              access_token: existingSession.access_token,
              user: refreshedUser,
            };
            setSession(nextSession);
            setUser(refreshedUser);
            await persistSession(existingSession.access_token, refreshedUser);
          } catch {
            await clearSession();
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
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
    }
  ) => {
    const { firstName, lastName } = splitFullName(fullName);

    try {
      const payload = await apiFetch<{ token: string; user: any }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          firstName: firstName || (userType === 'business' ? 'Business' : 'Off2Zim'),
          lastName: lastName || (userType === 'business' ? 'User' : 'Explorer'),
          role: userType === 'business' ? 'provider' : 'explorer',
          explorerType: 'foreign',
          companyName: userType === 'business' ? businessName || 'Off2Zim Business' : undefined,
          tradingName: userType === 'business' ? businessName || 'Off2Zim Business' : undefined,
          businessRegistrationNumber: userType === 'business' ? 'PENDING' : undefined,
          mainContactPerson: userType === 'business' ? fullName || 'Business User' : undefined,
          businessPhone: userType === 'business' ? individualMetadata?.phone || '+263000000000' : undefined,
          businessEmail: userType === 'business' ? email : undefined,
          physicalAddress: userType === 'business' ? 'Pending address' : undefined,
        }),
      });

      const signedIn = await supabase.auth.signInWithPassword({ email, password });
      if (!signedIn.error) {
        const mergedMetadata = {
          ...(signedIn.data.user?.user_metadata || {}),
          ...(individualMetadata || {}),
          full_name: fullName || signedIn.data.user?.user_metadata?.full_name,
          business_name: businessName || signedIn.data.user?.user_metadata?.business_name,
          user_type: userType,
        };

        const nextUser = {
          ...(signedIn.data.user as User),
          user_metadata: mergedMetadata,
        };
        await persistSession(payload.token, nextUser);
        setSession({ access_token: payload.token, user: nextUser });
        setUser(nextUser);
        setIsGuest(false);

        if (individualMetadata) {
          await apiFetch('/api/profile', {
            method: 'PATCH',
            body: JSON.stringify({
              full_name: fullName,
              business_name: businessName || null,
              phone: individualMetadata.phone || null,
              user_type: userType,
              title: individualMetadata.title || null,
              gender: individualMetadata.gender || null,
              id_type: individualMetadata.id_type || null,
              identity_number: individualMetadata.identity_number || null,
              date_of_birth: individualMetadata.date_of_birth || null,
              nationality: individualMetadata.nationality || null,
            }),
          });
        }
      }

      return {
        data: {
          session: { access_token: payload.token, user: user || null },
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
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (!result.error && result.data.session) {
      setSession(result.data.session);
      setUser(result.data.user);
      setIsGuest(false);
    }
    return result;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
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
    return supabase.auth.resetPasswordForEmail(email);
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
    const payload = await apiFetch<{ profile: any }>('/api/profile');
    if (payload.profile?.id && payload.profile.id !== userId) {
      return { data: null, error: { message: 'Profile mismatch' } };
    }
    return { data: payload.profile, error: null };
  } catch (error) {
    return {
      data: null,
      error: { message: error instanceof Error ? error.message : 'Unable to load profile.' },
    };
  }
};

export const updateProfile = async (_userId: string, updates: any) => {
  try {
    const payload = await apiFetch<{ profile: any }>('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return { data: payload.profile, error: null };
  } catch (error) {
    return {
      data: null,
      error: { message: error instanceof Error ? error.message : 'Unable to update profile.' },
    };
  }
};
