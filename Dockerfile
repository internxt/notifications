FROM node:24.18.0
LABEL author="internxt"

WORKDIR /usr/app

COPY . ./

# Install deps
RUN yarn && yarn build && yarn --production && yarn cache clean

# Create prometheus directories
RUN mkdir -p /mnt/prometheusvol{1,2}

# Start server
CMD yarn start