FROM --platform=linux/amd64 node:17-alpine

WORKDIR /usr/app

COPY package.json .

RUN npm i --quiet

COPY . .

RUN npm install pm2 -g

RUN pm2 update

CMD ["pm2-runtime", "index.js"]
# CMD ["node", "index.js"]