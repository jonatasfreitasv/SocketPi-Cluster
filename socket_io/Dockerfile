FROM hypriot/rpi-node

COPY src/ .
COPY package.json .

RUN npm install

EXPOSE 5000

CMD npm start