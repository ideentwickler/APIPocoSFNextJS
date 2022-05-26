FROM node:latest

WORKDIR /

COPY package*.json .
COPY yarn.lock .

RUN yarn

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "yarn prisma:dev:deploy && sleep 1 && npx prisma generate && sleep 1 && yarn start:dev"]