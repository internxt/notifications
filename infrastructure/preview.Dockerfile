FROM node:24.18.0

WORKDIR /usr/app

COPY .npmrc ./

COPY package.json ./

RUN yarn

COPY . ./

CMD ["yarn", "dev"]