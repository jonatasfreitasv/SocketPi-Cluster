const figlet = require('figlet');
const io = require('socket.io')(process.env.SOCKET_SERVER_PORT || 843);
const SDC = require('statsd-client');

require('dotenv').config();

let sdc = new SDC({host: process.env.STATSD_HOST, port: process.env.STATSD_PORT || 8125, debug: false});

sdc.gauge('socketio.connected_clients', 0);

io.on('connection', function (socket) {

    console.log('Client connected!');
    sdc.gaugeDelta('socketio.connected_clients', 1);

    socket.on('event', (data) => {
        const end = new Date() - new Date(data);
        console.log(`Data received in ${end}ms`);
        sdc.increment('socketio.events');
        sdc.timing('socketio.delay', end);
    });

    socket.on('disconnect', function() {
        console.log('Client disconnect!');
        sdc.gaugeDelta('socketio.connected_clients', -1);
    });

});

figlet('SocketPI Cluster - Server', function(err, data) {
    console.log(data);
    console.log(`- start on port ${process.env.SOCKET_SERVER_PORT || 843}`)
});