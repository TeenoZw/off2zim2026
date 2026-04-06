import type { ConfigContext, ExpoConfig } from 'expo/config';

type Variant = 'explorer' | 'provider' | 'admin';

const rawVariant = (process.env.EXPO_PUBLIC_APP_VARIANT ?? 'explorer').trim().toLowerCase();
const appVariant: Variant =
  rawVariant === 'provider' || rawVariant === 'admin' ? rawVariant : 'explorer';

const variantConfig: Record<
  Variant,
  {
    name: string;
    slug: string;
    scheme: string;
    description: string;
    iosBundleIdentifier: string;
    androidPackage: string;
    splashBackgroundColor: string;
    adaptiveBackgroundColor: string;
  }
> = {
  explorer: {
    name: 'Off2Zim',
    slug: 'off2zim',
    scheme: 'off2zim',
    description: 'Explore, book, and plan your Zimbabwe travel experience.',
    iosBundleIdentifier: 'zw.co.off2zim.explorer',
    androidPackage: 'zw.co.off2zim.explorer',
    splashBackgroundColor: '#ffffff',
    adaptiveBackgroundColor: '#ffffff',
  },
  provider: {
    name: 'Off2Zim Provider',
    slug: 'off2zim-provider',
    scheme: 'off2zim-provider',
    description: 'Manage Off2Zim listings, bookings, and business operations.',
    iosBundleIdentifier: 'zw.co.off2zim.provider',
    androidPackage: 'zw.co.off2zim.provider',
    splashBackgroundColor: '#0f0f10',
    adaptiveBackgroundColor: '#0f0f10',
  },
  admin: {
    name: 'Off2Zim Admin',
    slug: 'off2zim-admin',
    scheme: 'off2zim-admin',
    description: 'Operate Off2Zim content, bookings, and platform administration.',
    iosBundleIdentifier: 'zw.co.off2zim.admin',
    androidPackage: 'zw.co.off2zim.admin',
    splashBackgroundColor: '#171718',
    adaptiveBackgroundColor: '#171718',
  },
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const current = variantConfig[appVariant];

  return {
    ...config,
    name: current.name,
    slug: current.slug,
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: current.scheme,
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    description: current.description,
    ios: {
      bundleIdentifier: current.iosBundleIdentifier,
      supportsTablet: true,
    },
    android: {
      package: current.androidPackage,
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: current.adaptiveBackgroundColor,
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: current.splashBackgroundColor,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      appVariant,
      mobileSurface: appVariant,
      bundleIdentifier: current.iosBundleIdentifier,
      androidPackage: current.androidPackage,
    },
  };
};
