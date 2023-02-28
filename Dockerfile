FROM node:14

WORKDIR /usr/src/app

RUN npm install
RUN npm install -g pm2
# RUN npm run build

CMD [ "npm", "start" ]