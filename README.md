# Real-Time Chat Application

A frontend-only real-time chat application built with Vue 3, TypeScript, Vite,
Tailwind CSS, Pinia, TanStack Query, MSW, and a mock WebSocket layer.

The app demonstrates a production-style chat UI with authentication screens,
protected routes, conversations, channels, message composition, simulated
real-time events, reactions, replies, attachments, search, notifications,
responsive layouts, tests, Storybook, Docker, and CI/CD.

## Status

The frontend roadmap is implemented through Docker and CI/CD support.

Implemented:

- Vue 3 + TypeScript + Vite foundation
- Tailwind CSS, Vue Router, Pinia, Axios, TanStack Query, Zod
- MSW REST mocks and mock WebSocket service
- Login, registration, protected routes, profile page
- Core chat UI with conversations, message list, composer, edit/delete
- Simulated real-time messages, typing, presence, read receipts, reconnect state
- Reactions, replies, attachment UI, message search, mentions
- Channel management and notification center
- Vitest, Playwright, Storybook, Docker, GitHub Actions CI/CD

## Requirements

- Node.js 24+
- npm
- Docker, optional

## Setup

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

Mock login credentials are prefilled on the login screen.

## Scripts

```bash
npm run dev
npm run lint
npm run format:check
npm run test
npm run test:e2e
npm run build
npm run build:pages
npm run build-storybook
npm run preview
```

If Playwright browsers are missing:

```bash
npx playwright install chromium
```

## Docker

Build and run the production image:

```bash
docker build -t realtime-chat-frontend .
docker run --rm -p 8080:80 realtime-chat-frontend
```

Run with Docker Compose:

```bash
docker compose up frontend
```

Development container:

```bash
docker compose --profile dev up frontend-dev
```

More details: [docs/docker.md](docs/docker.md)

## CI/CD

GitHub Actions runs:

- Linting and format checks
- Dependency audit
- Unit tests
- Production build
- Storybook build
- Playwright E2E tests
- Docker image build and GHCR publishing on `main`
- GitHub Pages deployment on `main`

More details: [docs/ci-cd.md](docs/ci-cd.md)

## Documentation

- [Detailed project roadmap](README-Real-Time-Chat-Application.md)
- [Docker documentation](docs/docker.md)
- [CI/CD documentation](docs/ci-cd.md)
- [Quality review notes](docs/quality-review.md)

## License

No license has been selected yet.
