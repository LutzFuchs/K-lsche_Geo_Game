# syntax=docker/dockerfile:1.7

# --- build ---
FROM oven/bun:1.3-alpine AS builder
WORKDIR /app
COPY package.json bun.lock* bun.lockb* ./
RUN bun install --frozen-lockfile || bun install
COPY . .
RUN bun run build

# --- runtime ---
FROM nginx:1.27-alpine
RUN apk add --no-cache gettext
COPY --from=builder /app/dist /usr/share/nginx/html
COPY deploy/nginx.conf.template /etc/nginx/templates/default.conf.template

ENV PORT=8080
EXPOSE 8080

# Cloud Run sets $PORT at runtime; nginx upstream image already runs envsubst
# on /etc/nginx/templates/*.template -> /etc/nginx/conf.d/*.conf at startup.
CMD ["nginx", "-g", "daemon off;"]
