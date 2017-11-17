var admin = require("firebase-admin");

var serviceAccount = require("D:\\Dropbox\\Jona\\.Android apps\\MqtPi\\firebase node\\mqtpi-nl-firebase-adminsdk-biaio-7f2fe0f6b1.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mqtpi-nl.firebaseio.com"
});

// The topic name can be optionally prefixed with "/topics/".
var topic = "news";

// See the "Defining the message payload" section below for details
// on how to define a message payload.
var payload = {
  data: {
	id:'data',
    title: "Loveboat Telegram:",
    body: "I Love you!!",
	priority: "high",
	sound: 'default'
  },  notification: {
    id:'notification',
	title: "Loveboat Telegram:",
    body: "I Love you!!",
	priority: "high",
	sound: 'default'
  }

};

admin.messaging().sendToTopic(topic, payload)
  .then(function(response) {
    // See the MessagingTopicResponse reference documentation for the
    // contents of response.
    console.log("Successfully sent message:", response);
	process.exit();
	})
  .catch(function(error) {
    console.log("Error sending message:", error);
  });