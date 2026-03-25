# Technical Requirements Documentation

This document outlines all technical requirements, dependencies, and setup instructions for the Off2Zim travel platform.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Technology Stack](#technology-stack)
3. [Dependencies](#dependencies)
4. [Environment Setup](#environment-setup)
5. [Database Requirements](#database-requirements)
6. [API Requirements](#api-requirements)
7. [Security Requirements](#security-requirements)
8. [Performance Requirements](#performance-requirements)
9. [Browser Compatibility](#browser-compatibility)
10. [Deployment Requirements](#deployment-requirements)

## System Requirements

### Development Environment

- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (or Yarn 1.22+)
- **Git**: Version 2.30 or higher
- **VS Code**: Recommended IDE with extensions
- **RAM**: Minimum 8GB, Recommended 16GB
- **Storage**: Minimum 10GB free space
- **OS**: Windows 10+, macOS 10.15+, or Ubuntu 20.04+

### Production Environment

- **Node.js Runtime**: Version 18 LTS
- **Memory**: Minimum 2GB RAM per instance
- **CPU**: 2+ cores recommended
- **Storage**: SSD with 50GB+ available space
- **Network**: High-speed internet connection
- **SSL Certificate**: Required for HTTPS

## Technology Stack

### Frontend Framework

```json
{
  "framework": "Next.js",
  "version": "14.0+",
  "renderingStrategy": "SSR/SSG",
  "appRouter": true,
  "typescript": true
}
```

### Core Dependencies

```json
{
  "react": "^18.2.0",
  "next": "^14.0.0",
  "typescript": "^5.0.0",
  "@types/react": "^18.2.0",
  "@types/node": "^20.0.0"
}
```

### UI Framework

```json
{
  "@relume_io/relume-ui": "latest",
  "tailwindcss": "^3.3.0",
  "framer-motion": "^10.16.0",
  "react-icons": "^4.11.0",
  "lucide-react": "^0.290.0"
}
```

### State Management

```json
{
  "zustand": "^4.4.0",
  "react-query": "^3.39.0",
  "swr": "^2.2.0"
}
```

### Form Handling

```json
{
  "react-hook-form": "^7.45.0",
  "zod": "^3.22.0",
  "@hookform/resolvers": "^3.3.0"
}
```

### Date & Time

```json
{
  "date-fns": "^2.30.0",
  "react-datepicker": "^4.17.0"
}
```

### Maps & Location

```json
{
  "@googlemaps/react-wrapper": "^1.1.0",
  "react-map-gl": "^7.1.0",
  "mapbox-gl": "^2.15.0"
}
```

### Image Handling

```json
{
  "next-image": "built-in",
  "react-image-gallery": "^1.3.0",
  "react-photo-view": "^1.2.0"
}
```

### Animation & Effects

```json
{
  "framer-motion": "^10.16.0",
  "react-spring": "^9.7.0",
  "react-intersection-observer": "^9.5.0"
}
```

## Dependencies

### Package.json Configuration

```json
{
  "name": "off2zim-travel-platform",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "analyze": "cross-env ANALYZE=true next build",
    "clean": "rimraf .next out dist"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0",
    "typescript": "^5.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/node": "^20.0.0",
    "@relume_io/relume-ui": "latest",
    "tailwindcss": "^3.3.0",
    "framer-motion": "^10.16.0",
    "react-icons": "^4.11.0",
    "lucide-react": "^0.290.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^4.35.0",
    "swr": "^2.2.0",
    "react-hook-form": "^7.45.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "date-fns": "^2.30.0",
    "react-datepicker": "^4.17.0",
    "@googlemaps/react-wrapper": "^1.1.0",
    "react-map-gl": "^7.1.0",
    "mapbox-gl": "^2.15.0",
    "react-image-gallery": "^1.3.0",
    "react-photo-view": "^1.2.0",
    "react-spring": "^9.7.0",
    "react-intersection-observer": "^9.5.0",
    "axios": "^1.5.0",
    "stripe": "^13.9.0",
    "@stripe/stripe-js": "^2.1.0",
    "react-stripe-js": "^2.4.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.0",
    "next-auth": "^4.23.0",
    "prisma": "^5.4.0",
    "@prisma/client": "^5.4.0",
    "nodemailer": "^6.9.0",
    "sharp": "^0.32.0"
  },
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "@types/jsonwebtoken": "^9.0.0",
    "@types/bcryptjs": "^2.4.0",
    "@types/nodemailer": "^6.4.0",
    "@typescript-eslint/eslint-plugin": "^6.7.0",
    "@typescript-eslint/parser": "^6.7.0",
    "eslint": "^8.49.0",
    "eslint-config-next": "^14.0.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "prettier": "^3.0.0",
    "prettier-plugin-tailwindcss": "^0.5.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "cross-env": "^7.0.0",
    "rimraf": "^5.0.0",
    "@next/bundle-analyzer": "^14.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### Installation Commands

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

## Environment Setup

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Off2Zim
NODE_ENV=development

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/off2zim"
DIRECT_URL="postgresql://username:password@localhost:5432/off2zim"

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret

# Payment Providers
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Map APIs
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token

# External APIs
BOOKING_API_KEY=your-booking-api-key
AMADEUS_API_KEY=your-amadeus-key
AMADEUS_API_SECRET=your-amadeus-secret
WEATHER_API_KEY=your-weather-api-key
CURRENCY_API_KEY=your-currency-api-key

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
NEXT_PUBLIC_GTAG_ID=your-gtag-id

# Error Tracking
SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### Development Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:turbo": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "test": "jest --passWithNoTests",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

## Database Requirements

### Database Schema (Prisma)

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  phone     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  bookings     Booking[]
  reviews      Review[]
  favorites    Favorite[]
  preferences  UserPreference?

  @@map("users")
}

model Hotel {
  id          String   @id @default(cuid())
  name        String
  description String?
  address     String
  city        String
  country     String
  latitude    Float?
  longitude   Float?
  starRating  Int?
  priceRange  String?
  amenities   String[]
  images      String[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  rooms       Room[]
  bookings    Booking[]
  reviews     Review[]
  favorites   Favorite[]

  @@map("hotels")
}

model Room {
  id          String   @id @default(cuid())
  hotelId     String
  name        String
  description String?
  capacity    Int
  pricePerNight Float
  amenities   String[]
  images      String[]
  available   Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  hotel       Hotel      @relation(fields: [hotelId], references: [id])
  bookings    Booking[]

  @@map("rooms")
}

model Activity {
  id           String   @id @default(cuid())
  title        String
  description  String?
  category     String
  duration     Int      // in minutes
  difficulty   String
  pricePerPerson Float
  maxParticipants Int
  location     String
  latitude     Float?
  longitude    Float?
  inclusions   String[]
  exclusions   String[]
  images       String[]
  available    Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relations
  bookings     Booking[]
  reviews      Review[]
  favorites    Favorite[]

  @@map("activities")
}

model Booking {
  id           String      @id @default(cuid())
  userId       String
  type         BookingType
  status       BookingStatus @default(PENDING)
  checkIn      DateTime?
  checkOut     DateTime?
  guests       Int
  totalAmount  Float
  paymentStatus PaymentStatus @default(PENDING)
  paymentId    String?

  // Polymorphic relations
  hotelId      String?
  roomId       String?
  activityId   String?

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  // Relations
  user         User      @relation(fields: [userId], references: [id])
  hotel        Hotel?    @relation(fields: [hotelId], references: [id])
  room         Room?     @relation(fields: [roomId], references: [id])
  activity     Activity? @relation(fields: [activityId], references: [id])

  @@map("bookings")
}

model Review {
  id        String   @id @default(cuid())
  userId    String
  rating    Int      @db.SmallInt
  comment   String?

  // Polymorphic relations
  hotelId   String?
  activityId String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  user      User      @relation(fields: [userId], references: [id])
  hotel     Hotel?    @relation(fields: [hotelId], references: [id])
  activity  Activity? @relation(fields: [activityId], references: [id])

  @@map("reviews")
}

model Favorite {
  id        String   @id @default(cuid())
  userId    String

  // Polymorphic relations
  hotelId   String?
  activityId String?

  createdAt DateTime @default(now())

  // Relations
  user      User      @relation(fields: [userId], references: [id])
  hotel     Hotel?    @relation(fields: [hotelId], references: [id])
  activity  Activity? @relation(fields: [activityId], references: [id])

  @@unique([userId, hotelId])
  @@unique([userId, activityId])
  @@map("favorites")
}

model UserPreference {
  id              String   @id @default(cuid())
  userId          String   @unique
  currency        String   @default("USD")
  language        String   @default("en")
  notifications   Json?
  privacySettings Json?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  user            User     @relation(fields: [userId], references: [id])

  @@map("user_preferences")
}

enum BookingType {
  HOTEL
  ACTIVITY
  RESTAURANT
  EVENT
  TRANSPORT
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}
```

### Database Setup Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Run migrations
npx prisma migrate dev --name init

# Open Prisma Studio
npx prisma studio

# Seed database
npx prisma db seed
```

## API Requirements

### REST API Endpoints

```typescript
// Authentication
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
PUT  /api/auth/profile

// Hotels
GET    /api/hotels
GET    /api/hotels/search
GET    /api/hotels/:id
POST   /api/hotels/:id/book
GET    /api/hotels/:id/rooms
GET    /api/hotels/:id/reviews
POST   /api/hotels/:id/reviews

// Activities
GET    /api/activities
GET    /api/activities/search
GET    /api/activities/:id
POST   /api/activities/:id/book
GET    /api/activities/categories

// Bookings
GET    /api/bookings
GET    /api/bookings/:id
PUT    /api/bookings/:id
DELETE /api/bookings/:id
POST   /api/bookings/:id/cancel

// Payments
POST   /api/payments/intent
POST   /api/payments/confirm
GET    /api/payments/:id

// Reviews
GET    /api/reviews
POST   /api/reviews
PUT    /api/reviews/:id
DELETE /api/reviews/:id

// User Management
GET    /api/users/profile
PUT    /api/users/profile
GET    /api/users/bookings
GET    /api/users/favorites
POST   /api/users/favorites
DELETE /api/users/favorites/:id

// Search
GET    /api/search/destinations
GET    /api/search/suggestions
POST   /api/search/save
```

### External API Integrations

```typescript
// Google Maps API
interface GoogleMapsConfig {
  apiKey: string;
  libraries: ["places", "geometry"];
  version: "weekly";
}

// Stripe Payment API
interface StripeConfig {
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
}

// Booking.com API
interface BookingAPI {
  baseUrl: "https://distribution-xml.booking.com/json/bookings";
  credentials: {
    username: string;
    password: string;
  };
}

// Weather API
interface WeatherAPI {
  baseUrl: "https://api.openweathermap.org/data/2.5";
  apiKey: string;
}
```

## Security Requirements

### Authentication & Authorization

```typescript
// JWT Configuration
interface JWTConfig {
  secret: string;
  expiresIn: '7d';
  algorithm: 'HS256';
  issuer: 'off2zim';
}

// Password Requirements
interface PasswordPolicy {
  minLength: 8;
  requireUppercase: true;
  requireLowercase: true;
  requireNumbers: true;
  requireSpecialChars: true;
  preventCommonPasswords: true;
}

// Session Management
interface SessionConfig {
  secure: boolean; // true in production
  httpOnly: true;
  sameSite: 'strict';
  maxAge: 7 * 24 * 60 * 60 * 1000; // 7 days
}
```

### Data Protection

- **HTTPS Only**: Enforce SSL/TLS encryption
- **Input Validation**: Sanitize all user inputs
- **SQL Injection Protection**: Use parameterized queries
- **XSS Prevention**: Escape output data
- **CSRF Protection**: Implement CSRF tokens
- **Rate Limiting**: Prevent API abuse
- **Data Encryption**: Encrypt sensitive data at rest

### Privacy Compliance

- **GDPR Compliance**: EU data protection
- **Cookie Consent**: User consent management
- **Data Retention**: Automated data cleanup
- **Right to Deletion**: User data removal
- **Data Portability**: Export user data
- **Privacy Policy**: Clear privacy terms

## Performance Requirements

### Core Web Vitals Targets

```typescript
interface PerformanceTargets {
  LCP: "<2.5s"; // Largest Contentful Paint
  FID: "<100ms"; // First Input Delay
  CLS: "<0.1"; // Cumulative Layout Shift
  FCP: "<1.8s"; // First Contentful Paint
  TTI: "<3.8s"; // Time to Interactive
}
```

### Optimization Strategies

- **Image Optimization**: WebP format, lazy loading
- **Code Splitting**: Dynamic imports
- **Bundle Analysis**: Regular bundle size monitoring
- **Caching Strategy**: Browser and CDN caching
- **Database Optimization**: Query optimization and indexing
- **API Response Time**: <200ms for critical endpoints

### Monitoring Requirements

```typescript
interface MonitoringConfig {
  analytics: "Google Analytics 4";
  errorTracking: "Sentry";
  performanceMonitoring: "Core Web Vitals";
  uptime: "StatusPage";
  logs: "CloudWatch | LogRocket";
}
```

## Browser Compatibility

### Supported Browsers

- **Chrome**: Version 90+
- **Firefox**: Version 88+
- **Safari**: Version 14+
- **Edge**: Version 90+
- **Mobile Safari**: iOS 14+
- **Chrome Mobile**: Android 10+

### Progressive Enhancement

- **JavaScript Disabled**: Basic functionality available
- **Slow Networks**: Graceful degradation
- **Older Browsers**: Polyfills for critical features
- **Accessibility**: WCAG 2.1 AA compliance

## Deployment Requirements

### Production Environment

```yaml
# Docker Configuration
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Configuration

```yaml
# Production Environment Variables
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://off2zim.com
DATABASE_URL=postgresql://prod-db
REDIS_URL=redis://prod-redis
CDN_URL=https://cdn.off2zim.com
```

### Infrastructure Requirements

- **Load Balancer**: Distribute traffic across instances
- **CDN**: Global content delivery
- **Database**: PostgreSQL with read replicas
- **Cache**: Redis for session and data caching
- **File Storage**: AWS S3 or Cloudinary
- **Monitoring**: Application and infrastructure monitoring

### Deployment Pipeline

```yaml
# CI/CD Pipeline
stages:
  - test
  - build
  - security-scan
  - deploy-staging
  - integration-tests
  - deploy-production
  - smoke-tests
```

### Backup & Recovery

- **Database Backups**: Daily automated backups
- **File Backups**: Incremental backups
- **Disaster Recovery**: Multi-region deployment
- **RTO**: 15 minutes maximum downtime
- **RPO**: 1 hour maximum data loss

## Testing Requirements

### Testing Framework

```json
{
  "unit": "Jest + React Testing Library",
  "integration": "Cypress",
  "e2e": "Playwright",
  "visual": "Chromatic",
  "performance": "Lighthouse CI",
  "accessibility": "axe-core"
}
```

### Coverage Requirements

- **Unit Tests**: 90% code coverage minimum
- **Integration Tests**: All critical user flows
- **E2E Tests**: Complete booking flows
- **Performance Tests**: All page types
- **Accessibility Tests**: All components

### Quality Gates

- **Code Quality**: SonarQube analysis
- **Security Scanning**: SAST and DAST
- **Dependency Scanning**: Known vulnerability checks
- **Performance Budget**: Bundle size limits
- **Accessibility**: Automated a11y testing
