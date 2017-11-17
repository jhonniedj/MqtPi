var mqtt = require('mqtt');
var HOST = "localhost";
var client = mqtt.connect('mqtt://' + HOST);

client.on('connect', function () {
	client.publish('deur', 'tring!')
})