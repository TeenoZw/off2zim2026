import type { MobileAuthUser } from '@/core/auth/types';
import { buildSession, clearSession, persistSession, persistUser } from '@/core/auth/session';
import { mapApiUserToMobileAuthUser } from '@/core/auth/user';
import { apiFetch } from '@/core/http/apiClient';

type SignUpOptions = {
  explorerType?: 'local' | 'foreign';
  providerProfile?: {
    tradingName?: string | null;
    businessRegistrationNumber?: string | null;
    mainContactPerson?: string | null;
    businessPhone?: string | null;
    physicalAddress?: string | null;
  };
};

function splitFullName(fullName?: string) {
  const parts = (fullName || '').trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' '),
  };
}

export async function hydrateAuthenticatedUser() {
  const existingSession = await buildSession();
  if (!existingSession) {
    return null;
  }

  const payload = await apiFetch<{ user: any }>('/api/auth/session');
  const refreshedUser: MobileAuthUser = {
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
      phone: payload.user.profile?.phone || existingSession.user.user_metadata?.phone,
      nationality:
        payload.user.profile?.nationality ||
        payload.user.profile?.location ||
        existingSession.user.user_metadata?.nationality,
      business_name:
        payload.user.profile?.companyName || existingSession.user.user_metadata?.business_name,
      email_verified:
        payload.user.verification?.email ?? existingSession.user.user_metadata?.email_verified,
      user_type: payload.user.role === 'provider' ? 'business' : 'individual',
      rating: payload.user.explorerScore?.rating ?? 0,
    },
  };

  await persistSession(existingSession.access_token, refreshedUser);
  return {
    access_token: existingSession.access_token,
    user: refreshedUser,
  };
}

export async function registerMobileUser(
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
  options?: SignUpOptions
) {
  const { firstName, lastName } = splitFullName(fullName);
  const providerProfile = options?.providerProfile;

  const payload = await apiFetch<{
    token: string;
    user: any;
    verificationSent?: boolean;
    verificationUrl?: string;
  }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      firstName: firstName || (userType === 'business' ? 'Business' : 'Off2Zim'),
      lastName: lastName || (userType === 'business' ? 'User' : 'Explorer'),
      role: userType === 'business' ? 'provider' : 'explorer',
      explorerType: userType === 'individual' ? options?.explorerType || 'foreign' : undefined,
      companyName: userType === 'business' ? businessName || 'Off2Zim Business' : undefined,
      tradingName:
        userType === 'business'
          ? providerProfile?.tradingName || businessName || 'Off2Zim Business'
          : undefined,
      businessRegistrationNumber:
        userType === 'business' ? providerProfile?.businessRegistrationNumber || undefined : undefined,
      mainContactPerson:
        userType === 'business' ? providerProfile?.mainContactPerson || undefined : undefined,
      businessPhone:
        userType === 'business' ? providerProfile?.businessPhone || undefined : undefined,
      businessEmail: userType === 'business' ? email : undefined,
      physicalAddress:
        userType === 'business' ? providerProfile?.physicalAddress || undefined : undefined,
    }),
  });

  const nextUser = mapApiUserToMobileAuthUser(payload.user, {
    ...(individualMetadata || {}),
    explorer_type: userType === 'individual' ? options?.explorerType || 'foreign' : undefined,
    full_name: fullName || undefined,
    business_name: businessName || undefined,
    user_type: userType,
  });

  await persistSession(payload.token, nextUser);

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

  return {
    access_token: payload.token,
    user: nextUser,
    verificationSent: payload.verificationSent,
    verificationUrl: payload.verificationUrl,
  };
}

export async function signInMobileUser(email: string, password: string) {
  const payload = await apiFetch<{ token: string; user: any }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  const nextUser = mapApiUserToMobileAuthUser(payload.user);
  const nextSession = { access_token: payload.token, user: nextUser };
  await persistSession(payload.token, nextUser);
  return nextSession;
}

export async function signOutMobileUser() {
  try {
    await apiFetch('/api/auth/logout', { method: 'POST' });
  } catch {
    // Ignore logout failures and clear local auth state.
  }

  await clearSession();
}

export async function fetchMobileProfile() {
  const payload = await apiFetch<{ profile: any }>('/api/profile');
  return payload.profile;
}

export async function patchMobileProfile(updates: Record<string, any>) {
  const payload = await apiFetch<{ profile: any }>('/api/profile', {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
  return payload.profile;
}

export async function requestPasswordReset(email: string) {
  return apiFetch<{ ok: boolean; delivered?: boolean; resetUrl?: string }>(
    '/api/auth/password-reset/request',
    {
      method: 'POST',
      body: JSON.stringify({ email }),
    }
  );
}

export async function requestEmailVerification(email: string) {
  return apiFetch<{ ok: boolean; delivered?: boolean; verificationUrl?: string }>(
    '/api/auth/verify-email/request',
    {
      method: 'POST',
      body: JSON.stringify({ email }),
    }
  );
}

export async function updateMobileUserEmail(email?: string) {
  const profile = await patchMobileProfile({ email });
  const session = await buildSession();
  if (session) {
    const nextUser = {
      ...session.user,
      email: profile.email,
    };
    await persistUser(nextUser);
  }
  return session?.user ?? null;
}
