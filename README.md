# Solace AI

A mobile-first wellness prototype built with Next.js, React, and TypeScript.

## Run locally

Use Node.js 22 or later. Extract the GitHub ZIP and open a terminal in the extracted folder.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Run `npm run build` to check the production build.

## Demo walkthrough

1. From Home, open Check-in and choose Mood vibes or Anxiety check.
2. Answer four questions, review Wellness Moves, and open History.
3. Return Home to review today's check-in status, level, XP, and streak.
4. Try the four-cycle breathing timer and a Resources checklist.
5. Open Daily habits from Home, complete a habit, and refresh to check that progress persists.
6. Open Zen Monk and choose a guided reflection prompt.

Check-ins are for personal reflection and are saved in the current browser. Each completed guided check-in earns 48 XP. Each level takes 100 XP. Resource checklist progress resets when switching guides. Zen Monk uses built-in prompts.

Daily habits are stored in the current browser and reset for each local calendar day.

## Project structure

- `src/app/` contains the routes, shared layout, and global styles.
- `src/components/` contains the shared bottom navigation.
- `src/features/check-ins/` contains the question sets, answer flow, history, and browser storage. Older single-mood entries are read from their original storage key.
- `src/features/habits/` contains the daily checklist and its browser storage.
- `src/features/dashboard/` contains the home screen, which derives XP, level, and streak from saved guided check-ins.

The route at `/today` renders `GuidedCheckIn`. It reads the four questions from
`questions.ts` and saves a completed set through `guided-storage.ts`. The History
page and Home dashboard then read those saved entries.
