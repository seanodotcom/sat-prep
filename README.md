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
