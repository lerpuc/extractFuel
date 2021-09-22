FROM mhart/alpine-node:12 as base

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install\
        && npm install typescript -g
        
COPY . .

ENV NODE_PATH=./build

EXPOSE 8080

RUN npm run-script build

COPY ./src/swagger.json ./dist/

CMD ["node", "./dist/server.js"]