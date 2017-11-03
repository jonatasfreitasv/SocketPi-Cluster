FROM hypriot/rpi-node

COPY src/ /app/src

COPY package.json /app

WORKDIR /app

RUN npm install

EXPOSE 8080

CMD npm start