# CI/CD

GitHub Actions runs on pull requests and pushes to `main`.

## Quality

The quality job runs:

```bash
npm ci
npx playwright install --with-deps chromium
npm run lint
npm run format:check
npm audit --audit-level=moderate
npm run test
npm run build
npm run build-storybook
npm run test:e2e
```

## Docker

The Docker job builds the production image on pull requests and pushes it
to GitHub Container Registry on `main`.

Image:

```text
ghcr.io/ahmedibrahimyassindev/real-time-chat-application
```

## GitHub Pages

On `main`, the deploy job builds the app with the repository base path and
publishes `dist/` to GitHub Pages.

The workflow adds `dist/404.html` so browser-history routes can fall back
to the SPA entry point.

Enable GitHub Pages in the repository settings with **GitHub Actions** as
the source.
