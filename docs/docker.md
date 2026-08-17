# Docker

## Production Image

Build the production image:

```bash
docker build -t realtime-chat-frontend .
```

Run the production image:

```bash
docker run --rm -p 8080:80 realtime-chat-frontend
```

Open:

```text
http://localhost:8080
```

## Development Container

Run the Vite development server in Docker:

```bash
docker compose --profile dev up frontend-dev
```

Open:

```text
http://localhost:5173
```

## Compose Production Service

Run the production nginx service:

```bash
docker compose up frontend
```

Open:

```text
http://localhost:8080
```
