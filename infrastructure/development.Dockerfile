FROM node:16

WORKDIR /usr/app

COPY .npmrc ./

COPY package.json ./

RUN yarn

COPY . ./

CMD ["yarn", "dev"]