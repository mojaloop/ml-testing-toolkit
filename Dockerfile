FROM node:16.15.0-alpine as builder

WORKDIR /opt/app

RUN apk add --no-cache -t build-dependencies make gcc g++ python3 libtool libressl-dev openssl-dev autoconf automake \
    && cd $(npm root -g)/npm \
    && npm config set unsafe-perm true \
    && npm install -g node-gyp

COPY package.json package-lock.json* /opt/app/
RUN npm install

COPY src /opt/app/src
COPY spec_files /opt/app/spec_files
COPY examples /opt/app/examples
COPY secrets /opt/app/secrets
RUN mkdir /opt/app/uploads

FROM node:16.15.0-alpine
WORKDIR /opt/app

# Create a non-root user: ml-user
RUN adduser -D ml-user 
USER ml-user

COPY --chown=ml-user --from=builder /opt/app .
RUN npm prune --production

EXPOSE 4040
EXPOSE 5050

CMD ["npm", "run", "start"]
