FROM node:14-alpine

WORKDIR /app

ADD ./package.json script.js yarn.lock ./
RUN yarn

CMD ["node", "script.js"]