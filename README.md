# MqtPi
IOT/Home Automation with MQTT on Raspberry Pi
Maker: Jonathan van Rijn (jhonniedj)

Get Started
==============
To get started, we need to initialise some settings on the raspberry pi.
<br>First we start with a clean Raspberry pi, with a Raspbian Lite or Full/Desktop OS

- **Updating the Rpi**:
<br>`sudo apt-get update`
<br>`sudo apt-get upgrade`
<br>`sudo rpi-update`

- **Customizing your Rpi:** *(optional)*
<br>`sudo raspi-config`
<br>(change hostname)
<br>(chang password)

- **Installing latest safe node.js:**
<br>`sudo apt-get install node`
<br>(updating)
<br>`wget https://nodejs.org/dist/v6.11.3/node-v6.11.3-linux-armv6l.tar.xz`
<br>`tar -xvf node-v6.11.3-linux-armv6l.tar.xz`
<br>`cd node-v6.11.3-linux-armv6l.tar.xz`
<br>`sudo cp -R * /usr/local/`
<br>(cleaning up)
<br>`rm node-v6.11.3-linux-armv6l.tar.xz`
<br>`rm -rf node-v6.11.3-linux-armv6l.tar.xz`
<br>(checking if version is updated)
<br>`node -v`

- **Installing NPM (node package manager):**
<br>`sudo apt-get install npm`
- **Installing NPM-packages**
<br>`sudo apt-get install pigpio`
<br>`sudo npm install pigpio `
<br>`sudo npm install mqtt`
- **Installing PM2** *(optional)*
<br>`sudo npm install pm2`
<br>*PM2 can be used to run node.js scripts at startup,*
<br>*monitor scripts or to keep scripts running*

- **Installing MQTT Broker Mosquitto:**
<br>`sudo apt-get install mosquitto mosquitto-clients`
<br>subscribe test with:`mosquitto_sub -t topic`
<br>publish test with:`mosquitto_pub -t topic -m message`

Usefull Tools
==============
- **Midnight commander:**
<br>`sudo apt-get install mc`
<br>run with `sudo mc`
<br>
- **Screen:**
<br>`sudo apt-get install screen`
<br>`screen`
<br>can be used with CTRL+A, C to go to create new screen
<br>can be used with CTRL+A, N to go to next screen
<br>can be used with CTRL+A, P to go to previous screen
<br>can be used with CTRL+A, D to go to discard screen
<br>can be used with CTRL+D to go to destroy session
<br>`screen-r` *(to recover session)*
