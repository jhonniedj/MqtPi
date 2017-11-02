//http://localhost:8080/api/users?id=4&token=sdfa3&geo=us

// grab the packages we need
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var mqtt = require('mqtt');
var HOST = "micropi";
var client = mqtt.connect('mqtt://' + HOST);
client.on('connect', function () {
    //client.subscribe('gpio/#');
    //client.subscribe('deur/button');
    console.log('MQTT Connected to ' + HOST);
})

// start the server
app.listen(port);
app.get('/', function (req, res) {
    var lamp = req.query['lamp'];
    if (lamp === "0") { client.publish('gpio/lamp', '0'); }
    if (lamp === "1") { client.publish('gpio/lamp', '1'); }
    var amp = req.query['amp'];
    if (amp === "0") { client.publish('gpio/amp', '0'); }
    if (amp === "1") { client.publish('gpio/amp', '1'); }
    var r = req.query['R'];
    if (r) { client.publish('gpio/red', r); }
    var g = req.query['G'];
    if (g) { client.publish('gpio/green', g); }
    var b = req.query['B'];
    if (b) { client.publish('gpio/blue', b); }

    //var okok = "<script>(function() {window.history.back();A})();</script>";  //return
    var debugstring = 
    "lamp: " + lamp +
    "<br> amp: " + amp +
    "<br> R: " + r +
    "<br> G: " + g +
    "<br> B: " + b;
    res.send(debugstring);
    console.log(debugstring);
});

console.log('Server started! At http://localhost:' + port);