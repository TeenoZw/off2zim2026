# Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the Off2Zim travel platform to various environments, from development to production. It covers multiple deployment strategies, environment configurations, and best practices for maintaining a reliable and scalable application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Local Development](#local-development)
4. [Staging Deployment](#staging-deployment)
5. [Production Deployment](#production-deployment)
6. [Docker Deployment](#docker-deployment)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Database Migration](#database-migration)
9. [Monitoring & Logging](#monitoring--logging)
10. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

- **Node.js**: v18.17.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: Latest version
- **Docker**: v20.10+ (for containerized deployment)
- **PostgreSQL**: v14+ (for production database)

### Development Tools

```bash
# Install required global packages
npm install -g @vercel/cli
npm install -g pm2
npm install -g prisma
```

### Cloud Platform Accounts

- **Vercel** (recommended for Next.js deployment)
- **Railway** or **PlanetScale** (for database hosting)
- **Cloudinary** (for image storage)
- **Stripe** (for payment processing)

## Environment Setup

### Environment Variables

Create environment files for different stages:

#### `.env.local` (Development)

```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/off2zim_dev"

# Authentication
NEXTAUTH_SECRET="your-development-secret-key"
NEXTAUTH_URL=http://localhost:3000

# Payment Processing
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Image Storage
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email Service
RESEND_API_KEY="re_..."

# Maps Integration
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-maps-api-key"

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-..."
```

#### `.env.production` (Production)

```env
# Application
NEXT_PUBLIC_APP_URL=https://off2zim.com
NODE_ENV=production

# Database (Production)
DATABASE_URL="postgresql://username:password@production-host:5432/off2zim_prod"

# Authentication
NEXTAUTH_SECRET="your-super-secure-production-secret"
NEXTAUTH_URL=https://off2zim.com

# Payment Processing (Live Keys)
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Other production configurations...
```

### Security Configuration

#### Environment Variable Validation

```typescript
// src/lib/env.ts
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "staging", "production"]),
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  CLOUDINARY_CLOUD_NAME: z.string(),
});

export const env = envSchema.parse(process.env);
```

## Local Development

### Setup Steps

```bash
# Clone the repository
git clone https://github.com/your-org/off2zim-v.2.git
cd off2zim-v.2

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Setup database
npx prisma generate
npx prisma db push

# Seed database (optional)
npx prisma db seed

# Start development server
npm run dev
```

### Development Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:e2e": "playwright test",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

## Staging Deployment

### Vercel Staging Environment

#### 1. Connect Repository

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to staging
vercel --prod=false
```

#### 2. Configure Staging Environment

```bash
# Set environment variables
vercel env add NEXT_PUBLIC_APP_URL
# Enter: https://off2zim-staging.vercel.app

vercel env add DATABASE_URL
# Enter your staging database URL

vercel env add NEXTAUTH_SECRET
# Enter your staging secret
```

#### 3. Deploy Staging

```bash
# Deploy to staging environment
vercel --target=staging
```

### Railway Staging Setup

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create new project
railway new off2zim-staging

# Deploy to Railway
railway up
```

## Production Deployment

### Vercel Production Deployment

#### 1. Production Configuration

```javascript
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1"],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### 2. Deploy to Production

```bash
# Build and test locally first
npm run build
npm run start

# Deploy to production
vercel --prod

# Set custom domain
vercel domains add off2zim.com
```

### Alternative: Self-Hosted Deployment

#### 1. Server Setup (Ubuntu 20.04+)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib
```

#### 2. Application Setup

```bash
# Clone and setup application
git clone https://github.com/your-org/off2zim-v.2.git /var/www/off2zim
cd /var/www/off2zim

# Install dependencies
npm ci --only=production

# Build application
npm run build

# Setup PM2 configuration
```

#### 3. PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "off2zim",
      script: "npm",
      args: "start",
      cwd: "/var/www/off2zim",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "/var/log/off2zim/error.log",
      out_file: "/var/log/off2zim/out.log",
      log_file: "/var/log/off2zim/combined.log",
      time: true,
    },
  ],
};
```

#### 4. Nginx Configuration

```nginx
# /etc/nginx/sites-available/off2zim
server {
    listen 80;
    server_name off2zim.com www.off2zim.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 5. SSL Setup with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d off2zim.com -d www.off2zim.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## Docker Deployment

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["npm", "start"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=off2zim
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

### Deploy with Docker

```bash
# Build and run
docker-compose up -d

# Check logs
docker-compose logs -f

# Update deployment
docker-compose pull
docker-compose up -d --no-deps app
```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel Staging
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel Production
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
```

### Deployment Scripts

```bash
#!/bin/bash
# scripts/deploy.sh

set -e

echo "🚀 Starting deployment process..."

# Run tests
echo "🧪 Running tests..."
npm run test
npm run test:e2e

# Build application
echo "🏗️ Building application..."
npm run build

# Deploy to Vercel
echo "📦 Deploying to production..."
vercel --prod --yes

# Run post-deployment checks
echo "✅ Running post-deployment checks..."
curl -f https://off2zim.com/api/health || exit 1

echo "🎉 Deployment completed successfully!"
```

## Database Migration

### Prisma Migration Strategy

```bash
# Create new migration
npx prisma migrate dev --name add-new-feature

# Deploy migrations to production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### Production Migration Process

```bash
# 1. Backup production database
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# 2. Test migration on staging
npx prisma migrate deploy --schema=./prisma/schema.prisma

# 3. Deploy to production during maintenance window
npx prisma migrate deploy

# 4. Verify migration success
npx prisma db seed --preview-feature
```

### Migration Rollback Strategy

```sql
-- Create rollback script for each migration
-- migrations/rollback/20240101000000_rollback.sql
BEGIN;

-- Reverse the changes made in the migration
DROP TABLE IF EXISTS new_table;
ALTER TABLE existing_table DROP COLUMN new_column;

-- Verify rollback
SELECT * FROM schema_migrations WHERE version = '20240101000000';

COMMIT;
```

## Monitoring & Logging

### Application Monitoring

```typescript
// src/lib/monitoring.ts
import { initSentry } from "./sentry";
import { initAnalytics } from "./analytics";

export function initMonitoring() {
  if (process.env.NODE_ENV === "production") {
    initSentry({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.VERCEL_ENV || "production",
    });

    initAnalytics({
      trackingId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    });
  }
}
```

### Health Check Endpoint

```typescript
// pages/api/health.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check external services
    const checks = {
      database: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    };

    res.status(200).json(checks);
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### Logging Configuration

```typescript
// src/lib/logger.ts
import winston from "winston";

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    ...(process.env.NODE_ENV === "production"
      ? [new winston.transports.File({ filename: "app.log" })]
      : []),
  ],
});

export { logger };
```

## Performance Optimization

### Build Optimization

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react", "@headlessui/react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    domains: ["res.cloudinary.com"],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,

  // Bundle analyzer
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": path.resolve(__dirname, "src"),
      };
    }
    return config;
  },
};

module.exports = nextConfig;
```

### CDN Configuration

```javascript
// Configure Cloudinary for images
const cloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  uploadPreset: "off2zim_preset",
  transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
};
```

## Security Hardening

### Security Headers

```javascript
// next.config.js security headers
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};
```

## Troubleshooting

### Common Issues

#### 1. Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check
```

#### 2. Database Connection Issues

```bash
# Test database connection
npx prisma db pull

# Reset Prisma client
npx prisma generate

# Check environment variables
echo $DATABASE_URL
```

#### 3. Deployment Timeouts

```javascript
// Increase function timeout in vercel.json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### Debug Commands

```bash
# Check deployment logs
vercel logs https://off2zim.vercel.app

# Monitor PM2 processes
pm2 logs off2zim
pm2 monit

# Database debugging
npx prisma studio
```

### Rollback Procedures

```bash
# Vercel rollback
vercel rollback https://off2zim.vercel.app

# PM2 rollback
pm2 stop off2zim
git checkout previous-version
npm run build
pm2 start ecosystem.config.js
```

## Maintenance

### Regular Tasks

- **Weekly**: Review application logs and performance metrics
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Database optimization and cleanup
- **Annually**: SSL certificate renewal and security audit

### Backup Strategy

```bash
# Automated daily backups
#!/bin/bash
# scripts/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/off2zim"

# Database backup
pg_dump $DATABASE_URL > $BACKUP_DIR/db_backup_$DATE.sql

# File backup
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz /var/www/off2zim

# Clean old backups (keep 30 days)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

This deployment guide provides comprehensive instructions for deploying the Off2Zim platform across different environments with proper monitoring, security, and maintenance procedures.
