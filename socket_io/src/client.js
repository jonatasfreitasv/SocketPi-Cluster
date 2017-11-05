const figlet = require('figlet');
const socket = require('socket.io-client');

require('dotenv').config();

let io = socket.connect(`${process.env.SOCKET_SERVER_HOST}:${process.env.SOCKET_SERVER_PORT}`);

figlet('SocketPI Cluster - Client', function(err, data) {
    console.log(data);
    console.log(`- wating connection on socket server - ${process.env.SOCKET_SERVER_HOST}:${process.env.SOCKET_SERVER_PORT}`);
});

let data_interval;

io.on('connect', function(){

    console.log('Connected!');

    data_interval = setInterval(()=>{
        io.emit('event', new Date());
        console.log(`Send data in ${new Date()}`)
    }, process.env.CLIENT_SEND_DATA_INTERVAL_SECONDS * 1000)

});

io.on('disconnect', function(){
    clearInterval(data_interval);
    console.log('Disconected!');
});
