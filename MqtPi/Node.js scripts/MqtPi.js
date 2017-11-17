var mqtt = require('mqtt');
var HOST = "minipi";
var client = mqtt.connect('mqtt://' + HOST);

client.on('connect', function () {
    client.subscribe('presence');
})

client.on('message', function (topic, message) {
    console.log('Server listening on ' + HOST);

    // message is Buffer
    MQTT_datahandle(message.toString())
    //client.end()
})




function MQTT_datahandle(message) {
    d = d.trim();
    //console.log('connection data from %s: %j', remoteAddress, d);
    if (d === "0") {
        led_off();
        console.log('led is turned off');
    }
    else if (d === "1") {
        led_on();
        console.log('led is turned on');
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
        conn.write('DATA received:[' + d.toUpperCase() + ']');
        console.log('DATA:[' + d + ']');
    }



}


var Gpio = require('pigpio').Gpio;
var led = new Gpio(14, { mode: Gpio.OUTPUT });

function led_flash() {
    var isLedOn = 0;
    var configTimeout = 100;
    var i = 0;
    var ledoldstate = led.digitalRead();
    console.log('led was: ' + ledoldstate);
    var ledflickering_interval = setInterval(function () {
        isLedOn = +!isLedOn;
        //isLedOn = !isLedOn;
        led.digitalWrite(isLedOn);
        i++;
        if (i > 20) {
            clearInterval(ledflickering_interval); led.digitalWrite(ledoldstate); console.log('led will be: ' + ledoldstate);
}
    }, configTimeout);

}

function PWM_pulse() {
    dutyCycle = 0;
    setInterval(function () {
        led.pwmWrite(dutyCycle);

        dutyCycle += 1;
        if (dutyCycle > 255) {
            dutyCycle = 0;
        }
    }, 20);
}
function led_pwm(pwm_value) {
    led.pwmWrite(pwm_value);
}

function led_on() {
     led.digitalWrite(1);
}

function led_off() {
    led.digitalWrite(0);
}