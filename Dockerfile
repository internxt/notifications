FROM mhart/alpine-node:16
LABEL author="internxt"

WORKDIR /usr/app

# Add useful packages
RUN apk add git curl

COPY . ./

# Install deps
RUN yarn && yarn build && yarn --production && yarn cache clean

# Create prometheus directories
RUN mkdir -p /mnt/prometheusvol{1,2}

# Start server
CMD yarn start