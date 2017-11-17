var mqtt = require('mqtt');
var HOST = "localhost";
var client = mqtt.connect('mqtt://' + HOST);

const { spawn } = require('child_process');
const exec = require('child_process').exec;
const fs = require('fs');
const RUNFILE = "fade.js"
const DEBUGFILE = "fade.log"

//var exec = require('child_process').exec;
exec('sudo pilight-daemon');

var Gpio = require('pigpio').Gpio;
var lamp = new Gpio(4, { mode: Gpio.OUTPUT });
var ledr = new Gpio(15, { mode: Gpio.OUTPUT });
var ledg = new Gpio(18, { mode: Gpio.OUTPUT });
var ledb = new Gpio(14, { mode: Gpio.OUTPUT });
var DC = 0;

client.on('connect', function () {
    client.subscribe('gpio/#');
    client.subscribe('deur');
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

    if (topic === "deur") {
        if (d === "tring!") {
            console.log('Ding Dong!!');
            led_flash();
            led_flash();
            led_flash();
            led_flash();
        }
    }

    if (topic === "gpio/alarm") {
        //add_cron("0 5 * * 1-5");//elke ma-vrij 5:00
    }

    if (topic === "gpio/red") {
        if (d > 255) { ledr_pwm(255); }
        else { ledr_pwm(d); }
    }

    if (topic === "gpio/green") {
        if (d > 255) { ledg_pwm(255); }
        else { ledg_pwm(d); }
    }

    if (topic === "gpio/blue") {
        if (d > 255) { ledb_pwm(255); }
        else { ledb_pwm(d); }
    }

    //console.log('connection data from %s: %j', remoteAddress, d);
    if (topic !== "gpio/red" && topic !== "gpio/green" && topic !== "gpio/blue") {
        if (d === "0") {
            //led_off();
            if (topic === "gpio/amp") {
                console.log('amplifier is turned off');
                exec('sudo pilight-send -p kaku_switch -i 39661568 -u 14 -f');
            }
            else if (topic === "gpio/lamp") {
                console.log('lamp is turned off');
                exec('sudo pilight-send -p kaku_switch -i 39661568 -u 1 -f');
            }
            else {
                led_off();
                clearInterval(fade_timer);
            }
            //console.log(topic);
        }
        else if (d === "1") {
            //led_on();
            if (topic === "gpio/amp") {
                console.log('amplifier is turned on');
                exec('sudo pilight-send -p kaku_switch -i 39661568 -u 14 -t');
            }
            else if (topic === "gpio/lamp") {
                console.log('lamp is turned on');
                exec('sudo pilight-send -p kaku_switch -i 39661568 -u 1 -t');
            }
            else {
                led_on();
            }
        }
        else if (d === "2") {
            //led_flash();
            //ledr_pwm(222);
            //ledg_pwm(51);
            //ledb_pwm(254);
            led_fade();
            console.log('led is NOT set to flicker');
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
var fade_timer;
function led_fade(){
    var i = 110;//90
    fade_timer = setInterval(function () {
        //console.log(i);
        if (i < 230) {
            ledr_pwm(i - 5);//-5
            ledg_pwm(i - 20);//-20
            ledb_pwm(i);
        }
        //led_pwm(i);
        if (i == 230) { ledr_pwm(228); ledg_pwm(234); ledb_pwm(229); }
        if (i > 230) {
            var rtmp = 228 + (i - 230);
            var gtmp = 234 + (i - 230);
            var btmp = 229 + (i - 230);
            if (rtmp > 255) { rtmp = 255; }
            if (gtmp > 255) { gtmp = 255; }
            if (btmp > 255) { btmp = 255; }
            ledr_pwm(rtmp); ledg_pwm(gtmp); ledb_pwm(btmp);
        }
        i += 1;
        if (i > 255) {
            i = 110;
            clearInterval(fade_timer);
        }//clearInterval(fade_timer); }
    }, 4138); //10*60.000 = 10 min / 145 steps = 4137
}

function led_flash() {
    var isLedOn = 0;
    var configTimeout = 100;
    var i = 0;
    var ledoldstater = ledr.digitalRead();
    var ledoldstateg = ledg.digitalRead();
    var ledoldstateb = ledb.digitalRead();

    console.log('led was: ' + ledoldstater + ledoldstateg + ledoldstateb);
    var ledflickering_interval = setInterval(function () {
        isLedOn = +!isLedOn;
        //isLedOn = !isLedOn;
        ledr.digitalWrite(isLedOn);
        ledg.digitalWrite(isLedOn);
        ledb.digitalWrite(isLedOn);

        i++;
        if (i > 20) {
            clearInterval(ledflickering_interval);
            ledr.digitalWrite(ledoldstater);
            ledg.digitalWrite(ledoldstateg);
            ledb.digitalWrite(ledoldstateb);
            console.log('led will be: ' + + ledoldstater + ledoldstateg + ledoldstateb);
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


function add_cron(time) {
    exec('(crontab -l 2>/dev/null; echo "' + time + ' /usr/local/bin/node ' + RUNFILE + ' > ' + DEBUGFILE + ' 2>&1") | crontab -', function (error, stdout, stderr) {
        if (stdout != "") { console.log('WARNING: stdout: ' + stdout); }
        if (stderr != "") { console.log('ERROR! stderr: ' + stderr); }
    });
}

function print_cron() {
    exec('crontab -l', function (error, stdout, stderr) {
        const output = stdout + stderr;
        console.log('Cron entry:');
        console.log(output.trim());
    });
}

function cron_backup() {
    exec('crontab -l', function (error, stdout, stderr) {
        const output = stdout + stderr;
        write_backup(output.trim());
    });
}

function clear_cron() {
    exec('crontab -r');

    var child = exec('crontab -l', function (error, stdout, stderr) {
        const output = stdout + stderr;
        var out;
        var empty;
        if (output.search("no crontab for") === 0) {
            console.log('crontab clean succeeded');
        }
        else {
            console.log('Crontab clean failed! - NOT CLEAN!');

            console.log('Cron entry:');
            console.log(output.trim());
        }
    });
}

function write_backup(text) {
    var time = new Date().toLocaleString().
        replace(new RegExp('-', 'g'), '').
        replace(new RegExp(':', 'g'), '').
        replace(/T/, ' ').      // replace T with a space
        replace(/\..+/, '').     // delete the dot and everything after
        replace(new RegExp(' ', 'g'), '-')
    console.log('now:' + time);

    const mkdir = spawn('mkdir', ['.cron-backup']);

    const backup_filename = '.cron-backup/' + time + ".log";
    fs.writeFile(backup_filename, text, function (err, data) {
        if (err) {
            return console.log("ERROR: " + err);
        }
        //console.log("DATA: "+data);
        console.log("backup made in: " + backup_filename);
    });
}