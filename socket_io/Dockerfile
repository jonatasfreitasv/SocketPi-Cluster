FROM hypriot/rpi-node

COPY src/ .
COPY package.json .

RUN npm install

EXPOSE 8080

CMD npm start