FROM node:12.16.0-alpine AS builder

WORKDIR /opt/mojaloop-testing-toolkit

RUN apk add --no-cache -t build-dependencies git make gcc g++ python libtool autoconf automake \
    && cd $(npm root -g)/npm \
    && npm config set unsafe-perm true \
    && npm install -g node-gyp

COPY package.json package-lock.json* /opt/mojaloop-testing-toolkit/
RUN npm install

# RUN cd /opt && git clone https://github.com/mojaloop/ml-testing-toolkit-ui.git
# RUN cd /opt/ml-testing-toolkit-ui && npm install && npm run build
# RUN mkdir /opt/mojaloop-testing-toolkit/client
# RUN cp -pR /opt/ml-testing-toolkit-ui/build /opt/mojaloop-testing-toolkit/client/build

COPY client /opt/mojaloop-testing-toolkit/client
COPY config /opt/mojaloop-testing-toolkit/config
COPY src /opt/mojaloop-testing-toolkit/src
COPY spec_files /opt/mojaloop-testing-toolkit/spec_files

FROM node:12.16.0-alpine

WORKDIR /opt/mojaloop-testing-toolkit

COPY --from=builder /opt/mojaloop-testing-toolkit .
RUN npm prune --production

EXPOSE 5000
EXPOSE 5050
CMD ["npm", "run", "start"]
