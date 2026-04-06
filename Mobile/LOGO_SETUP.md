# Logo Files Setup

Please add your logo files to the assets/images directory:

1. `logo_black.png` - This will be used for light theme (black logo on light background)
2. `logo_white.png` - This will be used for dark theme (white logo on dark background)

The logo component will automatically:

- Use `logo_black.png` when the app is in light mode
- Use `logo_white.png` when the app is in dark mode
- Maintain aspect ratio while scaling to the specified height
- Center-align the logo in the header

## Logo Sizing:

- Small: 24px height
- Medium: 32px height (used in header)
- Large: 40px height

The width will be automatically calculated based on the logo's aspect ratio.
