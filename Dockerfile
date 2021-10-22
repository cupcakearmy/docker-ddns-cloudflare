FROM node:16-alpine

WORKDIR /app

ADD . .
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm run build

CMD ["node", "."]
