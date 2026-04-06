# Brandon Grotesque Font Implementation

This project uses Brandon Grotesque as the primary font family across the entire application.

## Font Files

The following Brandon Grotesque font files should be placed in the `/assets/fonts/BrandonGrotesque/` directory:

- brandon-grotesque-light.otf
- brandon-grotesque-regular.otf
- brandon-grotesque-medium.otf
- brandon-grotesque-bold.otf

Optional companions for italic, thin, or black weights can live alongside the
core files. Keep the lowercase-hyphenated naming convention
(`brandon-grotesque-bold-italic.otf`, `brandon-grotesque-thin.otf`, and so on)
so that they can be wired up easily if we expand the font map.

**Licensing:** Brandon Grotesque remains a commercial typeface. Keep the real
OTF files in your local environment or private distribution channels that comply
with the licence terms; the Git repository should continue to ship without the
commercial binaries.

> If the fonts are missing or invalid, the app now falls back to the platform system font so the UI continues to load. Install the licensed Brandon Grotesque files to see the intended typography.

## Using the Fonts

### In ThemedText Components

The `ThemedText` component has been updated to automatically use Brandon Grotesque. Use it with the appropriate `type` prop:

```tsx
import { ThemedText } from '@/components/ThemedText';

// Regular text
<ThemedText>This uses Brandon Grotesque Regular</ThemedText>

// Bold title
<ThemedText type="title">This uses Brandon Grotesque Bold</ThemedText>

// Medium weight
<ThemedText type="defaultSemiBold">This uses Brandon Grotesque Medium</ThemedText>
```

### In Other Text Components

Brandon Grotesque is now applied globally. Every `Text` and `TextInput` instance receives Brandon Regular by default, and any `fontWeight` value is automatically translated to the matching Brandon Grotesque variant. No additional wiring is required when you need bold or medium weights—just keep using `fontWeight` as usual.

If you ever need to opt into a specific variant manually (for example, inside custom components that bypass our global override), you can fall back to the `getBrandonGrotesque` helper:

```tsx
import { Text } from 'react-native';
import { getBrandonGrotesque } from '@/utils/fontUtils';

<Text style={[getBrandonGrotesque('bold'), { fontSize: 20 }]}>Bold Text</Text>;
```

## Fonts Constants

The font family, sizes, and line heights are centralized in `/constants/Fonts.ts`. Modify this file if you need to adjust font sizes or add new variants.
