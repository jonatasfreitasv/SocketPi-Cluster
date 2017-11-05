FROM hypriot/rpi-node

COPY package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /app && cp -a /tmp/node_modules /app/

COPY src/ /app/src

COPY .env /app

WORKDIR /app

RUN npm install

EXPOSE 8080

CMD npm start