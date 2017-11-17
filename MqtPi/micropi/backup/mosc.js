var mqtt = require('mqtt')

var client = mqtt.connect('mqtt://minipi');

client.publish('presence', 'Client is alive.. Test Ping! ' + Date());

client.end();
