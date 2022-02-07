FROM node:16-alpine as builder

WORKDIR /app

ADD ./package.json ./pnpm-lock.yaml ./
RUN npm exec pnpm install --frozen-lockfile

ADD . .
RUN npm exec pnpm run build

FROM node:16-alpine

WORKDIR /app

ADD ./package.json ./pnpm-lock.yaml ./
RUN npm exec pnpm install --frozen-lockfile --prod
COPY --from=builder /app/dist/ /app/dist/

STOPSIGNAL SIGTERM

CMD ["node", "."]
