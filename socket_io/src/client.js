const figlet = require('figlet');
const socket = require('socket.io-client');

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

        const now = new Date();

        io.emit('event', now.getTime());
        console.log(`Send data on ${now}`)

    }, process.env.CLIENT_SEND_DATA_INTERVAL_SECONDS)

});

io.on('pong', data => {
    const latency = new Date().getTime() - data;
    console.log(`Latency from server is ${latency}ms`);
});

io.on('broadcast', data => {
    console.log(data);
});

io.on('disconnect', () => {
    clearInterval(data_interval);
    console.log('Disconected!');
});
