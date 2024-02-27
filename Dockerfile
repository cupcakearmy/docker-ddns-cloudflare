FROM oven/bun:1-alpine as base

WORKDIR /app
COPY package.json bun.lockb /app/
RUN bun install --production --frozen-lockfile

COPY . .

STOPSIGNAL SIGTERM
CMD ["bun", "."]
