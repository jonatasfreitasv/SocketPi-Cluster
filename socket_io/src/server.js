const figlet = require('figlet');
const redis = require('socket.io-redis');
const SDC = require('statsd-client');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = process.env.SOCKET_PORT_SERVER || 8080;

require('dotenv').config();

let sdc = new SDC({host: process.env.STATSD_HOST || '127.0.0.1', port: process.env.STATSD_PORT || 8125, debug: false});

io.adapter(redis({ host: '192.168.0.101', port: 6379, password: 'abc123' }));

// Health check
app.head('/health', function (req, res) {
    res.sendStatus(200);
});

io.on('error', err => {
    console.log(err);
});

io.on('connection', socket => {

    console.log(`Client connected - Number of clients ${Object.keys(io.sockets.sockets).length}`);

    socket.on('event', data => {

        const latency = new Date().getTime() - data;

        sdc.increment('socketio.events');
        sdc.timing('socketio.latency', latency);

        socket.emit('pong', new Date().getTime());

        console.log(`Latency from client is ${latency}ms`);

    });

    socket.on('disconnect', (res)=> {
        console.log(`Client disconnect: ${res}`, ` - Number of clients ${Object.keys(io.sockets.sockets).length}`);
    });

});

setInterval(()=>{

    io.of('/').adapter.clients((err, clients) => {

        if(clients)
            sdc.gauge('socketio.connected_clients', clients.length);

    });

});

app.get('/clients', function (req, res) {

    io.of('/').adapter.clients((err, clients) => {
        res.send(clients);
    });

});

server.listen(port, function () {

    figlet('SocketPI Cluster - Server', (err, data) => {
        console.log(data);
        console.log(`- start on port ${port}`);
        console.log(`statsd host ${process.env.STATSD_HOST}`)
    });

});