# BrainSharp AI

BrainSharp AI is a habit-building and cognitive-wellness web app. It helps people turn broad goals like improving focus or staying active into manageable daily actions, then makes progress visible through quests, streaks, XP, and activity analytics.

This repository contains the **Next.js client**. Authentication is handled with Better Auth, while quest, profile, leaderboard, and AI-coach data are served by the BrainSharp backend.

## Why BrainSharp AI?

Building a routine can take time before the work even begins: deciding what to do, planning a session, and figuring out whether it is helping. BrainSharp AI reduces that overhead:

- **Start with a ready-to-do quest.** Daily activities are grouped into mental, physical, and puzzle categories, with a suggested duration and XP reward.
- **Keep sessions bounded.** The activity timer, pause control, and five-minute extension help fit a practice into the time available.
- **See progress at a glance.** Completion counts, levels, XP, streaks, and activity history make progress easier to understand without keeping a separate log.
- **Notice missed opportunities.** Past, incomplete quests are marked as missed in the profile analytics, while today’s pending quests remain in progress.
- **Get a next step.** The AI coach can provide a daily brief or answer habit and focus questions using the app’s coaching service.
- **Stay motivated with community context.** Global and category leaderboards show how XP progress compares with other participants.

The aim is to make consistent practice easier to begin and easier to sustain—not to replace professional mental or physical healthcare.

## Features

- Email and password authentication.
- Daily quests for mindfulness, movement, and brain training.
- Timed activity sessions, optional rain ambience for mental sessions, and XP rewards.
- Profile management and progress summaries.
- Interactive profile analytics with completed, pending, and missed activity states.
- AI coaching briefs and interactive habit chat.
- Global and category leaderboards.
- Responsive dark interface with animated interactions.

## Technology

- Next.js App Router and React
- TypeScript
- Tailwind CSS 4
- HeroUI
- Framer Motion
- Recharts
- Better Auth
- PostgreSQL connection through `pg`

## Getting started

### Prerequisites

- Node.js 20.9 or later
- npm
- A PostgreSQL database for Better Auth
- The BrainSharp backend service for quest, profile, leaderboard, and AI-coach features

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Configure the required environment variables before using authentication or backend-powered features. Keep credentials in a local environment file such as `.env.local`; environment files are ignored by Git and must never be committed.

## Environment configuration

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes, for authentication | PostgreSQL connection string used by Better Auth. |
| `BETTER_AUTH_SECRET` | Yes, for authentication | Secret used to sign and protect authentication data. Use a long, random value. |
| `BETTER_AUTH_URL` | Yes, for authentication | Canonical base URL of this client, such as `http://localhost:3000` during local development. |
| `SERVER_URL` | Recommended | Base URL of the BrainSharp backend. The API proxy uses this first. |
| `NEXT_PUBLIC_SERVER_URL` | Optional fallback | Backend URL used only when `SERVER_URL` is not set. |
| `NEXT_PUBLIC_API_BASE_URL` | Optional | Better Auth client base URL; defaults to `http://localhost:3000`. |

The backend proxy falls back to the deployed BrainSharp backend when neither backend URL variable is set. For local development, set `SERVER_URL` to the backend instance you intend to use.

Do not put secrets in variables prefixed with `NEXT_PUBLIC_`; Next.js exposes those values to the browser.

## Useful commands

```bash
npm run dev      # Start the local development server
npm run lint     # Run ESLint
npm run build    # Create a production build
npm run start    # Serve the production build
```

## Project structure

```text
src/
├── app/                     # App Router pages, layouts, and API routes
│   ├── api/
│   │   ├── auth/            # Better Auth route handler
│   │   └── backend/         # Same-origin proxy to the BrainSharp backend
│   ├── about/               # About page
│   ├── brainsharp-ai/       # AI coach experience
│   ├── leaderboard/         # Global and category leaderboards
│   ├── login/               # Sign-in page
│   ├── profile/             # Profile settings and activity analytics
│   ├── quest/               # Daily quests and activity sessions
│   └── SignUp/              # Account creation page
├── components/
│   ├── ai/                  # AI coach interface
│   ├── home/                # Landing-page sections
│   ├── layouts/             # Shared navigation and layout elements
│   ├── leaderboard/         # Leaderboard list and podium
│   ├── profile/             # Profile activity graph
│   ├── providers/           # Shared React providers
│   ├── quest/               # Quest cards, header, and activity modal
│   ├── sections/            # Shared hero sections
│   ├── shared/              # Reusable shared UI
│   └── ui/                  # General UI and background components
├── lib/
│   ├── actions/             # Mutating API request helpers
│   ├── api/                 # API request and fetch helpers
│   ├── audio/               # Ambient audio helpers
│   ├── quest/               # Quest and profile data parsing and logic
│   ├── auth.ts              # Better Auth server configuration
│   └── auth-client.ts       # Better Auth client configuration
└── types/                   # Shared TypeScript domain types
public/
└── images/                  # Static images used by the interface
```

### Request and data flow

1. The client uses the helpers in `src/lib/api/` for backend requests.
2. Requests are sent through `/api/backend`, a same-origin Next.js proxy that forwards them to the configured BrainSharp backend.
3. Authentication requests are handled separately by `/api/auth` and Better Auth.
4. Feature pages validate and transform API responses before rendering their UI. Shared quest and profile parsing logic lives in `src/lib/quest/questData.ts`.

## Production

Build and start the client with:

```bash
npm run build
npm run start
```

Set production environment variables in the hosting provider’s secure configuration. Ensure the client’s public URL, PostgreSQL database, and BrainSharp backend URL are set to their production values before deployment.
