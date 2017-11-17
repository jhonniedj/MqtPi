var mqtt = require('mqtt');
var HOST = "localhost";
var client = mqtt.connect('mqtt://' + HOST);

var exec = require('child_process').exec;
exec('sudo pilight-daemon');

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

button.on('interrupt', function (level) {
    console.log('input:'+level);
        client.publish('deur', 'tring!')
});

function MQTT_datahandle(topic, message) {
    d = message;
    d = d.trim();
    //console.log('connection data from %s: %j', remoteAddress, d);
    if (d === "0") {
        //led_off();
        if (topic === "gpio/amp"){
                console.log('amplifier is turned off');
                 exec('sudo pilight-send -p kaku_switch -i 39661568 -u 14 -f');
                }
        if (topic === "gpio/lamp"){
                console.log('lamp is turned off');
                 exec('sudo pilight-send -p kaku_switch -i 39661568 -u 1 -f');
                }
        //console.log(topic);
    }
    else if (d === "1") {
        //led_on();
        if (topic === "gpio/amp"){
                console.log('amplifier is turned on');
                 exec('sudo pilight-send -p kaku_switch -i 39661568 -u 14 -t');
                }
        if (topic === "gpio/lamp"){
                console.log('lamp is turned on');
                 exec('sudo pilight-send -p kaku_switch -i 39661568 -u 1 -t');
                }
    }
    else if (d === "2") {
        //led_flash();
        console.log('led is set to flicker');
    }
    else if (!d.search("<d-")) {
        var dimmerdata = d.replace("<d-", "");
        dimmerdata = dimmerdata.replace(">", "");
        var dimmerdata_round = Math.round(dimmerdata * 2.55);
        console.log('dimmerdata:' + dimmerdata_round);
        //if (dimmerdata_round > 255) { led_pwm(255); }
        //else { led_pwm(dimmerdata_round); }
    }
    else {
        conn.write('DATA received:[' + d.toUpperCase() + ']');
        console.log('DATA:[' + d + ']');
    }
}


//var Gpio = require('pigpio').Gpio;
//var led = new Gpio(14, { mode: Gpio.OUTPUT });

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
            clearInterval(ledflickering_interval); 
			led.digitalWrite(ledoldstate); 
			console.log('led will be: ' + ledoldstate);
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


