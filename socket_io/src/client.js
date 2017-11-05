const figlet = require('figlet');
const socket = require('socket.io-client');

require('dotenv').config();

const hash = Math.random().toString(36).slice(2, 10);

const connection_string = `http://${process.env.SOCKET_SERVER_HOST}:${process.env.SOCKET_PORT_CLIENT}/socket.io/?hash=${hash}`;

const io = socket.connect(connection_string);

figlet('SocketPI Cluster - Client', function(err, data) {
    console.log(data);
    console.log(`- wating connection on socket server - ${connection_string}`);
});

let data_interval;

io.on('connect', function(){

    console.log('Connected!');

    data_interval = setInterval(()=>{
        io.emit('event', new Date());
        console.log(`Send data in ${new Date()}`)
    }, process.env.CLIENT_SEND_DATA_INTERVAL_SECONDS)

});

io.on('disconnect', function(){
    clearInterval(data_interval);
    console.log('Disconected!');
});
