###########
# BUILD 
###########

FROM node:20-alpine as development 

WORKDIR /usr/src/api

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . /usr/src/api/

USER node

###########
# BUILD FOR PRODUCTION
###########

FROM node:20-alpine as build 

WORKDIR /usr/src/api

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/api/node_modules ./node_modules
COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN npm install --only=production

USER node

###########
# PRODUCTION
###########

FROM node:20-alpine as production

COPY --chown=node:node --from=build /usr/src/api/dist ./dist
COPY --chown=node:node --from=build /usr/src/api/node_modules ./node_modules

CMD ["node", "dist/main.js"]