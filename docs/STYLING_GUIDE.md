# Styling Guide Documentation

This document outlines the styling approach, design system, and CSS methodologies for the Off2Zim travel platform.

## Table of Contents

1. [Design System Overview](#design-system-overview)
2. [Tailwind CSS Configuration](#tailwind-css-configuration)
3. [Color Palette](#color-palette)
4. [Typography](#typography)
5. [Spacing & Layout](#spacing--layout)
6. [Component Styling](#component-styling)
7. [Responsive Design](#responsive-design)
8. [Animation & Transitions](#animation--transitions)
9. [Dark Mode Support](#dark-mode-support)
10. [Best Practices](#best-practices)

## Design System Overview

### Design Philosophy

- **Consistency**: Unified visual language across all components
- **Scalability**: Easily maintainable and extendable styles
- **Accessibility**: WCAG 2.1 AA compliant design
- **Performance**: Optimized CSS bundle size
- **Mobile-First**: Responsive design from the ground up
- **Brand Alignment**: Reflects Off2Zim's travel-focused identity

### Technology Stack

- **Tailwind CSS**: Utility-first CSS framework
- **CSS Custom Properties**: For theme variables
- **Framer Motion**: For animations and transitions
- **PostCSS**: CSS processing and optimization
- **Autoprefixer**: Browser compatibility

## Tailwind CSS Configuration

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand Colors
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6", // Primary brand color
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        // Semantic Colors
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
          950: "#450a0a",
        },
        // Neutral Colors
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["ui-serif", "Georgia", "Cambria", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
        display: [
          "Cal Sans",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        medium:
          "0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        large:
          "0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "inner-soft": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "fade-out": "fadeOut 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "bounce-soft": "bounceSoft 0.6s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        bounceSoft: {
          "0%, 20%, 53%, 80%, 100%": { transform: "translate3d(0,0,0)" },
          "40%, 43%": { transform: "translate3d(0, -5px, 0)" },
          "70%": { transform: "translate3d(0, -3px, 0)" },
          "90%": { transform: "translate3d(0, -1px, 0)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-pattern": "url('/images/hero-pattern.svg')",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/container-queries"),
  ],
};
```

### Global CSS Variables

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Brand Colors */
  --color-brand-primary: theme("colors.brand.500");
  --color-brand-secondary: theme("colors.brand.600");

  /* Semantic Colors */
  --color-success: theme("colors.success.500");
  --color-warning: theme("colors.warning.500");
  --color-error: theme("colors.error.500");

  /* Typography */
  --font-family-primary: theme("fontFamily.sans");
  --font-family-display: theme("fontFamily.display");

  /* Shadows */
  --shadow-soft: theme("boxShadow.soft");
  --shadow-medium: theme("boxShadow.medium");
  --shadow-large: theme("boxShadow.large");

  /* Border Radius */
  --radius-base: theme("borderRadius.lg");
  --radius-large: theme("borderRadius.xl");

  /* Transitions */
  --transition-base: 0.2s ease-in-out;
  --transition-slow: 0.3s ease-in-out;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-brand-primary: theme("colors.brand.400");
    --color-brand-secondary: theme("colors.brand.500");
  }
}
```

## Color Palette

### Primary Colors

```css
/* Brand Colors - Blues for trust and reliability */
.bg-brand-50 {
  background-color: #eff6ff;
}
.bg-brand-100 {
  background-color: #dbeafe;
}
.bg-brand-500 {
  background-color: #3b82f6;
} /* Primary */
.bg-brand-600 {
  background-color: #2563eb;
} /* Hover */
.bg-brand-700 {
  background-color: #1d4ed8;
} /* Active */
```

### Semantic Colors

```css
/* Success - Greens for confirmations */
.text-success-500 {
  color: #22c55e;
}
.bg-success-50 {
  background-color: #f0fdf4;
}
.bg-success-500 {
  background-color: #22c55e;
}

/* Warning - Ambers for cautions */
.text-warning-500 {
  color: #f59e0b;
}
.bg-warning-50 {
  background-color: #fffbeb;
}
.bg-warning-500 {
  background-color: #f59e0b;
}

/* Error - Reds for errors */
.text-error-500 {
  color: #ef4444;
}
.bg-error-50 {
  background-color: #fef2f2;
}
.bg-error-500 {
  background-color: #ef4444;
}
```

### Neutral Palette

```css
/* Grays for text and backgrounds */
.text-neutral-50 {
  color: #fafafa;
}
.text-neutral-600 {
  color: #525252;
} /* Body text */
.text-neutral-900 {
  color: #171717;
} /* Headings */
.bg-neutral-50 {
  background-color: #fafafa;
}
.bg-neutral-100 {
  background-color: #f5f5f5;
}
```

### Color Usage Guidelines

```typescript
// Component color props
interface ColorProps {
  variant?: "primary" | "secondary" | "success" | "warning" | "error";
}

// Color mapping utility
const getColorClasses = (variant: string) => {
  const colorMap = {
    primary: "bg-brand-500 text-white hover:bg-brand-600",
    secondary: "bg-neutral-500 text-white hover:bg-neutral-600",
    success: "bg-success-500 text-white hover:bg-success-600",
    warning: "bg-warning-500 text-white hover:bg-warning-600",
    error: "bg-error-500 text-white hover:bg-error-600",
  };

  return colorMap[variant] || colorMap.primary;
};
```

## Typography

### Font Families

```css
/* Primary font for body text */
.font-sans {
  font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
}

/* Display font for headings */
.font-display {
  font-family: "Cal Sans", "Inter", ui-sans-serif, system-ui, sans-serif;
}

/* Monospace for code */
.font-mono {
  font-family: ui-monospace, "SFMono-Regular", "Consolas", monospace;
}
```

### Typography Scale

```css
/* Headings */
.heading-1 {
  @apply text-4xl font-bold tracking-tight text-neutral-900;
}
.heading-2 {
  @apply text-3xl font-bold tracking-tight text-neutral-900;
}
.heading-3 {
  @apply text-2xl font-semibold tracking-tight text-neutral-900;
}
.heading-4 {
  @apply text-xl font-semibold tracking-tight text-neutral-900;
}
.heading-5 {
  @apply text-lg font-semibold tracking-tight text-neutral-900;
}
.heading-6 {
  @apply text-base font-semibold tracking-tight text-neutral-900;
}

/* Body text */
.body-large {
  @apply text-lg leading-relaxed text-neutral-700;
}
.body-base {
  @apply text-base leading-relaxed text-neutral-700;
}
.body-small {
  @apply text-sm leading-relaxed text-neutral-600;
}

/* Captions and labels */
.caption {
  @apply text-xs leading-normal text-neutral-500;
}
.label {
  @apply text-sm font-medium leading-normal text-neutral-700;
}
```

### Typography Components

```typescript
// Heading component
interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

const Heading: React.FC<HeadingProps> = ({ level, children, className }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const classes = cn(
    "font-display",
    {
      "text-4xl font-bold": level === 1,
      "text-3xl font-bold": level === 2,
      "text-2xl font-semibold": level === 3,
      "text-xl font-semibold": level === 4,
      "text-lg font-semibold": level === 5,
      "text-base font-semibold": level === 6,
    },
    className
  );

  return <Tag className={classes}>{children}</Tag>;
};

// Text component
interface TextProps {
  variant?: "body" | "caption" | "label";
  size?: "sm" | "base" | "lg";
  children: React.ReactNode;
  className?: string;
}

const Text: React.FC<TextProps> = ({
  variant = "body",
  size = "base",
  children,
  className,
}) => {
  const classes = cn(
    {
      "leading-relaxed text-neutral-700": variant === "body",
      "leading-normal text-neutral-500": variant === "caption",
      "font-medium leading-normal text-neutral-700": variant === "label",
    },
    {
      "text-sm": size === "sm",
      "text-base": size === "base",
      "text-lg": size === "lg",
    },
    className
  );

  return <p className={classes}>{children}</p>;
};
```

## Spacing & Layout

### Spacing Scale

```css
/* Custom spacing utilities */
.space-x-18 > * + * {
  margin-left: 4.5rem;
}
.space-y-18 > * + * {
  margin-top: 4.5rem;
}

/* Container classes */
.container-xs {
  max-width: 480px;
  margin: 0 auto;
  padding: 0 1rem;
}
.container-sm {
  max-width: 640px;
  margin: 0 auto;
  padding: 0 1rem;
}
.container-md {
  max-width: 768px;
  margin: 0 auto;
  padding: 0 1rem;
}
.container-lg {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 1rem;
}
.container-xl {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}
.container-2xl {
  max-width: 1536px;
  margin: 0 auto;
  padding: 0 1rem;
}
```

### Layout Components

```typescript
// Container component
interface ContainerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  children: React.ReactNode;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({
  size = "xl",
  children,
  className,
}) => {
  const sizeClasses = {
    xs: "max-w-md",
    sm: "max-w-lg",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    "2xl": "max-w-7xl",
  };

  return (
    <div
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
};

// Grid component
interface GridProps {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  className?: string;
}

const Grid: React.FC<GridProps> = ({
  cols = 1,
  gap = "md",
  children,
  className,
}) => {
  const colClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-1 md:grid-cols-3 lg:grid-cols-6",
    12: "grid-cols-12",
  };

  const gapClasses = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
    xl: "gap-12",
  };

  return (
    <div className={cn("grid", colClasses[cols], gapClasses[gap], className)}>
      {children}
    </div>
  );
};
```

## Component Styling

### Button Styles

```css
/* Base button styles */
.btn-base {
  @apply inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}

/* Button variants */
.btn-primary {
  @apply btn-base bg-brand-500 text-white hover:bg-brand-600 focus:ring-brand-500;
}

.btn-secondary {
  @apply btn-base bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-500;
}

.btn-outline {
  @apply btn-base border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 focus:ring-brand-500;
}

.btn-ghost {
  @apply btn-base text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-500;
}

/* Button sizes */
.btn-sm {
  @apply px-3 py-1.5 text-sm rounded-md;
}
.btn-md {
  @apply px-4 py-2 text-sm rounded-lg;
}
.btn-lg {
  @apply px-6 py-3 text-base rounded-lg;
}
.btn-xl {
  @apply px-8 py-4 text-lg rounded-xl;
}
```

### Card Styles

```css
/* Card components */
.card {
  @apply bg-white rounded-xl shadow-soft border border-neutral-200 overflow-hidden;
}

.card-hover {
  @apply card transition-all duration-200 hover:shadow-medium hover:-translate-y-1;
}

.card-interactive {
  @apply card-hover cursor-pointer;
}

.card-header {
  @apply p-6 border-b border-neutral-200;
}

.card-body {
  @apply p-6;
}

.card-footer {
  @apply p-6 bg-neutral-50 border-t border-neutral-200;
}
```

### Form Styles

```css
/* Form elements */
.form-input {
  @apply block w-full px-3 py-2 border border-neutral-300 rounded-lg shadow-sm placeholder-neutral-400 focus:ring-brand-500 focus:border-brand-500;
}

.form-input-error {
  @apply form-input border-error-300 focus:ring-error-500 focus:border-error-500;
}

.form-label {
  @apply block text-sm font-medium text-neutral-700 mb-1;
}

.form-error {
  @apply text-sm text-error-600 mt-1;
}

.form-help {
  @apply text-sm text-neutral-500 mt-1;
}
```

## Responsive Design

### Breakpoint Strategy

```css
/* Mobile-first approach */
/* xs: 0px */
.block {
  display: block;
}

/* sm: 640px */
@media (min-width: 640px) {
  .sm\:hidden {
    display: none;
  }
  .sm\:flex {
    display: flex;
  }
}

/* md: 768px */
@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  .md\:text-lg {
    font-size: 1.125rem;
  }
}

/* lg: 1024px */
@media (min-width: 1024px) {
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }
  .lg\:px-8 {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

/* xl: 1280px */
@media (min-width: 1280px) {
  .xl\:grid-cols-4 {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* 2xl: 1536px */
@media (min-width: 1536px) {
  .\32xl\:max-w-none {
    max-width: none;
  }
}
```

### Responsive Component Patterns

```typescript
// Responsive navigation
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
```

## Animation & Transitions

### Framer Motion Configuration

```typescript
// Animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeOut" },
};

export const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.2, ease: "easeOut" },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.2, ease: "easeOut" },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Usage in components
const AnimatedCard = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    variants={fadeInUp}
    initial="initial"
    animate="animate"
    exit="exit"
    className="card"
  >
    {children}
  </motion.div>
);
```

### CSS Transitions

```css
/* Transition utilities */
.transition-base {
  transition: all 0.2s ease-in-out;
}
.transition-slow {
  transition: all 0.3s ease-in-out;
}
.transition-fast {
  transition: all 0.1s ease-in-out;
}

/* Hover effects */
.hover-lift {
  @apply transition-all duration-200;
}

.hover-lift:hover {
  @apply -translate-y-1 shadow-medium;
}

.hover-scale {
  @apply transition-transform duration-200;
}

.hover-scale:hover {
  @apply scale-105;
}
```

## Dark Mode Support

### Dark Mode Classes

```css
/* Dark mode color scheme */
.dark .bg-white {
  background-color: theme("colors.neutral.900");
}
.dark .text-neutral-900 {
  color: theme("colors.neutral.100");
}
.dark .text-neutral-700 {
  color: theme("colors.neutral.300");
}
.dark .text-neutral-500 {
  color: theme("colors.neutral.400");
}

.dark .border-neutral-200 {
  border-color: theme("colors.neutral.700");
}
.dark .border-neutral-300 {
  border-color: theme("colors.neutral.600");
}

.dark .bg-neutral-50 {
  background-color: theme("colors.neutral.800");
}
.dark .bg-neutral-100 {
  background-color: theme("colors.neutral.700");
}
```

### Theme Toggle Component

```typescript
const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
};
```

## Best Practices

### 1. CSS Organization

```css
/* Use logical property order */
.component {
  /* Display & Box Model */
  display: flex;
  position: relative;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  /* Flexbox/Grid */
  flex-direction: column;
  justify-content: center;
  align-items: center;

  /* Dimensions */
  width: 100%;
  height: auto;
  margin: 0;
  padding: 1rem;

  /* Typography */
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  color: inherit;

  /* Background & Borders */
  background: white;
  border: 1px solid #e5e5e5;
  border-radius: 0.5rem;

  /* Effects */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  opacity: 1;
  transform: none;
  transition: all 0.2s ease;
}
```

### 2. Performance Optimization

```css
/* Use transform for animations */
.animated-element {
  transform: translateZ(0); /* Enable hardware acceleration */
  will-change: transform; /* Hint to browser */
}

/* Optimize for critical rendering path */
.above-fold {
  contain: layout style paint;
}

/* Use CSS containment */
.card {
  contain: layout style paint;
}
```

### 3. Accessibility

```css
/* Focus styles */
.focus-visible:focus-visible {
  outline: 2px solid theme("colors.brand.500");
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .button {
    border: 2px solid;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 4. Utility Classes

```css
/* Common utility classes */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.aspect-ratio-16-9 {
  aspect-ratio: 16 / 9;
}
```

### 5. CSS-in-JS Integration

```typescript
// Styled components with Tailwind
const StyledButton = styled.button.attrs<{ variant: string }>(
  ({ variant }) => ({
    className: cn("btn-base", {
      "btn-primary": variant === "primary",
      "btn-secondary": variant === "secondary",
      "btn-outline": variant === "outline",
    }),
  })
)`
  /* Additional custom styles if needed */
`;

// Emotion/styled-components with Tailwind
const Button = tw.button`
  inline-flex items-center justify-center
  font-medium transition-colors
  ${({ variant }) =>
    variant === "primary"
      ? "bg-brand-500 text-white"
      : "bg-neutral-100 text-neutral-900"}
`;
```

This styling guide provides a comprehensive foundation for maintaining consistent, scalable, and performant styles across the Off2Zim platform.
