const exec = require('child_process').exec;
exec('mosquitto_pub -t gpio/alarm/go -m startfading');
/*
var Gpio = require('pigpio').Gpio;
var ledr = new Gpio(15, { mode: Gpio.OUTPUT });
var ledg = new Gpio(18, { mode: Gpio.OUTPUT });
var ledb = new Gpio(14, { mode: Gpio.OUTPUT });

function ledr_pwm(pwm_value) {
    ledr.pwmWrite(pwm_value);
}

function ledg_pwm(pwm_value) {
    ledg.pwmWrite(pwm_value);
}

function ledb_pwm(pwm_value) {
    ledb.pwmWrite(pwm_value);
}

function led_pwm(pwm_value) {
    ledr.pwmWrite(pwm_value);
    ledg.pwmWrite(pwm_value);
    ledb.pwmWrite(pwm_value);
}

var i = 234;//90
fade_timer = setInterval(function () {
    console.log(i);
    ledr_pwm(i - 6);//-5
    ledg_pwm(i );//-20
    ledb_pwm(i - 5);
    //led_pwm(i);
    i += 5;
    if (i > 255) {
        i = 234;
    }//clearInterval(fade_timer); }
}, 3000);

console.log("After interval");
*/
