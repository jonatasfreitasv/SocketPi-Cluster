let path = require('path');
let express = require('express');
let cors = require('cors');
const SDC = require('statsd-client');

let sdc = new SDC({host: '192.168.0.100', port: process.env.STATSD_PORT || 8125, debug: false});

let app = express();

let staticPath = path.join(__dirname, '/');

app.use(cors());
app.use(express.static(staticPath));

app.get('/statsd', function (req, res) {

    res.send('ok');
    sdc.timing('socketio.server_pong_latency', parseInt(req.query.time));

});

app.listen(8080, () => {
    console.log('listening');
});