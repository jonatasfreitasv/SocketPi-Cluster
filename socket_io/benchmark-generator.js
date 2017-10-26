module.exports = {

    onConnect : function(client, done) {
        done();
    },

    sendMessage : function(client, done) {
        client.emit('event', new Date());
        done();
    }

};