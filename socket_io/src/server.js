const figlet = require('figlet');
const redis = require('socket.io-redis');
const io = require('socket.io')(process.env.SOCKET_PORT_SERVER || 8080);
const SDC = require('statsd-client');
const restify = require('restify');
const _package = require('../package.json');

require('dotenv').config();

let sdc = new SDC({host: process.env.STATSD_HOST || '127.0.0.1', port: process.env.STATSD_PORT || 8125, debug: false});
io.adapter(redis({ host: '192.168.0.101', port: 6379, password: 'abc123' }));


const server = restify.createServer({ name: _package.name, version: _package.version });

sdc.gauge('socketio.connected_clients', 0);

io.on('connection', socket => {

    console.log(`Client connected - Number of clients ${Object.keys(io.sockets.sockets).length}`);
    sdc.gaugeDelta('socketio.connected_clients', 1);

    socket.on('event', data => {

        const end = new Date() - new Date(data);

        sdc.increment('socketio.events');
        sdc.timing('socketio.delay', end);

        socket.emit('pong');


        console.log(`Data received in ${end}ms`);

    });


    socket.on('disconnect', (res)=> {
        console.log(`Client disconnect: ${res}`);
        sdc.gaugeDelta('socketio.connected_clients', -1);
    });

});

figlet('SocketPI Cluster - Server', (err, data) => {
    console.log(data);
    console.log(`- start on port ${process.env.SOCKET_PORT_SERVER || 8080}`)
    console.log(`statsd host ${process.env.STATSD_HOST}`)
});

server.listen(80, function () {
    console.log('%s listening at %s', server.name, server.url);
});