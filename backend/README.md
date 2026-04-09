# Backend

Unified API and database entry for the Off2Zim platform.

This backend uses the same shared Next.js server and Prisma database layer that powers:

- main web app
- provider web app
- admin web app
- mobile app

Run locally:

```bash
npm run dev
```

This starts the shared server on port `4000`.

Useful endpoints:

- `/api/health`
- `/api/auth/login`
- `/api/auth/register`
- `/api/listings`
