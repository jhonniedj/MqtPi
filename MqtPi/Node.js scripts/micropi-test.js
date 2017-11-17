var mqtt = require('mqtt');
var HOST = "localhost";
var client = mqtt.connect('mqtt://' + HOST);

var exec = require('child_process').exec;
exec('sudo pilight-daemon');

var Gpio = require('pigpio').Gpio;
var lamp = new Gpio(4, { mode: Gpio.OUTPUT });
var ledr = new Gpio(15, { mode: Gpio.OUTPUT });
var ledg = new Gpio(18, { mode: Gpio.OUTPUT });
var ledb = new Gpio(14, { mode: Gpio.OUTPUT });
var DC = 0;

//lamp.pwmFrequency(16000);

//setInterval(function () {
//  DC += 1;
//  if (DC > 510) {
//    DC = 0;
//  }
//  if (DC > 255){
//    lamp.pwmWrite(255 - (DC - 255));
    //console.log(255 - (DC - 255));
//   }
//  else { lamp.pwmWrite(DC); }
  //console.log(DC);
//}, 20);
//exec('sudo pilight-send -p kaku_switch -i 39661568 -u 1 -f');

client.on('connect', function () {
    client.subscribe('gpio/#');
    console.log('Server listening on ' + HOST);
})

client.on('message', function (topic, message) {
    //console.log('Server listening on ' + HOST);
    // message is Buffer
    MQTT_datahandle(topic, message.toString())
    //client.end()
})

function MQTT_datahandle(topic, message) {
    d = message;
    d = d.trim();

    if (topic === "deur"){
        if (d === "tring!"){
          led_flash();
          led_on();
        }

    }
    if (topic === "gpio/red"){
        if (d > 255) { ledr_pwm(255); }
        else { ledr_pwm(d); }
    }

    if (topic === "gpio/green"){
        if (d > 255) { ledg_pwm(255); }
        else { ledg_pwm(d); }
    }

    if (topic === "gpio/blue"){
        if (d > 255) { ledb_pwm(255); }
        else { ledb_pwm(d); }
    }


    //console.log('connection data from %s: %j', remoteAddress, d);
if (topic !== "gpio/red" && topic !== "gpio/green" && topic !== "gpio/blue"){
    if (d === "0") {
        //led_off();
        if (topic === "gpio/amp"){
                console.log('amplifier is turned off');
                 exec('sudo pilight-send -p kaku_switch -i 39661568 -u 14 -f');
                }
        else if (topic === "gpio/lamp"){
                console.log('lamp is turned off');
                 exec('sudo pilight-send -p kaku_switch -i 39661568 -u 1 -f');
                }
        else {
        led_off();
        }
        //console.log(topic);
    }
    else if (d === "1") {
        //led_on();
        if (topic === "gpio/amp"){
                console.log('amplifier is turned on');
                 exec('sudo pilight-send -p kaku_switch -i 39661568 -u 14 -t');
                }
        else if (topic === "gpio/lamp"){
                console.log('lamp is turned on');
                 exec('sudo pilight-send -p kaku_switch -i 39661568 -u 1 -t');
                }
        else {
        led_on();
        }
    }
    else if (d === "2") {
        led_flash();
        console.log('led is set to flicker');
    }
    else if (!d.search("<d-")) {
        var dimmerdata = d.replace("<d-", "");
        dimmerdata = dimmerdata.replace(">", "");
        var dimmerdata_round = Math.round(dimmerdata * 2.55);
        console.log('dimmerdata:' + dimmerdata_round);
        if (dimmerdata_round > 255) { led_pwm(255); }
        else { led_pwm(dimmerdata_round); }
    }
    else {
        //conn.write('DATA received:[' + d.toUpperCase() + ']');
        console.log('DATA:[' + d + ']');
    }
}
}
function led_flash() {
    var isLedOn = 0;
    var configTimeout = 100;
    var i = 0;
    var ledoldstate = ledr.digitalRead();
    console.log('led was: ' + ledoldstate);
    var ledflickering_interval = setInterval(function () {
        isLedOn = +!isLedOn;
        //isLedOn = !isLedOn;
        ledr.digitalWrite(isLedOn);
        ledg.digitalWrite(isLedOn);
        ledb.digitalWrite(isLedOn);

        i++;
        if (i > 20) {
            clearInterval(ledflickering_interval);
            ledr.digitalWrite(ledoldstate);
            ledg.digitalWrite(ledoldstate);
            ledb.digitalWrite(ledoldstate);
            console.log('led will be: ' + ledoldstate);
}
    }, configTimeout);

}

function PWM_pulse() {
    dutyCycle = 0;
    setInterval(function () {
        ledr.pwmWrite(dutyCycle);
        ledg.pwmWrite(dutyCycle);
        ledb.pwmWrite(dutyCycle);

        dutyCycle += 1;
        if (dutyCycle > 255) {
            dutyCycle = 0;
        }
    }, 20);
}
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

function led_on() {
    ledr.digitalWrite(1);
    ledg.digitalWrite(1);
    ledb.digitalWrite(1);
    }

function led_off() {
    ledr.digitalWrite(0);
    ledg.digitalWrite(0);
    ledb.digitalWrite(0);
    }
