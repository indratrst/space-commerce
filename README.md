# Space Commerce

> E-commerce storefront and admin dashboard built with Next.js, Prisma, and TypeScript.

## Repository

- GitHub: https://github.com/indratrst/space-commerce.git

## Project Overview

Space Commerce is a catalog-based e-commerce application designed for storefront browsing and administrative product management. The app includes category browsing, product detail pages, shopping cart functionality, and a secure admin panel for managing products, categories, and users.

## Key Features

- Storefront product browsing with category filtering and product cards.
- Product detail pages with variant, rating, and image support.
- Cart management: add, remove, update quantity, and order summary.
- Recommendations engine for related products in cart and product pages.
- Admin dashboard with statistics, recent products, and quick actions.
- Admin CRUD for products, categories, and users.
- JWT-based session authentication using cookie storage.
- REST-style API routes for auth, products, categories, users, and uploads.
- Prisma ORM with PostgreSQL-backed database and seed data.

## Tech Stack

- Frontend: Next.js 16 (App Router), React 19, TypeScript
- Styling: Tailwind CSS 4, Lucide React icons
- Backend: Next.js Route Handlers, Prisma ORM
- Database: PostgreSQL via Prisma
- Authentication: bcryptjs, jose, encrypted cookies
- Utilities: zod, uuid, dotenv, eslint

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- PostgreSQL database

### Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file at the project root with at least:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
SESSION_SECRET="your-strong-session-secret"
```

3. Run Prisma migrations and seed the database:

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

4. Start the development server:

```bash
npm run dev
```

5. Open the app at `http://localhost:3000`.

## Admin Access

- Login page: `/login`
- Admin dashboard: `/admin`
- Default seeded accounts:
  - `superuser@admin.com` / `password`
  - `admin@admin.com` / `password`
  - `user@admin.com` / `password`

## Project Structure

- `src/app` - application routes and pages
- `src/components` - shared UI and feature components
- `src/lib` - database, auth, session, and data helpers
- `src/contexts` - cart state management
- `prisma` - schema and seed scripts

## Scripts

- `npm run dev` - run development server
- `npm run build` - build production app
- `npm run start` - start production server
- `npm run lint` - run ESLint

## Notes

- Ensure `SESSION_SECRET` is set before running authentication.
- Database seeding creates default admin and user accounts.
- Protected admin routes are enforced by the middleware in `src/middleware.ts`.
