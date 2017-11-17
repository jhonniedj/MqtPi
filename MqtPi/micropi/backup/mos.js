var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://minipi')
 
client.on('connect', function () {
  client.subscribe('presence')
})
 
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
})
