# Font Installation Instructions

To install the Brandon Grotesque fonts:

1. Create a folder at `assets/fonts/BrandonGrotesque/` if it doesn't already exist

2. Place the following core OTF files in the folder:
   - brandon-grotesque-light.otf
   - brandon-grotesque-regular.otf
   - brandon-grotesque-medium.otf
   - brandon-grotesque-bold.otf

   The repository also recognises the matching italic and extended weights (black/thin).
   If you licence those files, drop them in the same folder following the same
   lowercase-hyphenated naming convention (for example
   `brandon-grotesque-bold-italic.otf`). They will be available for future use if
   you decide to map additional weights in the app.

3. Restart your Expo development server with:

   ```
   npm start -- --reset-cache
   ```

4. The fonts will be loaded when the app starts, as configured in `app/_layout.tsx`
