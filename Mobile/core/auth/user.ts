import type { MobileAuthUser } from '@/core/auth/types';

export function mapApiUserToMobileAuthUser(
  rawUser: any,
  overrides?: Partial<MobileAuthUser['user_metadata']>
): MobileAuthUser {
  return {
    id: rawUser.id,
    email: rawUser.email,
    user_metadata: {
      full_name:
        rawUser.profile?.fullName ||
        rawUser.name ||
        [rawUser.firstName, rawUser.lastName].filter(Boolean).join(' ').trim(),
      first_name: rawUser.firstName,
      last_name: rawUser.lastName,
      phone: rawUser.profile?.phone,
      nationality: rawUser.profile?.nationality || rawUser.profile?.location,
      business_name: rawUser.profile?.companyName,
      explorer_type: rawUser.explorerType,
      email_verified: rawUser.verification?.email ?? false,
      user_type: rawUser.role === 'provider' ? 'business' : 'individual',
      avatar_url: rawUser.avatar,
      title: rawUser.profile?.title,
      gender: rawUser.profile?.gender,
      id_type: rawUser.profile?.idType,
      identity_number: rawUser.profile?.identityNumber,
      date_of_birth: rawUser.profile?.dateOfBirth,
      rating: rawUser.explorerScore?.rating ?? 0,
      ...(overrides || {}),
    },
  };
}
