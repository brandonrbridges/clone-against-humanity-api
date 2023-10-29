FROM node:20-alpine

RUN apk add --no-cache python3 make g++ gcc

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]