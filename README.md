# Off2Zim Platform

Off2Zim now runs as a unified platform with one shared backend and database, while exposing separate app surfaces for customers, providers, administrators, and mobile.

## App structure

- [apps/main-web](/Users/tinotendamutami/Off2Zim/off2zim-v.3/apps/main-web)
  - landing page
  - explorer login and registration
  - travel discovery, planning, and booking
- [apps/provider-web](/Users/tinotendamutami/Off2Zim/off2zim-v.3/apps/provider-web)
  - provider sign in
  - provider dashboard
  - listings, orders, and verification
- [apps/admin-web](/Users/tinotendamutami/Off2Zim/off2zim-v.3/apps/admin-web)
  - admin sign in
  - platform operations workspace
- [Mobile](/Users/tinotendamutami/Off2Zim/off2zim-v.3/Mobile)
  - explorer, provider, and admin mobile variants
- [backend](/Users/tinotendamutami/Off2Zim/off2zim-v.3/backend)
  - unified API and Prisma-backed data layer

## Local development

Main web app:

```bash
npm run dev:main-web
```

Provider web app:

```bash
npm run dev:provider-web
```

Admin web app:

```bash
npm run dev:admin-web
```

Backend:

```bash
npm run dev:backend
```

Mobile:

```bash
cd Mobile
npm run start:explorer
```

## Local URLs

- main web app: [http://localhost:3000](http://localhost:3000)
- provider web app: [http://localhost:3002](http://localhost:3002)
- admin web app: [http://localhost:3003](http://localhost:3003)
- backend health: [http://localhost:4000/api/health](http://localhost:4000/api/health)

All surfaces use the same backend logic and the same database connection.
