var mqtt = require('mqtt');
var HOST = "localhost";
var client = mqtt.connect('mqtt://' + HOST);

var Gpio = require('pigpio').Gpio,
  button = new Gpio(4, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_DOWN,
    edge: Gpio.EITHER_EDGE
  })

  client.on('connect', function () {
	  console.log('connected!, ready to ring!');
})
 
button.on('interrupt', function (level) {
    console.log('input:'+level);
	client.publish('deur', 'tring!')
});