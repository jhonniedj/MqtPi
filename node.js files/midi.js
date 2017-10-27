var midi = require('midi');
const exec = require('child_process').exec;

// Set up a new input.
var input = new midi.input();

// Count the available input ports.
input.getPortCount();

// Get the name of a specified input port.
input.getPortName(1);

// Configure a callback.
input.on('message', function (deltaTime, message) {
    // The message is an array of numbers corresponding to the MIDI bytes:
    //   [status, data1, data2]
    // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
    // information interpreting the messages.
    //console.log('m:' + message);
    var time = new Date().toLocaleString();
    if (message[2] == "127") {
        if (message[1] == "23") { console.log("lamp: " + time); exec("mosquitto_pub -h micropi -t deur/lamp -m \"Lamp:" + time + "\""); }
        if (message[1] == "33") { console.log("bell: " + time); exec("mosquitto_pub -h micropi -t deur/lamp_off -m \"Lamp_off:" + time + "\""); }

        if (message[1] == "24") { console.log("debug: " + time); exec("mosquitto_pub -h micropi -t deur/bel -m \"" + time + "\""); }
        if (message[1] == "34") { console.log("debug: " + time); exec("mosquitto_pub -h micropi -t deur/button -m \"tring! debug - " + time + "\""); }

        if (message[1] == "35") { console.log("debug: " + time); exec("mosquitto_pub -h micropi -t deur/debug -m \"DEBUG:" + time + "\""); }
        
        if (message[1] == "30") { console.log("ON!"); exec("mosquitto_pub -h micropi -t gpio/amp -m 1"); }
        if (message[1] == "40") { console.log("OFF!"); exec("mosquitto_pub -h micropi -t gpio/amp -m 0"); }

        if (message[1] == "31") { console.log("ON!"); exec("mosquitto_pub -h micropi -t gpio/lamp -m 1"); }
        if (message[1] == "41") { console.log("OFF!"); exec("mosquitto_pub -h micropi -t gpio/lamp -m 0"); }
    }
});


// Open the first available input port.
input.openPort(1);

// Sysex, timing, and active sensing messages are ignored
// by default. To enable these message types, pass false for
// the appropriate type in the function below.
// Order: (Sysex, Timing, Active Sensing)
// For example if you want to receive only MIDI Clock beats
// you should use
// input.ignoreTypes(true, false, true)
input.ignoreTypes(true, true, true);

// ... receive MIDI messages ...
console.log("Ready");

// Close the port when done.