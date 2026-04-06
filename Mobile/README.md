# Off2Zim Mobile

This mobile workspace now supports three audience-specific app variants on one shared backend:

- `explorer` for customers and trip planning
- `provider` for service providers and listing operations
- `admin` for platform operations

## Local development

Run the explorer app:

```bash
npm run start:explorer
```

Run the provider app:

```bash
npm run start:provider
```

Run the admin app:

```bash
npm run start:admin
```

You can also target simulators directly:

```bash
npm run ios:explorer
npm run ios:provider
npm run android:explorer
npm run android:provider
```

## Variant control

The mobile surface is controlled by:

```bash
EXPO_PUBLIC_APP_VARIANT=explorer
EXPO_PUBLIC_APP_VARIANT=provider
EXPO_PUBLIC_APP_VARIANT=admin
```

Variant config is resolved in:

- [Mobile/app.config.ts](/Users/tinotendamutami/Off2Zim/off2zim-v.3/Mobile/app.config.ts)
- [Mobile/config/appVariant.ts](/Users/tinotendamutami/Off2Zim/off2zim-v.3/Mobile/config/appVariant.ts)

## Build profiles

EAS profiles are defined in [Mobile/eas.json](/Users/tinotendamutami/Off2Zim/off2zim-v.3/Mobile/eas.json).

Examples:

```bash
eas build --platform ios --profile explorer-production
eas build --platform ios --profile provider-production
eas build --platform android --profile explorer-production
eas build --platform android --profile provider-production
```

## App identities

Each app variant gets its own identifiers:

- Explorer
  - iOS: `zw.co.off2zim.explorer`
  - Android: `zw.co.off2zim.explorer`
- Provider
  - iOS: `zw.co.off2zim.provider`
  - Android: `zw.co.off2zim.provider`
- Admin
  - iOS: `zw.co.off2zim.admin`
  - Android: `zw.co.off2zim.admin`

This keeps explorer and provider releases independent while preserving a shared backend, auth model, and service layer.
