let start = 0;
let socket = null;

$(document).ready(() => {

    eventsBehavior();

    helpers.sendEvents();
    helpers.socketIO();

    helpers.updateLatency();

    $('#latency').text('0');

});

const eventsBehavior = () => {

    $('#addButton').on('click', () => {
        helpers.changeEventsPerSecondNumber(1);
    });

    $('#removeButton').on('click', () => {

        if(parseInt($('#eventsPerSecond').text()) > 1)
        {
            helpers.changeEventsPerSecondNumber(-1);
        }

    });

    $('#start,#stop').on('click', ()=>{

        if(helpers.socket && helpers.socket.connected)
        {
            $('#start,#stop').toggleClass('is-hidden');
            helpers.start = helpers.start === 0 ? 1 : 0;
        }

    });

};

const helpers = {

    start: 0,
    socket: null,
    sendEventTime: null,
    latency: 0,

    changeEventsPerSecondNumber(value){

        if(this.socket && this.socket.connected)
        {

            let number = parseInt($('#eventsPerSecond').text());

            number += value;
            $('#eventsPerSecond').text(number);

        }

    },

    incrementEventsSent(){

        let events_sent = parseInt($('#eventsSent').text());
        events_sent += 1;

        $('#eventsSent').text(events_sent);

    },

    sendEvents(){

        setInterval(()=>{

            if(this.start && this.socket && this.socket.connected)
            {

                for(let i=0;i < parseInt($('#eventsPerSecond').text());i++)
                {
                    //console.log(`${new Date()}`);
                    this.incrementEventsSent();

                    this.sendEventTime = new Date().getTime();
                    this.socket.emit('event', this.sendEventTime);

                }

            }

        }, 1000);

    },

    updateLatency(){

        setInterval(()=>{

            if(this.start)
            {
                $('#latency').text(this.latency);
                $.get(`http://192.168.0.100:8080/statsd?time=${this.latency}`);
            }

        }, 1000);

    },

    socketIO(){

        this.socket = io('http://192.168.0.101:843');

        this.socket.on('connect', function(){
            $('#clusterConnection').addClass('is-success').removeClass('is-danger');
        });

        this.socket.on('disconnect', function(){

            $('#clusterConnection').addClass('is-danger').removeClass('is-success');

            $('#start').addClass('is-hidden');
            $('#stop').removeClass('is-hidden');
            this.start =  0;

        });

        this.socket.on('pong', ()=> {
            this.latency = new Date().getTime() - this.sendEventTime;
        });

    }

};