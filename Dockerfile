FROM node:12.16.0-alpine AS builder

WORKDIR /opt/mojaloop-testing-toolkit

RUN apk add --no-cache -t build-dependencies git make gcc g++ python libtool autoconf automake \
    && cd $(npm root -g)/npm \
    && npm config set unsafe-perm true \
    && npm install -g node-gyp

COPY package.json package-lock.json* /opt/mojaloop-testing-toolkit/
RUN npm install

COPY src /opt/mojaloop-testing-toolkit/src
COPY spec_files /opt/mojaloop-testing-toolkit/spec_files
COPY secrets /opt/mojaloop-testing-toolkit/secrets

FROM node:12.16.0-alpine

WORKDIR /opt/mojaloop-testing-toolkit

COPY --from=builder /opt/mojaloop-testing-toolkit .
RUN npm prune --production

EXPOSE 5000
EXPOSE 5050
CMD ["npm", "run", "start"]
