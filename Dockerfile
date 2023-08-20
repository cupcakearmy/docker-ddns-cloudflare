FROM node:20-alpine as base
# PNPM
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
# Setup
ENV CI=true
WORKDIR /app
ADD ./package.json ./pnpm-lock.yaml ./


FROM base as builder
RUN pnpm install
ADD . .
RUN pnpm run build

FROM base
RUN pnpm install --prod
COPY --from=builder /app/dist/ /app/dist/

STOPSIGNAL SIGTERM

CMD ["pnpm", "start"]
