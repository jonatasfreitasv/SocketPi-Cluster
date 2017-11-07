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

        const current_microsecond = process.hrtime()[0] * 1000000 + process.hrtime()[1] / 1000;

        io.emit('event', new Date());
        console.log(`Send data in ${new Date()}`)
    }, process.env.CLIENT_SEND_DATA_INTERVAL_SECONDS)

});

io.on('disconnect', function(){
    clearInterval(data_interval);
    console.log('Disconected!');
});
