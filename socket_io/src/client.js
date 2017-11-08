const figlet = require('figlet');
const socket = require('socket.io-client');
const SDC = require('statsd-client');

let sdc = new SDC({host: process.env.STATSD_HOST || '127.0.0.1', port: process.env.STATSD_PORT || 8125, debug: false});

require('dotenv').config();

let io = socket.connect(`ws://${process.env.SOCKET_SERVER_HOST}:${process.env.SOCKET_PORT_CLIENT}`);

figlet('SocketPI Cluster - Client', function(err, data) {
    console.log(data);
    console.log(`- wating connection on socket server - ${process.env.SOCKET_SERVER_HOST}:${process.env.SOCKET_PORT_CLIENT}`);
});

let data_interval;

io.on('connect', function(){

    console.log('Connected!');

    data_interval = setInterval(()=>{

        for(let i=0; i < process.env.EVENTS_PER_SECOND;i++)
        {
            const now = new Date();
            io.emit('event', now.getTime());

            //console.log(`Send data on ${now}`)
        }

    }, 1000)

});

io.on('pong', data => {

    let latency = new Date().getTime() - data;
    latency = latency > 0 ? latency : 0;

    sdc.timing('socketio.server_pong_latency', latency);

    //console.log(`Latency from server is ${latency}ms`);

});

io.on('broadcast', data => {
    console.log(data);
});

io.on('disconnect', () => {
    clearInterval(data_interval);
    console.log('Disconected!');
});
