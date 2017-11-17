/*
var Gpio = require('pigpio').Gpio,
  button = new Gpio(17, {
    mode: Gpio.INPUT,
    pullUpDown: Gpio.PUD_OFF,
    edge: Gpio.EITHER_EDGE
  })

button.on('interrupt', function (level) {
    console.log('input:'+level);
});
*/
// Assumption: the LED is off when the program is started

var Gpio = require('pigpio').Gpio,
  led = new Gpio(17, {
    mode: Gpio.INPUT,
    alert: true
  });

(function () {
  var startTick;

  // Use alerts to determine how long the LED was turned on
  led.on('alert', function (level, tick) {
    var endTick,
      diff;
	var string = '';

    if (level == 1) {
      startTick = tick;
    } else {
      endTick = tick;
      diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic

	string = string + ' ' + diff;
	if (diff>5000){
	  console.log (string);
	  string='';
	}
//      console.log(diff);
    }
  });
}());
