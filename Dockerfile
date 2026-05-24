FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG VITE_API_BASE_URL=https://api.onceai.uz
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# URL of the externally-hosted hero demo video (CDN / object storage) so the
# large media file never ships inside the image.
ARG VITE_HERO_VIDEO_URL=https://stage-api.edcom.uz/gateway/api-filefs/api/public/97c3483aaaa84228921a2e5f46cc780f
ENV VITE_HERO_VIDEO_URL=$VITE_HERO_VIDEO_URL

RUN npm run build

FROM nginx:1.27-alpine AS runtime
RUN apk add --no-cache curl
COPY --from=build /app/dist /usr/share/nginx/html
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -fs http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
