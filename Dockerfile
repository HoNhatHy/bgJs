FROM node:16
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
RUN apt --fix-broken -y install
RUN apt-get update
RUN apt-get install -y wget
RUN wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get install -y ./google-chrome-stable_current_amd64.deb
COPY . .
CMD [ "node", "index.js" ]