var rpi433    = require('rpi-433'),
    rfSniffer = rpi433.sniffer({
      pin: 0,                     //Snif on GPIO 2 (or Physical PIN 13) 
      debounceDelay: 10          //Wait 500ms before reading another code 
    });
 
// Receive (data is like {code: xxx, pulseLength: xxx}) 
rfSniffer.on('data', function (data) {
  console.log('Code received: '+data.code+' pulse length : '+data.pulseLength);
});
console.log('ready'); 
