# Summit SAT v1 Starter

Builder-ready starter scaffold for a modern SAT prep web app focused on:

- daily missions
- drills and timed mini-tests
- mistake review
- streaks, badges, checkpoints
- analytics and progress visibility

## Routes

- `/` marketing landing page
- `/onboarding` lite onboarding
- `/app` dashboard
- `/app/mission` mission player shell
- `/app/review` mistake review center
- `/app/analytics` analytics dashboard
- `/app/rewards` rewards and checkpoints

## Structure

- `app/` Next.js App Router routes
- `components/` route-level UI building blocks
- `data/mock-data.ts` typed mock content for v1
- `lib/types.ts` core UI and domain types

## Local run

1. `npm install`
2. `npm run dev`

## Next build steps

- wire UI to auth and persistence
- replace mock data with Prisma-backed queries
- add mission session state and timers
- store attempts, answers, and mistake-log events
- implement adaptive mission generation service

## Prisma setup

For production-friendly persistence on Vercel, this repo is scaffolded for Prisma with hosted Postgres.

1. Create a Prisma Postgres database from the Vercel Marketplace and connect it to the project.
2. Copy `.env.example` to `.env.local` and confirm `DATABASE_URL` is set.
3. Install dependencies with `npm install`.
4. Generate the client with `npm run db:generate`.
5. Create and apply the first migration with `npm run db:migrate`.

If `prisma migrate dev` gives you trouble on the hosted database during early prototyping, you can use:

- `npm run db:push`

Current schema files:

- `prisma/schema.prisma`
