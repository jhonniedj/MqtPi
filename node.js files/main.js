var Gpio = require('pigpio').Gpio;
var led_power = new Gpio(18, { mode: Gpio.OUTPUT });
var ledr = new Gpio(23, { mode: Gpio.OUTPUT });
var ledg = new Gpio(24, { mode: Gpio.OUTPUT });
var ledb = new Gpio(25, { mode: Gpio.OUTPUT });

const { spawn } = require('child_process');
const exec = require('child_process').exec;
const fs = require('fs');
const RUNFILE = "/home/pi/fade.js"
const DEBUGFILE = "/home/pi/fade.log"

//var exec = require('child_process').exec;
exec('sudo pilight-daemon');

var mqtt = require('mqtt');
var HOST = "localhost";
var client = mqtt.connect('mqtt://' + HOST);

var admin = require("firebase-admin");
var serviceAccount = require("/home/pi/mqtpi-nl-firebase.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://mqtpi-nl.firebaseio.com"
});

led_off();

client.on('connect', function () {
    client.subscribe('gpio/#');
    client.subscribe('deur/button');
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

    if (topic === "deur/button") {
        console.log('Topic deur/button!!');

        //if (d === "tring!") {
        if (d.search("tring!") !== -1) {
            console.log('Ding Dong!!');
            fb_bell();
            led_flash();
            led_flash();
            led_flash();
            led_flash();
        }
    }
    if (topic === "gpio/alarm/go") {
        led_fade();
        //add_cron("0 5 * * 1-5");//elke ma-vrij 5:00
    }
    if (topic === "gpio/alarm/time_set") {
        console.log("Received Cron Time String:" + d);
        clear_cron();

        var time_splitted;
        if (d.indexOf("|") > -1) {
            time_splitted = d.split("|");
            for (var i = 0; i < time_splitted.length; i++) {
                if (time_splitted[i].indexOf("*") > -1) {
                    console.log("Adding More Cron:" +  time_splitted[i]);
                    //client.publish('gpio/test', + time_splitted[i]);
                    add_cron(time_splitted[i]);
                }
            }
        }
        else {//if (d.indexOf("|") === -1) {
            if (d.indexOf("*") > -1) {
                console.log("Adding Single Cron:" + d);
                //client.publish('gpio/test', + d);
                add_cron(d);
            }
        }
    }


    //add_cron("0 5 * * 1-5");//elke ma-vrij 5:00
    if (topic === "gpio/alarm/time_get") {
        //cron_backup();
        print_cron();
    }
    if (topic === "gpio/alarm/pause") {
        led_fade_kill()
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
    //versterker
    if (topic === "gpio/amp" && d === "0") {
        console.log('amplifier is turned off');
        exec('sudo pilight-send -p kaku_switch -i 39661568 -u 14 -f');
    }
    if (topic === "gpio/amp" && d === "1") {
        console.log('amplifier is turned off');
        exec('sudo pilight-send -p kaku_switch -i 39661568 -u 14 -t');
    }
    //lamp woonkamer
    if (topic === "gpio/lamp" && d === "0") {
        console.log('lamp is turned off');
        exec('sudo pilight-send -p kaku_switch -i 39661568 -u 1 -f');
    }
    if (topic === "gpio/lamp" && d === "1") {
        console.log('lamp is turned off');
        exec('sudo pilight-send -p kaku_switch -i 39661568 -u 1 -t');
    }
    //ledstrip
    if (topic === "gpio/led/power") {
        if (d === "0") {
            led_power.digitalWrite(1);
        }
        if (d === "1") {
            led_power.digitalWrite(0);
        }
    }
    if (topic === "gpio/led") {
        if (d === "0") {
            led_off();
            clearInterval(fade_timer);
        }
        if (d === "1") {
            led_on();
        }
        if (d === "2") {
            //led_flash();
            ledr_pwm(222);
            ledg_pwm(151);
            ledb_pwm(254);
        }
        if (d === "sleep") {
            sleep_led();
        }
        if (d === "dimm") {
            dimm_led();
        }

    }
    if (topic === "gpio/led/dimmer") {
        //var dimmerdata = d.replace("<d-", "");
        //dimmerdata = dimmerdata.replace(">", "");
        //var dimmerdata_round = Math.round(dimmerdata * 2.55);
        if (d > 1) {
            var dimmerdata_round = Math.round(d * 1.55) + 100;
            //console.log('dimmerdata:' + dimmerdata_round);
            if (dimmerdata_round > 255) { led_pwm(255); }
            else { led_pwm(dimmerdata_round); }
        }
        else { led_off(); }
    }
}
var sleep_led_timeout;
function sleep_led() {
    clearTimeout(sleep_led_timeout);
    dimm_led()
    sleep_led_timeout = setTimeout(function () {
        led_off();
    }, 20000);//35 sec
}
function dimm_led() {
    ledr_pwm(150);
    ledg_pwm(120);
    ledb_pwm(0);
}

function led_fade_kill() {
    clearInterval(fade_timer);
}

var fade_timer;
function led_fade() {
    clearInterval(fade_timer);
    var i = 110;//90
    fade_timer = setInterval(function () {
        //console.log(i);
        if (i < 235) {//230
            ledr_pwm(i - 5);//-5
            ledg_pwm(i - 20 - 40);//-20
            ledb_pwm(i - 40);
        }
        //led_pwm(i);
        if (i == 235) { ledr_pwm(228); ledg_pwm(234); ledb_pwm(229); }
        if (i > 235) {
            var rtmp = 228 + (i - 230);
            var gtmp = 234 + (i - 230) - 40;
            var btmp = 229 + (i - 230) - 40;
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

var pwm_r, pwm_g, pwm_b;
function ledr_pwm(pwm_value) {
    pwm_r = pwm_value;
    ledr.pwmWrite(pwm_value);
    power_check();
}

function ledg_pwm(pwm_value) {
    pwm_g = pwm_value;
    ledg.pwmWrite(pwm_value);
    power_check();
}

function ledb_pwm(pwm_value) {
    pwm_b = pwm_value;
    ledb.pwmWrite(pwm_value);
    power_check();
}

function led_pwm(pwm_value) {
    pwm_r = pwm_g = pwm_b = pwm_value;
    ledr_pwm(pwm_value);
    ledg_pwm(pwm_value);
    ledb_pwm(pwm_value);
    power_check();
}
function power_check() {
    if (pwm_r === 0 && pwm_g === 0 && pwm_b === 0) {
        led_power.digitalWrite(1);
    }
    else { led_power.digitalWrite(0); }
}

function led_on() {
    clearTimeout(sleep_led_timeout);
    led_pwm(255);
}

function led_off() {
    clearTimeout(sleep_led_timeout);
    led_pwm(0);
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
        //        console.log(output.trim());
        var time_out = output.trim();

        if (time_out.search("no crontab for") > -1) { time_out = ""; }
        time_out = time_out.replace(new RegExp('/usr/local/bin/node /home/pi/fade.js > /home/pi/fade.log 2>&1', 'g'), ' | ');//replace cron with seperator " | "
        time_out = time_out.replace(new RegExp('\n', 'g'), '');
        if (time_out.search(" | ") > -1) { time_out = time_out.slice(0, -3); } //remove last " | "
        console.log(time_out.trim());

        client.publish('gpio/alarm/time', time_out.toString());
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

function fb_bell() {
    // The topic name can be optionally prefixed with "/topics/".
    const topic = "deur";

    // See the "Defining the message payload" section below for details
    // on how to define a message payload.
    var payload = {
        data: {
            id: 'data',
            title: "Deurbel",
            body: "Er staat iemand bij de deur!",
            priority: "high",
            sound: 'default'
        }
    };

    var payload_1 = {
        notification: {
            id: 'notification',
            title: "Deurbel",
            body: "Er staat iemand bij de deur!",
            priority: "high",
            sound: 'default'
        }
    };

    admin.messaging().sendToTopic(topic, payload_1)
        .then(function (response) {
            // See the MessagingTopicResponse reference documentation for the
            // contents of response.
            //console.log("Successfully sent message:", response);
        })
        .catch(function (error) {
            console.log("Error sending message:", error);
        });

    setTimeout(function () {// Send a message to devices subscribed to the provided topic.
        // Send a message to devices subscribed to the provided topic.
        admin.messaging().sendToTopic(topic, payload)
            .then(function (response) {
                // See the MessagingTopicResponse reference documentation for the
                // contents of response.
                //console.log("Successfully sent message:", response);
            })
            .catch(function (error) {
                console.log("Error sending message:", error);
            });
    }, 1000);//3 sec
}
