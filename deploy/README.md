# once-client — deployment

CI/CD pipeline: GitHub Actions runs lint + `tsc -b --noEmit`, builds a
multi-stage Docker image (Node build → nginx serve), pushes to GHCR,
then SSHes into the server and runs `docker run` to replace the
container.

No `docker compose` — single container deploy. The container joins the
shared `once-net` Docker network so nginx (or its config) can proxy
`/api` to `once-server-api:8080` or `ai-backend-gateway:43000` by name.

## Required GitHub secrets

| Secret           | What it is                                                                 |
|------------------|----------------------------------------------------------------------------|
| `DEPLOY_HOST`    | Server hostname or IP                                                      |
| `DEPLOY_USER`    | SSH user (e.g. `deploy`)                                                   |
| `DEPLOY_SSH_KEY` | Private key (PEM) for that user                                            |
| `DEPLOY_PORT`    | Optional. SSH port — defaults to `22`                                      |

## Optional GitHub variables

| Variable               | Default | Notes                                          |
|------------------------|---------|------------------------------------------------|
| `VITE_API_BASE_URL`    | `/api`  | Baked into the bundle at build time            |

## Server bootstrap (do once)

```bash
docker network create once-net 2>/dev/null || true
```

No `.env` needed — the SPA is fully static.

## How it runs on the server

```bash
docker run -d \
  --name once-client-web \
  --restart unless-stopped \
  --network once-net \
  -p 43080:80 \
  ghcr.io/<owner>/once-client:sha-<short>
```

## Reverse-proxy /api inside this nginx container (optional)

`deploy/nginx.conf` only handles SPA fallback today. If you want this
container to also proxy `/api/*` to once-server and `/ai/*` to
ai-backend, add the following blocks (all containers are on `once-net`,
so DNS names just work):

```nginx
location /api/ {
    proxy_pass http://once-server-api:8080/;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /ai/ {
    proxy_pass http://ai-backend-gateway:43000/;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

If you'd rather terminate routing at a host-level nginx/Caddy, leave
this container as static-only and proxy at the edge.
