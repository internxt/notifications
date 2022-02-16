FROM node:latest

WORKDIR /usr/app

COPY . ./

RUN yarn

RUN yarn build

CMD ["yarn", "start"]