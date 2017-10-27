var Gpio = require('pigpio').Gpio;
var bell = new Gpio(17, { mode: Gpio.OUTPUT });
var lamp = new Gpio(27, { mode: Gpio.OUTPUT });
var button = new Gpio(4, { mode: Gpio.INPUT, pullUpDown: Gpio.PUD_DOWN, edge: Gpio.EITHER_EDGE });

var i = 0;
var bell_enable = true;
var lamp_enable = true;
var lamp_time = 180000;
bell.digitalWrite(1);
lamp.digitalWrite(1);

var mqtt = require('mqtt');
var HOST = "micropi";
var client = mqtt.connect('mqtt://' + HOST);

var admin = require("firebase-admin");
var serviceAccount = require("/home/pi/mqtpi-nl-firebase.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://mqtpi-nl.firebaseio.com"
});

client.on('connect', function () {
    client.subscribe('deur/#');
    console.log('Server listening on ' + HOST);
    console.log('connected!, ready to ring!');
});

client.on('message', function (topic, message) {
    var msg = message.toString();
    console.log(msg);
    if (topic === "deur/bel") {
        if (bell_enable) { fb_bell(); } }//dingdong(); } }
    if (topic === "deur/lamp") { if (lamp_enable) { lamp_time = 2000; lamp_on(); } }
    if (topic === "deur/lamp_off") { clearTimeout(lamp_interval); lamp_enable = true; lamp.digitalWrite(1); }
});

button.on('interrupt', function (level) {
    if (level === 1) {
        console.log('input:' + level);
        var time = new Date().toLocaleString();
        client.publish('deur/button', "\"tring! - " + time + "\"");

        if (bell_enable) { dingdong(); }
        if (lamp_enable) { lamp_time = 180000; lamp_on(); }
        fb_bell();
    }
});

var bell_interval;
function dingdong() {
    bell_enable = false;
    bell_interval = setInterval(function () {
        if (i % 4 === 0) {
            bell.digitalWrite(0);
            //console.log("0");
        }
        if (i % 4 === 1) {
            bell.digitalWrite(1);
            //console.log("1");
        }
        //console.log("i: " + i);
        if (i > 10) { clearInterval(bell_interval); bell.digitalWrite(1); i = 0; bell_enable = true; }
        else { i++; }

    }, 170);
}

var lamp_interval;
function lamp_on() {
    lamp_enable = false;
    lamp.digitalWrite(0);
    lamp_interval = setTimeout(function () {
        lamp.digitalWrite(1);
        lamp_enable = true;
    }, lamp_time);//3 min
}

function fb_bell() {
    // The topic name can be optionally prefixed with "/topics/".
    const topic = "deur";

    // See the "Defining the message payload" section below for details
    // on how to define a message payload.
    var payload = {
        data: {
            id: 'data',
            title: "Loveboat Telegram:",
            body: "I Love you!!",
            priority: "high",
            sound: 'default'
        }
    };

    var payload_1 = {
        notification: {
            id: 'notification',
            title: "Loveboat Telegram:",
            body: "I Love you!!",
            priority: "high",
            sound: 'default'
        }
    };

    admin.messaging().sendToTopic(topic, payload_1)
        .then(function (response) {
            // See the MessagingTopicResponse reference documentation for the
            // contents of response.
            console.log("Successfully sent message:", response);
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
                console.log("Successfully sent message:", response);
                process.exit();
            })
            .catch(function (error) {
                console.log("Error sending message:", error);
            });
    }, 1000);//3 sec

}