FROM node:20

RUN apt update && \
    apt install xsel

#Directory
WORKDIR /var/www

#COPY ALL
COPY . .
COPY package*.json ./

#Build
RUN npm install
RUN npm install -g serve

#RESIZE PACKAGE NODEJS
RUN npm run build

#PORT
EXPOSE 3000

#Start
CMD ["serve", "-s", "out", "-l", "tcp://0.0.0.0:3000"]