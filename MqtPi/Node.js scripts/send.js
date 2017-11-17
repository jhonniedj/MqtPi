var rpi433    = require('rpi-433'),
    rfEmitter = rpi433.emitter({
      pin: 2,                     //Send through GPIO 0 (or Physical PIN 11) 
      pulseLength: 350            //Send the code with a 350 pulse length 
    });
 
// Send 
rfEmitter.sendCode(1234, function(error, stdout) {   //Send 1234 
  if(!error) console.log(stdout); //Should display 1234 
});

rfEmitter.sendCode(1234, {pin: 0})
  .then(function(stdout) {
    console.log('Code sent: ', stdout);
  }, function(error) {
    console.log('Code was not sent, reason: ', error);
  });
 
/* Or :
 
rfEmitter.sendCode(code);
rfEmitter.sendCode(code, {  //You can overwrite defaults options previously set (only for this sent)
  pin: 2,
  pulseLength: 350
});
rfEmitter.sendCode(code, callback);
rfEmitter.sendCode(code, {
  pin: 2,
  pulseLength: 350
}, callback);
*/
 
//rpi-433 uses the kriskowal's implementation of Promises so, 
//if you prefer Promises, you can also use this syntax : 
