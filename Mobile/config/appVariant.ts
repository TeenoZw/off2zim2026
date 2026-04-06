import type { MobileAuthUser } from '@/core/auth/types';

export type MobileAppVariant = 'explorer' | 'provider' | 'admin';
export type MobileAppHref = '/(tabs)' | '/provider/dashboard' | '/admin/content-review';

type VariantConfig = {
  id: MobileAppVariant;
  label: string;
  appName: string;
  appSlug: string;
  appScheme: string;
  authTitle: string;
  authSubtitle: string;
  allowGuest: boolean;
  allowSelfSignup: boolean;
  defaultUserType: 'individual' | 'business';
  showAccountTypeSwitch: boolean;
  postAuthRoute: MobileAppHref;
};

const variant = (process.env.EXPO_PUBLIC_APP_VARIANT?.trim().toLowerCase() ||
  'explorer') as MobileAppVariant;

export const mobileAppVariant: MobileAppVariant =
  variant === 'provider' || variant === 'admin' ? variant : 'explorer';

export const mobileVariantConfig: Record<MobileAppVariant, VariantConfig> = {
  explorer: {
    id: 'explorer',
    label: 'Explorer',
    appName: 'Off2Zim',
    appSlug: 'off2zim',
    appScheme: 'off2zim',
    authTitle: 'Explore Zimbabwe',
    authSubtitle: 'Sign in to save favorites, plan trips, and manage bookings.',
    allowGuest: true,
    allowSelfSignup: true,
    defaultUserType: 'individual',
    showAccountTypeSwitch: true,
    postAuthRoute: '/(tabs)',
  },
  provider: {
    id: 'provider',
    label: 'Service Provider',
    appName: 'Off2Zim Provider',
    appSlug: 'off2zim-provider',
    appScheme: 'off2zim-provider',
    authTitle: 'Manage your business',
    authSubtitle: 'Sign in to manage listings, bookings, and verification.',
    allowGuest: false,
    allowSelfSignup: true,
    defaultUserType: 'business',
    showAccountTypeSwitch: false,
    postAuthRoute: '/provider/dashboard',
  },
  admin: {
    id: 'admin',
    label: 'Administrator',
    appName: 'Off2Zim Admin',
    appSlug: 'off2zim-admin',
    appScheme: 'off2zim-admin',
    authTitle: 'Operations access',
    authSubtitle: 'Secure sign in for admin operations and platform oversight.',
    allowGuest: false,
    allowSelfSignup: false,
    defaultUserType: 'business',
    showAccountTypeSwitch: false,
    postAuthRoute: '/admin/content-review',
  },
};

export function getMobileVariantConfig() {
  return mobileVariantConfig[mobileAppVariant];
}

export function getMobilePostAuthRoute(
  user?: MobileAuthUser | null,
  isGuest = false
): MobileAppHref {
  if (isGuest) {
    return '/(tabs)';
  }

  if (mobileAppVariant === 'admin') {
    return mobileVariantConfig.admin.postAuthRoute;
  }

  if (mobileAppVariant === 'provider') {
    return mobileVariantConfig.provider.postAuthRoute;
  }

  if (user?.user_metadata?.user_type === 'business') {
    return mobileVariantConfig.provider.postAuthRoute;
  }

  return mobileVariantConfig.explorer.postAuthRoute;
}
