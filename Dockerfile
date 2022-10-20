FROM node:18-alpine as base
WORKDIR /app
RUN npm -g i pnpm


FROM base as builder
ADD ./package.json ./pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
ADD . .
RUN pnpm run build

FROM base
ADD ./package.json ./pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=builder /app/dist/ /app/dist/

STOPSIGNAL SIGTERM

CMD ["pnpm", "start"]
