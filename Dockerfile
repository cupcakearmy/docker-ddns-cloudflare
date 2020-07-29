FROM node:14-alpine

WORKDIR /app

ADD ./package.json yarn.lock ./
RUN yarn
ADD ./script.js ./

CMD ["node", "script.js"]