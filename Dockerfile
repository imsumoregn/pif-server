FROM node:16.17.1-bullseye as deps

RUN mkdir -p /usr/app/node_modules && chown -R node:node /usr/app

WORKDIR /usr/app

COPY --chown=node:node package*.json .

USER node

RUN npm ci --omit=dev

FROM node:16.17.1-bullseye-slim as runner

WORKDIR /usr/app

COPY --from=deps --chown=node:node /usr/app/node_modules node_modules
COPY --chown=node:node . .

EXPOSE 8080

USER node

CMD ["scripts/start.sh"]
