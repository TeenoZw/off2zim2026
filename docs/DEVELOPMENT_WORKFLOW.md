# Development Workflow Documentation

This document outlines the development process, coding standards, and best practices for the Off2Zim travel platform.

## Table of Contents

1. [Development Environment Setup](#development-environment-setup)
2. [Git Workflow](#git-workflow)
3. [Code Quality Standards](#code-quality-standards)
4. [Testing Strategy](#testing-strategy)
5. [Performance Guidelines](#performance-guidelines)
6. [Security Practices](#security-practices)
7. [Code Review Process](#code-review-process)
8. [Deployment Pipeline](#deployment-pipeline)
9. [Monitoring & Debugging](#monitoring--debugging)
10. [Documentation Standards](#documentation-standards)

## Development Environment Setup

### Prerequisites

```bash
# Check required versions
node --version    # Should be 18.0 or higher
npm --version     # Should be 8.0 or higher
git --version     # Should be 2.30 or higher
```

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/your-org/off2zim.git
cd off2zim

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Generate Prisma client
npx prisma generate

# Set up database
npx prisma db push

# Seed database (optional)
npx prisma db seed

# Start development server
npm run dev
```

### VS Code Configuration

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.rulers": [80, 120],
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### Recommended Extensions

```json
// .vscode/extensions.json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "prisma.prisma",
    "ms-playwright.playwright"
  ]
}
```

### Environment Variables

```bash
# Development Environment
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/off2zim_dev"

# Authentication
NEXTAUTH_SECRET=your-development-secret
NEXTAUTH_URL=http://localhost:3000

# External APIs (development keys)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-dev-maps-key
STRIPE_SECRET_KEY=sk_test_your-dev-stripe-key
```

## Git Workflow

### Branch Strategy

```
main                    # Production-ready code
├── develop            # Integration branch
│   ├── feature/xxx    # Feature branches
│   ├── bugfix/xxx     # Bug fix branches
│   └── hotfix/xxx     # Critical fixes
└── release/x.x.x      # Release preparation
```

### Branch Naming Convention

```bash
# Feature branches
feature/hotel-booking-flow
feature/user-authentication
feature/payment-integration

# Bug fixes
bugfix/search-results-pagination
bugfix/mobile-navigation-issue

# Hotfixes
hotfix/critical-payment-bug
hotfix/security-vulnerability

# Releases
release/1.2.0
release/1.2.1
```

### Commit Message Standards

```bash
# Format: type(scope): description

# Types:
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation changes
style:    # Code style changes (formatting, etc.)
refactor: # Code refactoring
test:     # Adding or updating tests
chore:    # Maintenance tasks
perf:     # Performance improvements
ci:       # CI/CD changes

# Examples:
feat(auth): add Google OAuth integration
fix(search): resolve pagination bug on mobile
docs(api): update authentication endpoints
style(components): format button component
refactor(hooks): optimize hotel search hook
test(booking): add unit tests for booking flow
chore(deps): update dependencies to latest versions
perf(images): implement lazy loading for hotel gallery
```

### Workflow Commands

```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/new-feature-name

# Work on feature
git add .
git commit -m "feat(scope): implement new feature"
git push origin feature/new-feature-name

# Create pull request (via GitHub UI)

# Merge feature (after approval)
git checkout develop
git pull origin develop
git merge feature/new-feature-name
git push origin develop

# Clean up
git branch -d feature/new-feature-name
git push origin --delete feature/new-feature-name
```

### Pre-commit Hooks

```json
// .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests
npm run test

# Run build to catch build errors
npm run build
```

## Code Quality Standards

### ESLint Configuration

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/prefer-const": "error",
    "react/jsx-key": "error",
    "react/jsx-no-target-blank": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "newlines-between": "always"
      }
    ]
  }
}
```

### Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### TypeScript Standards

```typescript
// Use strict TypeScript configuration
interface ComponentProps {
  // Always define prop types
  title: string;
  description?: string; // Optional props clearly marked
  onClick: (id: string) => void; // Function signatures specified
  children: React.ReactNode; // Use proper React types
}

// Use generic types appropriately
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// Use enums for fixed values
enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
}

// Use utility types
type PartialBooking = Partial<Booking>;
type BookingKeys = keyof Booking;
type BookingWithoutId = Omit<Booking, "id">;
```

### Component Standards

```typescript
// Component file structure
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui";
import { useBooking } from "@/hooks";
import { BookingStatus } from "@/types";

// Types defined near usage
interface HotelCardProps {
  hotel: Hotel;
  onBook?: (hotel: Hotel) => void;
  className?: string;
}

// Component implementation
const HotelCard: React.FC<HotelCardProps> = ({ hotel, onBook, className }) => {
  // Hooks at the top
  const { createBooking, loading } = useBooking();
  const [isFavorite, setIsFavorite] = useState(false);

  // Effects after state
  useEffect(() => {
    // Load favorite status
  }, [hotel.id]);

  // Event handlers
  const handleBooking = useCallback(() => {
    onBook?.(hotel);
  }, [hotel, onBook]);

  // Early returns for loading/error states
  if (!hotel) return null;

  // Main render
  return (
    <motion.div
      className={cn("hotel-card", className)}
      whileHover={{ scale: 1.02 }}
    >
      {/* Component content */}
    </motion.div>
  );
};

// Display name for debugging
HotelCard.displayName = "HotelCard";

export default HotelCard;
```

### File Organization

```
src/
├── app/                 # Next.js app router
│   ├── (auth)/         # Route groups
│   ├── hotels/         # Hotel pages
│   └── layout.tsx      # Root layout
├── components/         # Reusable components
│   ├── ui/            # Base UI components
│   ├── features/      # Feature components
│   └── layout/        # Layout components
├── hooks/             # Custom hooks
├── lib/               # Utilities
├── store/             # State management
├── types/             # TypeScript definitions
└── utils/             # Helper functions
```

## Testing Strategy

### Unit Testing with Jest

```typescript
// components/ui/Button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button Component", () => {
  it("renders button text correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("shows loading state correctly", () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

### Integration Testing with Cypress

```typescript
// cypress/e2e/hotel-booking.cy.ts
describe("Hotel Booking Flow", () => {
  beforeEach(() => {
    cy.visit("/hotels");
  });

  it("should complete hotel booking flow", () => {
    // Search for hotels
    cy.get('[data-testid="destination-input"]').type("Paris");
    cy.get('[data-testid="search-button"]').click();

    // Select a hotel
    cy.get('[data-testid="hotel-card"]').first().click();

    // Book the hotel
    cy.get('[data-testid="book-now-button"]').click();

    // Fill booking form
    cy.get('[data-testid="guest-name"]').type("John Doe");
    cy.get('[data-testid="email"]').type("john@example.com");

    // Submit booking
    cy.get('[data-testid="submit-booking"]').click();

    // Verify success
    cy.get('[data-testid="booking-confirmation"]').should("be.visible");
  });
});
```

### API Testing

```typescript
// __tests__/api/hotels.test.ts
import { createMocks } from "node-mocks-http";
import handler from "@/pages/api/hotels";

describe("/api/hotels", () => {
  it("returns hotels list", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: { destination: "Paris" },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);

    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty("hotels");
    expect(Array.isArray(data.hotels)).toBe(true);
  });
});
```

### Testing Commands

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run specific test file
npm run test -- Button.test.tsx

# Run tests matching pattern
npm run test -- --testNamePattern="booking"
```

## Performance Guidelines

### Code Splitting

```typescript
// Lazy load components
const LazyHotelDetails = React.lazy(() => import("./HotelDetails"));
const LazyBookingForm = React.lazy(() => import("./BookingForm"));

// Usage
<Suspense fallback={<LoadingSpinner />}>
  <LazyHotelDetails hotelId={id} />
</Suspense>;
```

### Image Optimization

```typescript
// Use Next.js Image component
import Image from "next/image";

const HotelCard = ({ hotel }: { hotel: Hotel }) => (
  <div>
    <Image
      src={hotel.image}
      alt={hotel.name}
      width={400}
      height={300}
      priority={false} // Only for above-fold images
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  </div>
);
```

### Bundle Analysis

```bash
# Analyze bundle size
npm run analyze

# Check bundle composition
npx webpack-bundle-analyzer .next/static/chunks/*.js
```

### Performance Monitoring

```typescript
// Web Vitals tracking
export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log(metric);

  // Send to analytics
  if (metric.label === "web-vital") {
    gtag("event", metric.name, {
      value: Math.round(metric.value),
      event_label: metric.id,
    });
  }
}
```

## Security Practices

### Input Validation

```typescript
// Use Zod for schema validation
import { z } from "zod";

const BookingSchema = z
  .object({
    hotelId: z.string().uuid(),
    checkIn: z.date().min(new Date()),
    checkOut: z.date(),
    guests: z.number().min(1).max(10),
    email: z.string().email(),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  });

// API route validation
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const validatedData = BookingSchema.parse(req.body);
    // Process validated data
  } catch (error) {
    return res.status(400).json({ error: "Invalid input" });
  }
}
```

### Authentication Checks

```typescript
// Protect API routes
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Handle authenticated request
}
```

### Environment Variables

```typescript
// Validate environment variables
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
});

const env = envSchema.parse(process.env);
```

## Code Review Process

### Review Checklist

- [ ] **Functionality**: Does the code work as intended?
- [ ] **Performance**: Are there any performance concerns?
- [ ] **Security**: Are there any security vulnerabilities?
- [ ] **Testing**: Are appropriate tests included?
- [ ] **Documentation**: Is the code well-documented?
- [ ] **Style**: Does the code follow style guidelines?
- [ ] **Accessibility**: Are accessibility standards met?
- [ ] **Mobile**: Does it work on mobile devices?

### Pull Request Template

```markdown
## Description

Brief description of the changes.

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Accessibility testing completed

## Screenshots

Include screenshots for UI changes.

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Code is well-documented
- [ ] Tests are included
- [ ] No breaking changes
```

## Deployment Pipeline

### CI/CD Configuration

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          # Deployment commands
```

### Environment Promotion

```bash
# Development → Staging
git checkout develop
git pull origin develop
git checkout staging
git merge develop
git push origin staging

# Staging → Production
git checkout main
git merge staging
git tag v1.2.0
git push origin main --tags
```

## Monitoring & Debugging

### Error Tracking

```typescript
// Sentry configuration
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// Custom error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.captureException(error, { extra: errorInfo });
  }
}
```

### Performance Monitoring

```typescript
// Custom performance tracking
export const trackPerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();

  console.log(`${name} took ${end - start} milliseconds`);

  // Send to analytics
  gtag("event", "timing_complete", {
    name,
    value: Math.round(end - start),
  });
};
```

### Debugging Tools

```typescript
// React DevTools integration
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ =
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {};
}

// Redux DevTools for Zustand
import { devtools } from "zustand/middleware";

export const useStore = create(
  devtools(
    (set) => ({
      // Store implementation
    }),
    {
      name: "off2zim-store",
    }
  )
);
```

## Documentation Standards

### Code Documentation

````typescript
/**
 * Searches for hotels based on specified criteria
 * @param params - Search parameters including location, dates, and preferences
 * @returns Promise resolving to an array of matching hotels
 * @throws {ValidationError} When search parameters are invalid
 * @example
 * ```typescript
 * const hotels = await searchHotels({
 *   destination: 'Paris',
 *   checkIn: new Date('2024-06-01'),
 *   checkOut: new Date('2024-06-05'),
 *   guests: 2
 * });
 * ```
 */
export async function searchHotels(params: SearchParams): Promise<Hotel[]> {
  // Implementation
}
````

### README Standards

```markdown
# Component Name

Brief description of what the component does.

## Props

| Prop    | Type                     | Default   | Description          |
| ------- | ------------------------ | --------- | -------------------- |
| title   | string                   | -         | The title text       |
| variant | 'primary' \| 'secondary' | 'primary' | Visual style variant |

## Examples

### Basic Usage

\`\`\`tsx
<ComponentName title="Hello World" />
\`\`\`

### Advanced Usage

\`\`\`tsx
<ComponentName 
  title="Hello World"
  variant="secondary"
  onClick={handleClick}
/>
\`\`\`

## Accessibility

- Supports keyboard navigation
- ARIA labels included
- Screen reader compatible
```

This workflow documentation ensures consistent, high-quality development practices across the Off2Zim platform.
