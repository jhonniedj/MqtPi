/*
  Basic ESP8266 MQTT example

  This sketch demonstrates the capabilities of the pubsub library in combination
  with the ESP8266 board/library.

  It connects to an MQTT server then:
  - publishes "hello world" to the topic "outTopic" every two seconds
  - subscribes to the topic "inTopic", printing out any messages
    it receives. NB - it assumes the received payloads are strings not binary
  - If the first character of the topic "inTopic" is an 1, switch ON the ESP Led,
    else switch it off

  It will reconnect to the server if the connection is lost using a blocking
  reconnect function. See the 'mqtt_reconnect_nonblocking' example for how to
  achieve the same result without blocking the main loop.

  To install the ESP8266 board, (using Arduino 1.6.4+):
  - Add the following 3rd party board manager under "File -> Preferences -> Additional Boards Manager URLs":
       http://arduino.esp8266.com/stable/package_esp8266com_index.json
  - Open the "Tools -> Board -> Board Manager" and click install for the ESP8266"
  - Select your ESP8266 in "Tools -> Board"

*/

#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// Update these with values suitable for your network.

const char* ssid = "XXSSIDXX";//<-- CHANGE THIS
const char* password = "XXPASSXX";//<-- CHANGE THIS
const char* mqtt_server = "192.168.1.X";//<-- CHANGE THIS
const int button_on = 4;     // the number of the pushbutton pin//<-- CHANGE THIS (if you want)
const int button_off = 5;     // the number of the pushbutton pin//<-- CHANGE THIS (if you want)
bool led = false;
WiFiClient espClient;
PubSubClient client(espClient);
long lastMsg = 0;
char msg[50];
int value = 0;

void setup() {
  pinMode(BUILTIN_LED, OUTPUT);     // Initialize the BUILTIN_LED pin as an output
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  //client.setCallback(callback);

  // initialize the pushbutton pin as an input:
  pinMode(button_on, INPUT);
  pinMode(button_on, INPUT_PULLUP);

  pinMode(button_off, INPUT);
  pinMode(button_off, INPUT_PULLUP);

  attachInterrupt(digitalPinToInterrupt(button_on), lamp_on, CHANGE);
  attachInterrupt(digitalPinToInterrupt(button_off), lamp_off, CHANGE);
}

void setup_wifi() {

  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    if (led == false) {
      digitalWrite(BUILTIN_LED, LOW);
      led = true;
    }
      else {
      digitalWrite(BUILTIN_LED, HIGH);
      led = false;
    }

  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  // Switch on the LED if an 1 was received as first character
  if ((char)payload[0] == '1') {
    digitalWrite(BUILTIN_LED, LOW);   // Turn the LED on (Note that LOW is the voltage level
    // but actually the LED is on; this is because
    // it is acive low on the ESP-01)
  } else {
    digitalWrite(BUILTIN_LED, HIGH);  // Turn the LED off by making the voltage HIGH
  }

}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("ESP8266Client")) {//<-- CHANGE THIS (if you want)
      Serial.println("connected");
      client.publish("TOPIC_TO_SEND_MSG", "0");//<-- CHANGE THIS
      Serial.println("SETTING LAMP OFF!");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}
int off_set = '0';
int on_set = '0';
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
      digitalWrite(BUILTIN_LED, LOW);

  if (on_set == '1') {
    client.publish("TOPIC_TO_SEND_MSG", "1");//<-- CHANGE THIS
    Serial.println("SETTING LAMP ON!");
    on_set = '0';
  }
  if (off_set == '1') {
    client.publish("TOPIC_TO_SEND_MSG", "0");//<-- CHANGE THIS
    Serial.println("SETTING LAMP OFF!");
    off_set = '0';
  }
}
void lamp_on() {
  on_set = '1';
}

void lamp_off() {
  off_set = '1';
}

