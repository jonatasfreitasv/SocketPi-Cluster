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

sdc.gauge('socketio.connected_clients', 0);

// Health check
app.head('/health', function (req, res) {
    res.sendStatus(200);
});

io.on('error', err => {
    console.log(err);
});

io.on('connection', socket => {

    console.log(`Client connected - Number of clients ${Object.keys(io.sockets.sockets).length}`);
    sdc.gaugeDelta('socketio.connected_clients', 1);

    socket.on('event', data => {

        const current_microsecond = process.hrtime()[0] * 1000000 + process.hrtime()[1] / 1000;

        const delay_milisecond = parseInt((current_microsecond - parseFloat(data)) * 1000);

        console.log('debug', current_microsecond, parseFloat(data), delay_milisecond);

        sdc.increment('socketio.events');
        sdc.timing('socketio.delay', delay_milisecond);

        socket.emit('pong');

        console.log(`Data received in ${delay_milisecond}ms`);

    });


    socket.on('disconnect', (res)=> {
        console.log(`Client disconnect: ${res}`, ` - Number of clients ${Object.keys(io.sockets.sockets).length}`);
        sdc.gaugeDelta('socketio.connected_clients', -1);
    });

});


server.listen(port, function () {

    figlet('SocketPI Cluster - Server', (err, data) => {
        console.log(data);
        console.log(`- start on port ${port}`);
        console.log(`statsd host ${process.env.STATSD_HOST}`)
    });

});