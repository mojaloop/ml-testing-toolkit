# Arguments
ARG NODE_VERSION=lts-alpine

# NOTE: Ensure you set NODE_VERSION Build Argument as follows...
#
#  export NODE_VERSION="$(cat .nvmrc)-alpine" \
#  docker build \
#    --build-arg NODE_VERSION=$NODE_VERSION \
#    -t mojaloop/sdk-scheme-adapter:local \
#    . \
#

# Build Image
FROM node:${NODE_VERSION} as builder

WORKDIR /opt/app

RUN apk add --no-cache -t build-dependencies make gcc g++ python3 libtool openssl-dev autoconf automake \
    && cd $(npm root -g)/npm

COPY package.json package-lock.json* /opt/app/
RUN npm ci

COPY src /opt/app/src
COPY spec_files /opt/app/spec_files
COPY examples /opt/app/examples
RUN mkdir /opt/app/uploads

FROM node:${NODE_VERSION}
WORKDIR /opt/app

# Create a non-root user: ml-user
RUN adduser -D ml-user 
USER ml-user

COPY --chown=ml-user --from=builder /opt/app .
RUN npm prune --production

EXPOSE 4040
EXPOSE 5050

CMD ["npm", "run", "start"]
