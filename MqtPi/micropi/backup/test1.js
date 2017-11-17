var exec = require('child_process').exec; 
//exec('');

var Gpio = require('pigpio').Gpio;
var lamp = new Gpio(4, { mode: Gpio.OUTPUT });
var dutyCycle = 0;

  lamp.pwmWrite(dutyCycle);

  dutyCycle += 5;
  if (dutyCycle > 255) {
    dutyCycle = 0;
  }

